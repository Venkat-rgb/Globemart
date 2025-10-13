import { catchAsync } from "../utils/catchAsync.js";
import { START, END, StateGraph, Annotation } from "@langchain/langgraph";
import { llm } from "../server.js";
import { generateEmbedding } from "../utils/ai/generateEmbedding.js";
import { Company } from "../models/Company.js";
import { Product } from "../models/Product.js";
import { markdownToText } from "../utils/ai/markdownToText.js";
import { Review } from "../models/Review.js";
import { AppError } from "../utils/appError.js";
import { Conversation } from "../models/Conversation.js";
import { extractProductName } from "../utils/ai/extractProductName.js";

const classifyIntent = async (state) => {
  try {
    const { userMessage } = state;

    // 1) Use LLM to know under which intent user message falls
    const prompt = `You are an intent classification system for an e-commerce customer support chatbot.
      Classify the following user message into one of these intents: 
      1) general: Greetings, introductions, casual chat, asking about past messages, or general knowledge/basic tech questions not tied to policy, product_info, or product_review_summary intents (no product name mentioned)
      - If the user greets you explicitly, respond with a greeting. If the user starts with a question and does not greet, answer directly without greeting.
      Examples: 
          - What happens if a mobile has more battery mAh?
          - What does RAM do in a smartphone?
          - Is it safe to leave my phone charging overnight?
  
      2) policy: Questions about company policies (returns, refunds, shipping, account management, out of stock)
      Examples:
        - My package shows delivered, but I didn't receive anything — what do I do? 
        - How long does it usually take for my order to be shipped if I order today?
        - How to reset my password?
      
      3) product_info: Questions about specific product features, specifications, or details
      Examples:
        - Does the OnePlus 9 Pro have wireless charging, and how fast is it?
        - Is Apple MacBook Air waterproof, what is its warranty, price, and stock? 
      
      4) product_review_summary: Requests to summarize or get reviews about a specific product
      Examples:
        - What are other customers saying about this Apple Macbook Air battery life?
        - Are people happy with the build quality of Redmi Note 13 Pro?
  
      5) unknown: Queries that don't fit the above categories (nonsense, irrelevant topics), non-ecommerce queries (not about policy, product_info, or reviews).
      Examples:
        - Can you write me a Python script to scrape Amazon?
        - Tell me a joke about laptops.
        - Solve this SQL query: SELECT * FROM orders WHERE price > 5000?
    
      User message: "${userMessage}"
    
      Respond with ONLY the intent name (general, policy, product_info, product_review_summary, or unknown).`;

    const intentRes = await llm.models.generateContent({
      model: process.env.CHAT_MODEL,
      contents: prompt,
      config: {
        maxOutputTokens: 100,
        temperature: 0,
      },
    });

    const trimmedIntentRes = intentRes.text.trim();

    return {
      ...state,
      intent: trimmedIntentRes,
    };
  } catch (err) {
    console.log("Error while classifying intent: ", err?.message);
    return {
      ...state,
      intent: "unknown",
    };
  }
};

// Greets the user
const handleGeneral = async (state) => {
  const { userMessage, conversationContext } = state;

  try {
    let generalPrompt = `You are ecommerce AI customer support agent for Globemart. 
      1) If user asks questions related to previous messages then use conversation context I provided you to answer. 
      2) If user normally chats with you by greeting, then greet the user warmly in a friendly tone. Then briefly introduce yourself as their support assistant, explaining that you can answer questions about company policies (return / refund / general how to use app FAQ / order), specific product details, and summarize product reviews. 
      3) If the user asks a general knowledge or basic question (not tied to policy, specific product info, or product review summary), answer it from your own knowledge clearly and concisely.
      Keep your reply short, concise and on point`;

    // Adding conversationContext if available
    if (conversationContext) {
      generalPrompt += `\n\nConversation Context:\n${conversationContext}`;
    }

    generalPrompt += `\n\nUser query: ${userMessage}\nAnswer:`;

    const result = await llm.models.generateContent({
      model: process.env.CHAT_MODEL,
      contents: generalPrompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    });

    // const trimmedResult = markdownToText(result.text.trim());
    const trimmedResult = result.text.trim();

    return {
      ...state,
      response: trimmedResult,
    };
  } catch (err) {
    console.log("Error while handling general intent: ", err?.message);
    return {
      ...state,
      response: `Sorry! I'm unable to answer right now`,
    };
  }
};

