import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import { genAI } from "../server.js";
import { Product } from "../models/Product.js";

// gemma-3-27b-it
// Generate embeddings
const generateEmbedding = async (text, type) => {
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

// Generates embeddings for product (Admin Route)
export const generateProductEmbedding = catchAsync(async (req, res, next) => {
  const id = "";

  const product = await Product.findById(id);

  if (!product) {
    return next(new AppError("Please provide the product for embeddings", 400));
  }

  const embeddingText = `Product Title: ${product.title}. Description: ${product.description}. Category: ${product.category}. Price: ₹${product.discountPrice}`;
  const taskType = "RETRIEVAL_DOCUMENT";

  const embeddings = await generateEmbedding(embeddingText, taskType);

  product.embedding = embeddings;

  await product.validate();
  await product.save();

  res.status(200).json({
    embeddingText,
    embeddings,
  });
});

// Search products based on user query
export const searchProducts = catchAsync(async (req, res, next) => {
  // User query
  const { prompt } = req.body;

  // Checking if prompt is valid (or) not
  if (!prompt || !prompt?.trim()) {
    return next(new AppError("Please enter the search query!", 400));
  }

  // Limit number of characters user can query

  // Generate embedding for user query
  const userEmbedding = await generateEmbedding(prompt, "RETRIEVAL_QUERY");

  // Search the products using user query embedding and mongodb vector search
  const similarProducts = await Product.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        limit: 3,
        path: "embedding",
        queryVector: userEmbedding,
        numCandidates: 50,
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        category: 1,
        discountPrice: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  res.status(200).json({
    products: similarProducts,
  });
});
