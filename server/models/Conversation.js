import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "model"],
      required: [true, "Message role is required!"],
    },
    content: {
      type: String,
      required: [true, "Message content is required!"],
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: true,
  }
);

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Session ID is required!"],
    },
    messages: [messageSchema],
    intent: {
      type: String,
      enum: [
        "general",
        "policy",
        "product_info",
        "product_review_summary",
        "unknown",
      ],
      default: "unknown",
    },
    waitingForProductName: {
      type: Boolean,
      default: false,
    },
    productNameIntent: {
      type: String,
      enum: ["product_info", "product_review_summary", null],
      default: null,
    },
  },
  {
    strict: true,
  }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