// Answers the questions related to company return policies, refunds, general queries
const handleCompanyPolicies = async (state) => {
  try {
    const { userMessage, conversationContext } = state;

    // 1) Generate the embeddings for the user query
    const queryEmbedding = await generateEmbedding(
      userMessage,
      "RETRIEVAL_QUERY"
    );

    // 2) Perform vector search and get the similar documents
    const similarDocs = await Company.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          limit: 3,
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 200,
        },
      },
      {
        $project: {
          _id: 1,
          embeddingText: 1,
        },
      },
    ]);

    // 3) Check if similar documents.length === 0, if yes then return the user a message
    if (similarDocs.length === 0) {
      return {
        ...state,
        response: `I couldn't find specific information related to your question.`,
      };
    }

    // 4) If present then loop them and get the embeddingText
    const docsText = similarDocs
      .map((info, i) => `Document ${i + 1}: ${info?.embeddingText}`)
      .join("\n\n");

    // 5) Construct the policy prompt
    let prompt = `You are ecommerce AI customer support agent for Globemart.
      RULES:
      1) Answer ONLY using the provided context. Never make up or guess information not in the context.
      2) If context provided is partially relevant to answer user query then use it. But if context provided is totally irrelevant then reply exactly: "Sorry, I can't answer your query, please switch to 'Chat with our Agent'".
      3) If user asks follow up questions related to previous messages in this chat, then use conversation context I provided below to answer.
      4) Keep answers short, clear, concise, and on-point. Return the answer in nicely formatted markdown format
      5) Respond in a friendly, professional tone like a customer support agent. 
  
      Policy Context: ${docsText}`;

    // Adding conversationContext if available
    if (conversationContext) {
      prompt += `\n\nConversation Context:\n${conversationContext}`;
    }

    prompt += `\n\nUser query: ${userMessage}\nAnswer:`;

    // 6) Passing the context + user message to LLM to get final result
    const infoRes = await llm.models.generateContent({
      model: process.env.CHAT_MODEL,
      contents: prompt,
      config: {
        temperature: 0,
        maxOutputTokens: 400,
      },
    });

    // const cleanInfoRes = markdownToText(infoRes.text.trim());
    const cleanInfoRes = infoRes.text.trim();

    return {
      ...state,
      response: cleanInfoRes,
    };
  } catch (err) {
    console.log("Error while handling company policies: ", err?.message);
    return {
      ...state,
      response: `I apologize, but I'm having trouble accessing our policy information right now. Please switch to 'Chat with our Agent' to get your question answered`,
    };
  }
};

// Answers the questions related to specific product details
const handleProductInfo = async (state) => {
  const {
    userMessage,
    conversationContext,
    waitingForProductName,
    productNameIntent,
  } = state;

  try {
    let productName;

    // Check if we're waiting for product name from previous interaction
    if (waitingForProductName && productNameIntent === "product_info") {
      // Update conversation state
      state.waitingForProductName = false;
      state.productNameIntent = null;
    }

    // Extract the product name from user message
    productName = await extractProductName(userMessage);

    // 2) User message didn't have product name
    if (productName === "NA") {
      return {
        ...state,
        waitingForProductName: true,
        productNameIntent: "product_info",
        response: `Please enter the exact product name which you want to know details about!`,
      };
    }

    // 3) User message has product name
    const product = await Product.findOne({
      title: productName,
    }).select("title productFeatures stock discountPrice");

    // 4) If product is not present, tell the user
    if (!product) {
      return {
        ...state,
        waitingForProductName: false,
        productNameIntent: null,
        response: `Sorry! Product you want details for is not available`,
      };
    }

    const { title, productFeatures, stock, discountPrice } = product;

    // Fetch product details prompt for LLM
    let productInfoPrompt = `
      You are an e-commerce product assistant.
  
      RULES:
      1) Use only the given context for product specific info, never invent details.
      2) For general/common knowledge not in context, answer briefly from your own knowledge.
      3) If user asks follow questions related to previous messages in this chat, then use conversation context I provided to answer
      4) Keep the answer short, clear, concise, and use bullet points. Don't repeat the user's question. Answer only what is asked — no extra or fluff information.
      5) Tone: friendly and professional. Return the answer in nicely formatted markdown format 
      6) When answering each question, please provide a small label and then your answer. If an answer is missing, say 'Sorry I don't have information about it'.
  
      Example:
      User: What is audio jack mm for boAt Rockerz 450? What is use of audio jack?
      You will answer the first part of the question using the provided context. For the next part of the question, which asks about the use of an audio jack, you will provide an answer based on your own knowledge, as it is a simple and general question not included in the context. 
  
      Product Info Context:
      Product Title: ${title}
      Product Features: ${productFeatures}
      Product Price: ${discountPrice}
      Product Stock: ${stock}`;

    // Adding conversation context if available
    if (conversationContext) {
      productInfoPrompt += `\n\nConversation Context:\n${conversationContext}`;
    }

    productInfoPrompt += `\n\nUser query: ${userMessage}\nAnswer:`;

    // 6) Pass the product context + user message to LLM to get final result
    const productInfo = await llm.models.generateContent({
      model: process.env.CHAT_MODEL,
      contents: productInfoPrompt,
      config: {
        temperature: 0,
        maxOutputTokens: 400,
      },
    });

    // const cleaningProductInfo = markdownToText(productInfo.text.trim());
    const cleaningProductInfo = productInfo.text.trim();

    return {
      ...state,
      response: cleaningProductInfo,
      waitingForProductName: false,
      productNameIntent: null,
    };
  } catch (err) {
    console.log("Error while handling Product Info: ", err?.message);
    return {
      ...state,
      response: `I apologize, but I'm having trouble accessing product docs right now. Please check out the product page to know more about product features`,
      waitingForProductName: false,
      productNameIntent: null,
    };
  }
};

