import { logger } from "../logger.js";

export const cleanChunkText = (text) => {
  try {
    if (!text || typeof text !== "string") return "";

    return text
      .replace(/[\x00-\x1F\x7F-\x9F]/g, " ")
      .replace(/[•]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  } catch (err) {
    logger.error(`cleanChunkText Error : ${err?.message}`);
    return ""; // Added fallback so that loop doesn't break
  }
};
