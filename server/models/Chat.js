import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    usersInChat: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: [true, "Please enter users who want to chat!"],
      },
    ],

    lastMessage: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export const Chat = mongoose.model("Chat", chatSchema);