// Summarizes the reviews of particular product
const handleProductReviewSummary = async (state) => {
  const {
    userMessage,
    conversationContext,
    waitingForProductName,
    productNameIntent,
  } = state;

  try {
    let productName;

    // Check if we're waiting for product name from previous interaction
    if (
      waitingForProductName &&
      productNameIntent === "product_review_summary"
    ) {
      // Update conversation state
      state.waitingForProductName = false;
      state.productNameIntent = null;
    }

    // Extract the product name from user message
    productName = await extractProductName(userMessage);

    // 2) User message didn't have product name
    if (productName === "NA") {
      return {
        ...state,
        waitingForProductName: true,
        productNameIntent: "product_review_summary",
        response: `Please enter the exact product name which you want to get review summary about!`,
      };
    }

    // 3) User message has product name
    const product = await Product.findOne({
      title: productName,
    }).select("_id");

    // 4) If product is not present, tell the user
    if (!product) {
      return {
        ...state,
        waitingForProductName: false,
        productNameIntent: null,
        response: `Sorry! Review summary for product you want is not available`,
      };
    }

    // 5) Getting top 5 reviews a product exists
    const reviews = await Review.find({
      productId: product._id,
    })
      .sort("-createdAt")
      .select("review")
      .limit(5);

    // 6) Check if reviews.length === 0, then return no reviews.
    if (reviews.length === 0) {
      return {
        ...state,
        waitingForProductName: false,
        productNameIntent: null,
        response: `Sorry! Reviews for the product you want are not available as no one gave review`,
      };
    }

    // 7) If reviews are there then get the `review` and join with \n\n
    const reviewsText = reviews
      .map((text, i) => `Review ${i + 1}: ${text.review}`)
      .join("\n\n");

    // 8) Pass the review context + user message to LLM to get final result
    // Prompt for summarizing reviews
    let reviewPrompt = `
      You are a helpful e-commerce product review summarizer.   
  
      RULES:
      1) Summarize only from the provided context — do not invent information. 
      2) Highlight both positives and negatives fairly, covering key points from all reviews.
      3) Use the provided conversation context if: 
        (i) The user asks about previous messages (e.g., "What did I ask before?", "Do you remember my name?", "Do you remember we talked about the iPhone?")
        (ii) If the user question can be answered using previous messages then respond from the conversation context (if it contains information related to user question)
        Examples:  
        User: What are customers saying about Galaxy Buds Z?  
        Assistant: Customers like the clear sound, lightweight fit, and long battery life. Some mention the bass is weak and touch controls are too sensitive.  
  
        User: So overall, are reviews more positive or negative?  
        Assistant: Overall, reviews are mostly positive, with customers valuing comfort and audio quality despite minor issues with bass and controls. 
      4) Keep responses short, clear, user-friendly, professional, and easy to read. Return the answer in nicely formatted markdown format  
  
      Reviews Context: ${reviewsText}`;

    // Adding conversation context if available
    if (conversationContext) {
      reviewPrompt += `\n\nConversation Context:\n${conversationContext}`;
    }

    reviewPrompt += `\n\nUser query: ${userMessage}\nAnswer:`;

    const summarizedReviews = await llm.models.generateContent({
      model: process.env.CHAT_MODEL,
      contents: reviewPrompt,
      config: {
        temperature: 0,
        maxOutputTokens: 300,
      },
    });

    // Converting the response from markdown to text
    // const cleanSummarizedReviews = markdownToText(
    //   summarizedReviews.text.trim()
    // );
    const cleanSummarizedReviews = summarizedReviews.text.trim();

    return {
      ...state,
      response: cleanSummarizedReviews,
      waitingForProductName: false,
      productNameIntent: null,
    };
  } catch (err) {
    console.log("Error while handling product review summary: ", err?.message);
    return {
      ...state,
      response: `I apologize, but I'm having trouble summarizing your product reviews`,
      waitingForProductName: false,
      productNameIntent: null,
    };
  }
};

// If unable to answer user query
const handleUnknown = (state) => {
  return {
    ...state,
    response: `Sorry, I can't answer your query, please switch to 'Chat with our Agent'`,
  };
};

