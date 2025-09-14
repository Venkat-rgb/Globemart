import { genAI } from "../../server.js";

// Generate embeddings
export const generateEmbedding = async (text, type) => {
  try {
    const embeddingsRes = await genAI.models.embedContent({
      model: "gemini-embedding-001",
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
    console.log("generateEmbeddingError: ", err?.message);
  }
};
