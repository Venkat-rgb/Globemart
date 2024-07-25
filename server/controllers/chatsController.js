import { catchAsync } from "../utils/catchAsync.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";
import { AppError } from "../utils/appError.js";
import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";

// CREATE CHAT
export const createChat = catchAsync(async (req, res, next) => {
  // Create chat between admin and user, so all chats are taken by admin only
  const admin = await User.findOne({ role: "admin" });

  // If admin doesn't exist then return error
  if (!admin) {
    return next(new AppError(`Admin does not exist!`, 404));
  }

  // Making sure that admin can't chat with himself
  if (admin?._id.toString() === req.user?._id.toString()) {
    return next(new AppError(`Admin can't chat with himself!`, 400));
  }

  // Checking if chat exists between this user and admin already
  const doesChatExists = await Chat.findOne({
    usersInChat: {
      $all: [req.user?._id, admin?._id],
    },
  });

  // If chat is not created between user and admin, then only we create the chat
  if (!doesChatExists) {
    // Creating chat
    const creatingChat = await Chat.create({
      usersInChat: [req.user?._id, admin?._id],
    });

    // Sending chatId of created Chat
    res.status(201).json({
      message: "Chat created successfully!",
      chatId: creatingChat?._id,
    });
  } else {
    // Chat already got created
    // Sending chatId of created Chat
    res.status(200).json({
      message: "Chat has already been created!",
      chatId: doesChatExists?._id,
    });
  }
});

// GET SINGLE CHAT OF USER WITH ALL MESSAGES
export const getSingleChat = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if chatId is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Please enter valid chatId", 400));
  }

  // Finding the chat using 'id'
  const chat = await Chat.findById(id)
    ?.populate("usersInChat", "username profileImg")
    .select("_id usersInChat updatedAt");

  // If chat is not found, then return error
  if (!chat) {
    return next(new AppError("Chat does not exist!", 404));
  }

  // Finding all messages of a particular chat with chatId
  const messages = await Message.find({ chat: id })
    .populate("sender", "username")
    .select("message messageSeen sender messageSentAt");

  res.status(200).json({
    chat,
    messages,
  });
});

// ALL CHATS OF USER
export const getAllChatsOfUser = catchAsync(async (req, res) => {
  const { name } = req.query;

  const trimmedName = name?.trim();

  // Case Insensitive
  const regexPattern = new RegExp(trimmedName, "i");

  // 1) If user provides username, then we are getting the user with that username and selecting only _id field, else getting current user chats
  // 2) After that populating username, profileImg property from usersInChat property
  // 3) Next we are populating the sender id from lastMessage property of Chat model
  // 4) Finally selecting _id, usersInChat, updatedAt, lastMessage properties from found chats
  const chats = await Chat.find({
    usersInChat: {
      $in: trimmedName
        ? await User.find({
            username: {
              $regex: regexPattern,
            },
          }).select("_id")
        : [req.user._id],
    },
  })
    .populate("usersInChat", "username profileImg")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "_id",
      },
      select: "message messageSeen messageSentAt",
    })
    .select("_id usersInChat updatedAt lastMessage");

  // Returning chats to user
  res.status(200).json({ chats });
});
