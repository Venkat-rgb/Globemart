import { basicLLM } from "./llm.js";
import { logger } from "../logger.js";

// Generate embeddings
export const generateEmbedding = async (text, type) => {
  try {
    const embeddingsRes = await basicLLM.models.embedContent({
      model: process.env.EMBEDDING_MODEL,
      contents: text,
      config: {
        outputDimensionality: 1536,
        taskType: type,
      },
    });

    const embeddings = embeddingsRes?.embeddings;

    if (!embeddings) {
      throw new Error("Error while generating embedding");
    }

    return embeddings[0]?.values;
  } catch (err) {
    logger.error(`generateEmbeddingError: ${err?.message}`);
  }
};
