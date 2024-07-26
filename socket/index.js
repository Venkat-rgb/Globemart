import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

// Initialising express app
const app = express();

// Configuring Environment variables for socket
dotenv.config({
  path: "./config/config.env",
});

// Creating HTTP server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

const PORT = process.env.PORT || 4000;

// Keeps track of online users for chatting
let onlineUsers = [];

const addUser = (userId, socketId, role) => {
  !onlineUsers.some((user) => user?.userId === userId) &&
    onlineUsers.push({
      userId,
      socketId,
      role,
    });
};

const getUser = (id) => onlineUsers.find((user) => user?.userId === id);

// Listening to connection event when user connects to the chat
io.on("connection", (socket) => {
  try {
    // Adds new user to the onlineUsers
    socket.on("addNewUser", (userInfo) => {
      try {
        const { userId, role } = userInfo;

        // Checking if user already exists in onlineUsers array
        const doesOnlineUserExists = onlineUsers.find(
          (user) => user?.userId === userId
        );

        // adding user into onlineUsers array only if he doesn't already exist
        if (!doesOnlineUserExists) {
          // Here we also add role to know if person is user (or) admin which will help in sending different responses to user and admin
          onlineUsers.push({
            userId,
            socketId: socket.id,
            role,
          });
        }

        // Finding if the admin is present in onlineUsers (or) not
        const adminSocket = onlineUsers.find((user) => user?.role === "admin");

        // Only including userId field, so that admin can get these online users from their userId
        const trimmedOnlineUsers = onlineUsers.map((user) => {
          return {
            userId: user.userId,
          };
        });

        // Sending all users that admin is online as he is present in onlineUsers array
        adminSocket && io.emit("isAgentOnline", true);

        // Sending onlineUsers to admin with only userId field
        adminSocket &&
          io
            .to(adminSocket?.socketId)
            .emit("getOnlineUsers", trimmedOnlineUsers);
      } catch (err) {
        console.log("addNewUser socket event error: ", err?.message);
      }
    });

    // Creating the message
    socket.on("createMessage", (userInfo) => {
      try {
        const { receiverId, ...messageInfo } = userInfo;

        // Making sure we dont update messageInfo as it is reference type, so making deep copy
        const createdMessage = { ...messageInfo };

        // Check if receiver exists in onlineUsers array
        const isReceiverExists = onlineUsers.find(
          (user) => user?.userId === receiverId
        );

        // If user is online then only sending message
        if (isReceiverExists) {
          io.to(isReceiverExists?.socketId).emit("getMessage", createdMessage);

          if (isReceiverExists?.role === "admin") {
            io.to(isReceiverExists?.socketId).emit(
              "getMessageNotification",
              createdMessage?.sender?._id
            );
          }
        }
      } catch (err) {
        console.log("createMessage socket event error: ", err?.message);
      }
    });

    // Typing Indication Feature
    socket.on("isTyping", (typingInfo) => {
      try {
        const { senderId, receiverId, typingStatus } = typingInfo;

        // Checking if receiver is online (or) not
        const isReceiverOnline = onlineUsers.find(
          (user) => user?.userId === receiverId
        );

        // If receiver is online then only we send typingStatus
        if (isReceiverOnline) {
          io.to(isReceiverOnline?.socketId).emit("getTypingStatus", {
            senderId,
            typingStatus,
          });
        }
      } catch (err) {
        console.log("isTyping socket event error: ", err?.message);
      }
    });

    // Message Seen Feature
    socket.on("messageSeen", (messageSeenInfo) => {
      try {
        const { chatId, userId } = messageSeenInfo;

        // Checking if receiver is online (or) not
        const isUserOnline = onlineUsers.find(
          (user) => user?.userId === userId
        );

        // If receiver is online then only we will send chatId to receiver, so that receiver can get all messages with updated seen status as messageSeen property was previously set in database
        if (isUserOnline) {
          io.to(isUserOnline?.socketId).emit("getMessageSeen", {
            chatId,
          });
        }
      } catch (err) {
        console.log("messageSeen socket event error: ", err?.message);
      }
    });

    // When user disconnects
    socket.on("disconnect", () => {
      try {
        // Finding admin
        const adminSocket = onlineUsers.find((user) => user?.role === "admin");

        // Updating the onlineUsers array if user is disconnected
        onlineUsers = onlineUsers.filter(
          (user) => user?.socketId !== socket.id
        );

        // If disconnected user is admin, then informing users that admin is offline
        if (adminSocket?.socketId === socket.id) {
          socket.broadcast.emit("isAgentOnline", false);
        } else {
          // If disconnected user is normal 'user', then informing admin that this 'user' is offline
          const trimmedOnlineUsers = onlineUsers.map((user) => {
            return {
              userId: user.userId,
            };
          });

          // Sending only the updated onlineUsers to admin
          adminSocket &&
            io
              .to(adminSocket?.socketId)
              .emit("getOnlineUsers", trimmedOnlineUsers);
        }
      } catch (err) {
        console.log("disconnect socket event error: ", err?.message);
      }
    });
  } catch (err) {
    console.log("socket connection event error: ", err?.message);
  }
});

// Listening to the socker server
server.listen(PORT, (err) => {
  if (err) {
    console.log("Socket server is not connected successfully!");
    return;
  }
  console.log("Socket server connected successfully!");
});
