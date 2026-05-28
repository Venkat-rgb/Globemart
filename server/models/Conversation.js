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
  },
);

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Session ID is required!"],
    },
    messages: [messageSchema],
  },
  {
    strict: true,
  },
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
