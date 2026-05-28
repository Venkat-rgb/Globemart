import { catchAsync } from "../utils/catchAsync.js";
import { HumanMessage } from "langchain";
import { agentGraph } from "../utils/ai/agentGraph.js";
import { AppError } from "../utils/appError.js";
import { Conversation } from "../models/Conversation.js";

// AI customer support chat agent which answers (policy related, product info related, product review summary related questions)
export const customerSupportChat = catchAsync(async (req, res, next) => {
  // Get the user message, productId, userId
  const { userMessage, productId, userId } = req.body;

  // Trim, limit the length of message, sanitize the user message
  const trimmedUserMessage = userMessage?.trim();

  // Checking if user has entered the message or not
  if (!trimmedUserMessage) {
    return next(new AppError("Please enter your query!", 400));
  }

  // Limiting the length of user message
  if (trimmedUserMessage.length > 400) {
    return next(
      new AppError("Please enter your query under 400 characters!", 400),
    );
  }

  // Checking if user chat already exists
  let chat = await Conversation.findOne({ userId });

  // Creating new chat for the user as it doesn't exist
  if (!chat) {
    chat = await Conversation.create({
      userId,
      messages: [],
    });
  }

  // Pushing user message to chat
  chat.messages.push({
    role: "user",
    content: trimmedUserMessage,
    timestamp: new Date(),
  });

  // Use userId as thread_id for long term chat memory in MongoDB
  const config = { configurable: { thread_id: userId } };

  // Calling the agent graph
  const response = await agentGraph.invoke(
    {
      messages: [new HumanMessage(trimmedUserMessage)],
      productId,
      // Initial Message State
    },
    config,
  );

  // Pushing the agent response to chat
  chat.messages.push({
    role: "model",
    content: response.messages.at(-1).text,
    timestamp: new Date(),
  });

  // validating and saving the messages
  await chat.validate();
  await chat.save();

  // Sending last message to user
  res.status(200).json({
    message: chat.messages.at(-1),
  });
});

// Fetches the user's AI chat
export const getChat = catchAsync(async (req, res) => {
  const { userId } = req.params;

  // Fetching the AI chat of the user
  const chat = await Conversation.findOne({ userId });

  // If AI chat is not available
  if (!chat) {
    return res.status(200).json({
      messages: [],
    });
  }

  // Sending AI chat messages as chat exists
  res.status(200).json({
    messages: chat.messages,
  });
});

// Deletes the user's AI chat
export const deleteChat = catchAsync(async (req, res) => {
  const { userId } = req.params;

  await Conversation.findOneAndUpdate(
    { userId },
    { messages: [] },
    { new: true },
  );

  res.status(200).json({
    message: "AI Support chat has been reset successfully!",
  });
});
