import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { ChatGoogle } from "@langchain/google";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";

// Loading the environment variables in this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "..", "..", "config", "config.env"),
});

// Initializing main agentLLM for AI customer support chat
export const agentLLM = new ChatGoogle({
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.CHAT_MODEL,
  temperature: 0.5,
  maxOutputTokens: 400,
});

// Initializing basicLLM for general purpose tasks
export const basicLLM = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Initializing the MongoDBSaver checkpointer for storing long term memory
const checkPointerClient = new MongoClient(process.env.MONGODB_URI);
export const checkpointer = new MongoDBSaver({
  client: checkPointerClient,
  dbName: process.env.DB_NAME,
  checkpointCollectionName: `checkpoints`,
  checkpointWritesCollectionName: `checkpoint_writes`,
  enableTimestamps: true,
});