// Routing to particular node based on intent
const intentRouter = (state) => {
  const { intent, waitingForProductName, productNameIntent } = state;

  // Checking if we are waiting for product name
  if (waitingForProductName) {
    if (productNameIntent === "product_info") {
      return "handle_product_info";
    } else if (productNameIntent === "product_review_summary") {
      return "handle_product_review_summary";
    }
  }

  if (intent === "general") {
    return "handle_general";
  } else if (intent === "policy") {
    return "handle_policy";
  } else if (intent === "product_info") {
    return "handle_product_info";
  } else if (intent === "product_review_summary") {
    return "handle_product_review_summary";
  }

  return "handle_unknown";
};

// Create the state graph for conversation flow
const createConversationGraph = () => {
  // Creating graph state
  const GraphState = Annotation.Root({
    userId: Annotation(),
    userMessage: Annotation(),
    intent: Annotation(),
    waitingForProductName: Annotation({
      default: () => false,
    }),
    productNameIntent: Annotation(),
    conversationContext: Annotation(),
    response: Annotation(),
  });

  // Creating the workflow, adding nodes
  const workflow = new StateGraph(GraphState)
    .addNode("classify_intent", classifyIntent)
    .addNode("handle_general", handleGeneral)
    .addNode("handle_policy", handleCompanyPolicies)
    .addNode("handle_product_info", handleProductInfo)
    .addNode("handle_product_review_summary", handleProductReviewSummary)
    .addNode("handle_unknown", handleUnknown);

  // Adding edges
  workflow.addEdge(START, "classify_intent");

  // Adding conditional edge for classify_intent node
  workflow.addConditionalEdges("classify_intent", intentRouter, {
    handle_general: "handle_general",
    handle_policy: "handle_policy",
    handle_product_info: "handle_product_info",
    handle_product_review_summary: "handle_product_review_summary",
    handle_unknown: "handle_unknown",
  });

  // Adding edges to END
  workflow.addEdge("handle_general", END);
  workflow.addEdge("handle_policy", END);
  workflow.addEdge("handle_product_info", END);
  workflow.addEdge("handle_product_review_summary", END);
  workflow.addEdge("handle_unknown", END);

  // Adding
  return workflow.compile();
};

// AI customer support chat agent which answers (policy related, product info related, product review summary related questions)
export const customerSupportChat = catchAsync(async (req, res, next) => {
  // 1) Get the user message with userId
  const { userMessage, userId } = req.body;

  // 2) Trim, limit the length of message, sanitize the user message
  const trimmedUserMessage = userMessage?.trim();

  // Checking if user has entered the message or not
  if (!trimmedUserMessage) {
    return next(new AppError("Please enter your query!", 400));
  }

  // Limiting the length of message
  if (trimmedUserMessage.length > 400) {
    return next(
      new AppError("Please enter your query under 400 characters!", 400)
    );
  }

  // Sanitize the user message

  // 3) Checking if user chat already exists
  let chat = await Conversation.findOne({ userId });

  // Creating new chat for the user as it doesn't exist
  if (!chat) {
    chat = await Conversation.create({
      userId,
      messages: [],
    });
  }

  // Get last 6 messages for context (excluding current message)
  const recentMessages = chat.messages.slice(-6);
  const conversationContext = recentMessages
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n")
    .trim();

  // 4) Create the initial state either from old chat (or) new chat
  const initialState = {
    userId: chat.userId,
    userMessage: trimmedUserMessage,
    conversationContext,
    waitingForProductName: chat.waitingForProductName || false,
    productNameIntent: chat.productNameIntent || null,
  };

  // Pushing the user message
  chat.messages.push({
    role: "user",
    content: trimmedUserMessage,
    timestamp: new Date(),
  });

  // 5) Now call the graph with initial state, to get the response
  const graph = createConversationGraph();
  const result = await graph.invoke(initialState);

  // 6) Finally store the AI response in mongodb
  // Adding AI message to chat
  chat.messages.push({
    role: "model",
    content: result.response,
    timestamp: new Date(),
  });

  chat.intent = result.intent;
  chat.waitingForProductName = result.waitingForProductName || false;
  chat.productNameIntent = result.productNameIntent || null;

  // Storing only latest 20 messages per chat
  if (chat.messages.length > 20) {
    chat.messages = chat.messages.slice(-20);
  }

  await chat.validate();
  await chat.save();

  // 7) Send the user response
  res.status(200).json({
    message: chat.messages[chat.messages.length - 1],
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

  // Delete user's AI chat
  // User can delete the chat while AI is waiting for product name, so its better to make them false, so that it doesn't cause issues when starting fresh
  await Conversation.findOneAndUpdate(
    { userId },
    { messages: [], waitingForProductName: false, productNameIntent: null },
    { new: true }
  );

  res.status(200).json({
    message: "AI Support chat has been reset successfully!",
  });
});
