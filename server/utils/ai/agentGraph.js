import {
  END,
  MessagesValue,
  START,
  StateGraph,
  StateSchema,
} from "@langchain/langgraph";
import { agentLLM, checkpointer } from "./llm.js";
import {
  policyInfo,
  productInfo,
  productReviewSummary,
} from "./tools/index.js";
import { AIMessage, SystemMessage, ToolMessage } from "langchain";
import * as z from "zod";
import { getSystemPrompt } from "./prompts.js";

// Defining the tools
const toolsByName = {
  [policyInfo.name]: policyInfo,
  [productInfo.name]: productInfo,
  [productReviewSummary.name]: productReviewSummary,
};

const tools = Object.values(toolsByName);
const llmWithTools = agentLLM.bindTools(tools);

// Define State
const MessagesState = new StateSchema({
  messages: MessagesValue,
  productId: z.string().optional(),
});

// Define Agent node which uses LLM + Tools
const agent = async (state) => {
  try {
    const systemMsg = new SystemMessage(getSystemPrompt(state.productId));

    // Passing only last 15 messages to save context window
    let messagesCutIdx = state.messages.length - 15;

    // Ensuring the context doesn't cut off by sliding backward until we find the Human message
    while (
      messagesCutIdx > 0 &&
      state.messages[messagesCutIdx].type !== "human"
    ) {
      messagesCutIdx--;
    }

    // 1) If messages.length is -ve (or) 0, then passing whole messages array to agent
    // 2) If messages.length is +ve, then passing last 15 messages with humanMessage as start
    const recentMessages = state.messages.slice(Math.max(0, messagesCutIdx));

    const response = await llmWithTools.invoke([systemMsg, ...recentMessages]);

    return { messages: [response] };
  } catch (err) {
    return {
      messages: [
        new AIMessage(
          "Sorry I can't answer your query, please switch to Chat with our customer support agent.",
        ),
      ],
    };
  }
};

// Define custom tool node to pass custom args like productId
const toolNode = async (state) => {
  try {
    // Get the last message
    const lastMessage = state.messages.at(-1);

    // Checking if the lastMessage is the AIMessage
    if (
      !lastMessage ||
      !AIMessage.isInstance(lastMessage) ||
      lastMessage.tool_calls.length === 0
    ) {
      return { messages: [] };
    }

    const toolMessages = [];

    // Call all of them using a loop
    for (const toolCall of lastMessage.tool_calls) {
      const toolInstance = toolsByName[toolCall.name];

      // Invoke the tool and pass the current state's productId into the context config
      if (toolInstance) {
        try {
          const toolMessage = await toolInstance.invoke(toolCall, {
            configurable: { productId: state.productId },
          });

          toolMessages.push(toolMessage);
        } catch (err) {
          // If particular tool fails
          toolMessages.push(
            new ToolMessage({
              content: `I encountered an error while fetching this specific information`,
              tool_call_id: toolCall.id,
            }),
          );
        }
      }
    }

    return { messages: toolMessages };
  } catch (err) {
    // Fallback message for all tools, If entire node fails
    const fallbackMessages =
      state.messages.at(-1)?.tool_calls.map((toolCall) => {
        return new ToolMessage({
          content: "I encountered an error while fetching this information",
          tool_call_id: toolCall.id,
        });
      }) || [];

    return { messages: fallbackMessages };
  }
};

// Defining conditional edge function which either route to tool node (or) end based upon whether LLM made a tool call
const shouldContinue = (state) => {
  const lastMessage = state.messages.at(-1);

  // Check if it's an AIMessage before accessing tool_calls
  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return END;
  }

  // Check if agents needs to call tools
  if (lastMessage.tool_calls.length > 0) {
    return "tools";
  }

  // Agent returning its final response
  return END;
};

// Build and compile agent
export const agentGraph = new StateGraph(MessagesState)
  .addNode("agent", agent)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue, ["tools", END])
  .addEdge("tools", "agent")
  .compile({ checkpointer });
