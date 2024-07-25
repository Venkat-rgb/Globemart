import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";

// CREATE MESSAGE
export const createMessage = catchAsync(async (req, res, next) => {
  const { message, chatId } = req.body;

  const trimmedChatId = chatId?.trim();

  // check if chatId is valid
  if (!mongoose.Types.ObjectId.isValid(trimmedChatId)) {
    return next(new AppError("Please enter valid chatId!", 400));
  }

  // Check if chat exists with chatId and also if user exists in that chat
  const chat = await Chat.findOne({
    _id: trimmedChatId,
    usersInChat: { $in: [req.user._id] },
  });

  // Returning error if chat doesn't exist
  if (!chat) {
    return next(new AppError(`Chat (or) Sender does not exist!`, 404));
  }

  // Creating message
  const createdMessage = await Message.create({
    sender: req.user._id,
    message,
    chat: trimmedChatId,
    messageSentAt: new Date().toISOString(),
  });

  // Populating username property of sender field from above createdMessage
  const populatedMessage = await createdMessage.populate("sender", "username");

  // Updating the lastMessage of this chat
  chat.lastMessage = createdMessage._id;

  // Saving the updated chat model to DB
  await chat.save();

  // Sending message data to user
  res.status(201).json({
    message: "Message created successfully!",
    messageData: {
      _id: populatedMessage?._id,
      sender: populatedMessage?.sender,
      message: populatedMessage?.message,
      messageSeen: populatedMessage?.messageSeen,
      messageSentAt: populatedMessage?.messageSentAt,
    },
  });
});

// GET ALL MESSAGES OF A CHAT
export const getAllMessagesOfChat = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;

  // Check if chat exist with this chatId
  const doesChatExists = await Chat.findById(chatId);

  if (!doesChatExists) {
    return next(new AppError("Chat does not exist with this chatId!", 404));
  }

  // Finding all messages of a particular chat with chatId
  const messages = await Message.find({ chat: chatId }).populate(
    "sender",
    "username"
  );

  // Sending messages to user
  res.status(200).json({
    messages,
  });
});

// MARK MESSAGES AS SEEN
export const markMessagesAsSeen = catchAsync(async (req, res, next) => {
  const { chatId, userId } = req.body;

  // Finding chat in database with chatId
  const chat = await Chat.findById(chatId);

  // If chat is not present in database, then return error
  if (!chat) {
    return next(new AppError(`Chat does not exist!`, 400));
  }

  // Finding all the messages which are unseen
  const unseenMessages = await Message.find({
    chat: chatId,
    sender: userId,
    messageSeen: false,
  });

  // If there are unseen messages with this chatId, so change the messageSeen status to true
  if (unseenMessages?.length > 0) {
    const updateMessages = await Message.updateMany(
      { chat: chatId, sender: userId },
      { $set: { messageSeen: true } }
    );
  }

  // If there are no messages in this chat and no unseen messages, then don't do anything client, don't make request when there are no messages in this chat.

  res.status(200).json({
    areMessagesUpdated: unseenMessages?.length > 0 ? true : false,
  });
});
