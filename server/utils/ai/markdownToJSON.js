import { logger } from "../logger.js";

// Converts markdown to text
export const markdownToJSON = (keywords) => {
  try {
    const res = keywords.replace(/```json|```/g, "").trim();
    return JSON.parse(res);
  } catch (err) {
    logger.error(`Error while converting markdown to JSON: ${err?.message}`);
  }
};
