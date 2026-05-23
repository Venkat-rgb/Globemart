import { runWithDB } from "./dbRunner.js";
import { delay } from "../utils/delay.js";
import { loadAndSplitDoc } from "../utils/ai/loadAndSplitDoc.js";
import { generateEmbedding } from "../utils/ai/generateEmbedding.js";
import { Company } from "../models/Company.js";
import { logger } from "../utils/logger.js";
import { cleanChunkText } from "../utils/ai/cleanChunkText.js";

const seedCompanyDocsEmbedding = async () => {
  try {
    // Delete the existing company docs
    await Company.deleteMany({});

    logger.info(`Deleted all existing company docs!`);

    // Loading the pdf chunks
    const chunks = await loadAndSplitDoc();

    for (let i = 0; i < chunks.length; ++i) {
      // Cleaning each text chunk to remove leading, trailing space, special characters
      const cleanedChunk = cleanChunkText(chunks[i]);

      // Generate embedding for each chunk
      const embedding = await generateEmbedding(
        cleanedChunk,
        "RETRIEVAL_DOCUMENT",
      );

      const infoObj = {
        embeddingText: cleanedChunk,
        embedding,
      };

      // Saving each chunk in DB with 700ms delay
      const info = new Company(infoObj);
      await info.validate();
      await info.save();

      logger.info(`Saved chunk ${i}`);
      await delay(700);
    }

    logger.info("Saved all embeddings for company docs!");
  } catch (err) {
    logger.error(`seedCompanyDocsEmbedding Error: ${err?.message}`);
  }
};

runWithDB(seedCompanyDocsEmbedding);
