import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Please enter sender of this message!"],
    },

    message: {
      type: String,
      trim: true,
      required: [true, "Please enter message!"],
    },

    messageSeen: {
      type: Boolean,
      default: false,
    },

    messageSentAt: {
      type: Date,
      required: [true, "Please enter Message Sent Time!"],
    },

    chat: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Chat",
      required: [true, "Please mention to which chat this message belongs!"],
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export const Message = mongoose.model("Message", messageSchema);

// _id: ObjectId('655709183a56193a47e63be0'),
// sender: ObjectId('645c6bc006a6f95683d9de65'),
// message: "Hello admin how are you?",
// messageSeen: false,
// chat: Object('6556ec791239157b7cf3c278'),
// createdAt: 2023-11-17T06:32:56.432+00:00,
// updatedAt: 2023-11-17T06:32:56.432+00:00
// __v: 0
