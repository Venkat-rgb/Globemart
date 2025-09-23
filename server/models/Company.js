import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    embeddingText: String,
    embedding: [Number],
  },
  {
    strict: true,
  }
);

export const Company = mongoose.model("Company", companySchema);
