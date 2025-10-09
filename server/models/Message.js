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
      maxlength: [500, `Message can't be more than 500 characters long!`],
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
