import mongoose from "mongoose";

// Connecting to the database
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Successfully connected to DB!`);
  } catch (err) {
    console.log("connectDB function error: ", err?.message);
  }
};
