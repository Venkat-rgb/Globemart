import dotenv from "dotenv";
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

dotenv.config();

export const runWithDB = async (seedScript) => {
  try {
    // Connecting to the DB for seeding purpose
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`Successfully connected to DB! (Seeding Purpose)`);

    // Executing the seed script
    await seedScript();
    logger.info(`Seed Script finished executing successfully.`);
  } catch (err) {
    logger.error(`runWithDB function error: ${err?.message}`);
    process.exit(1);
  } finally {
    // Safely disconnecting from MongoDB
    await mongoose.disconnect();
    logger.info(`Disconnected safely from MongoDB.`);
    process.exit(0);
  }
};
