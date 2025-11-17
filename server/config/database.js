import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

// Connecting to the database
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`Successfully connected to DB!`);
  } catch (err) {
    logger.error(`connectDB function error: ${err?.message}`);
    process.exit(1);
  }
};
