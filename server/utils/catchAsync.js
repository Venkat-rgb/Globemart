import { logger } from "./logger.js";

export const catchAsync = (func) => {
  try {
    // Capturing the errors
    return (req, res, next) => {
      func(req, res, next).catch(next);
    };
  } catch (err) {
    logger.error(`catchAsync function error: ${err?.message}`);
  }
};
