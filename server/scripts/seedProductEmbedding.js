import { runWithDB } from "./dbRunner.js";
import { Product } from "../models/Product.js";
import { delay } from "../utils/delay.js";
import { generateEmbedding } from "../utils/ai/generateEmbedding.js";
import { logger } from "../utils/logger.js";

const seedProductEmbedding = async () => {
  try {
    // 1) Remove the existing product embeddings
    await Product.updateMany({}, { $unset: { embedding: 1 } });

    logger.info(`Deleted all existing product embeddings!`);

    // 2) Generate new product embeddings based on title, description, category, discountPrice, stock
    const products = await Product.find();

    for (let product of products) {
      // Choosing embedding info for product identification
      const embeddingInfo = `
        Title: ${product.title},
        Description: ${product.description},
        Category: ${product.category},
        Price: ${product.discountPrice},
        Stock: ${product.stock > 0 ? "In Stock" : "Out of Stock"}
      `
        .trim()
        .replace(/\s+/g, " ");

      // Generating embedding
      const embedding = await generateEmbedding(
        embeddingInfo,
        "RETRIEVAL_DOCUMENT",
      );

      // Setting the new embedding for this product
      await Product.updateOne({ _id: product._id }, { $set: { embedding } });

      // Adding the delay to avoid rate limits of generating embedding
      await delay(1000);

      logger.info(`Generated Embedding - ${product._id}`);
    }

    logger.info(`Successfully generated embeddings for all products`);
  } catch (err) {
    logger.error(`seedProductEmbedding Error: ${err?.message}`);
  }
};

// Passing seed script to connect with DB and execute
runWithDB(seedProductEmbedding);
