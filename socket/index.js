import { logger } from "./utils/logger.js";

// Handling Uncaught errors
process.on("uncaughtException", (err) => {
  logger.error(`Socket Uncaught Error: ${err.name} - ${err.message}`);

  // Giving some time to finish all ongoing requests before exit
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuring Environment variables for socket
dotenv.config({
  path: path.join(__dirname, "config", "config.env"),
});

import express from "express";
import http from "http";
import { Server } from "socket.io";

// Initialising express app
const app = express();

// Creating HTTP server
const server = http.createServer(app);

// Creating new server for socket io
// origin: [process.env.FRONTEND_URL_1, "http://localhost"],

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL_1],
  },
  maxHttpBufferSize: 1e6,
});

// Giving default port as 4000
const PORT = process.env.PORT || 4000;

// Keeps track of online users for chatting
let onlineUsers = [];

// Adds user into onlineUsers array only if he doesn't already exist
const addUser = (userId, socketId, role) => {
  !onlineUsers.some((user) => user?.userId === userId) &&
    onlineUsers.push({
      userId,
      socketId,
      role,
    });
};

// Checks if user (or) admin already exists in onlineUsers array
const getUser = (idOrRole) => {
  return idOrRole === "admin"
    ? onlineUsers.find((user) => user?.role === idOrRole)
    : onlineUsers.find((user) => user?.userId === idOrRole);
};

// Deletes the user using socketId which is passed as parameter
const deleteUser = (id) => {
  onlineUsers = onlineUsers.filter((user) => user?.socketId !== id);
};
// Trims the user object into just their id's
const trimOnlineUserIds = (users) => {
  return users.map((user) => ({
    userId: user.userId,
  }));
};

// Listening to connection event when user connects to the chat
io.on("connection", (socket) => {
  try {
    // Adds new user to the onlineUsers
    socket.on("addNewUser", (userInfo) => {
      try {
        const { userId, role } = userInfo;

        // Here we also add role to know if person is user (or) admin which will help in sending different responses to user and admin
        addUser(userId, socket.id, role);

        // Finding if the admin is present in onlineUsers (or) not
        const adminSocket = getUser("admin");

        // Only including userId field, so that admin can get these online users from their userId
        const trimmedOnlineUsers = trimOnlineUserIds(onlineUsers);

        // Sending all users that admin is online as he is present in onlineUsers array
        adminSocket && io.emit("isAgentOnline", true);

        // Sending onlineUsers to admin with only userId field
        adminSocket &&
          io
            .to(adminSocket?.socketId)
            .emit("getOnlineUsers", trimmedOnlineUsers);
      } catch (err) {
        logger.error(`addNewUser socket event error: ${err?.message}`);
      }
    });

    // Creating the message
    socket.on("createMessage", (userInfo) => {
      try {
        const { receiverId, ...messageInfo } = userInfo;

        // Making sure we dont update messageInfo as it is reference type, so making deep copy
        const createdMessage = { ...messageInfo };

        // Check if receiver exists in onlineUsers array
        const isReceiverExists = getUser(receiverId);

        // If user is online then only sending message
        if (isReceiverExists) {
          io.to(isReceiverExists?.socketId).emit("getMessage", createdMessage);

          if (isReceiverExists?.role === "admin") {
            io.to(isReceiverExists?.socketId).emit("getMessageNotification", {
              _id: createdMessage?._id,
              sender: {
                _id: createdMessage?.sender?._id,
              },
              message: createdMessage?.message,
              messageSeen: createdMessage?.messageSeen,
              messageSentAt: createdMessage?.messageSentAt,
            });
          }
        }
      } catch (err) {
        logger.error(`createMessage socket event error: ${err?.message}`);
      }
    });

    // Typing Indication Feature
    socket.on("isTyping", (typingInfo) => {
      try {
        const { senderId, receiverId, typingStatus } = typingInfo;

        // Checking if receiver is online (or) not
        const isReceiverOnline = getUser(receiverId);

        // If receiver is online then only we send typingStatus
        if (isReceiverOnline) {
          io.to(isReceiverOnline?.socketId).emit("getTypingStatus", {
            senderId,
            typingStatus,
          });
        }
      } catch (err) {
        logger.error(`isTyping socket event error: ${err?.message}`);
      }
    });

    // Message Seen Feature
    socket.on("messageSeen", (messageSeenInfo) => {
      try {
        const { chatId, userId } = messageSeenInfo;

        // Checking if receiver is online (or) not
        const isUserOnline = getUser(userId);

        // If receiver is online then only we will send chatId to receiver, so that receiver can get all messages with updated seen status as messageSeen property was previously set in database
        if (isUserOnline) {
          io.to(isUserOnline?.socketId).emit("getMessageSeen", {
            chatId,
          });
        }
      } catch (err) {
        logger.error(`messageSeen socket event error: ${err?.message}`);
      }
    });

    // Handle socket errors
    socket.on("error", (error) => {
      logger.error(`Socket error for ${socket.id}: ${error.message}`);
    });

    // Handle connection errors
    socket.on("connect_error", (error) => {
      logger.error(`Connection error for ${socket.id}: ${error.message}`);
    });

    // When user disconnects
    socket.on("disconnect", () => {
      try {
        // Finding admin
        const adminSocket = getUser("admin");

        // Updating the onlineUsers array if user is disconnected
        deleteUser(socket.id);

        // If disconnected user is admin, then informing users that admin is offline
        if (adminSocket?.socketId === socket.id) {
          socket.broadcast.emit("isAgentOnline", false);
        } else {
          // If disconnected user is normal 'user', then informing admin that this 'user' is offline
          const trimmedOnlineUsers = trimOnlineUserIds(onlineUsers);

          // Sending only the updated onlineUsers to admin
          adminSocket &&
            io
              .to(adminSocket?.socketId)
              .emit("getOnlineUsers", trimmedOnlineUsers);
        }
      } catch (err) {
        logger.error(`Disconnect socket event error: ${err?.message}`);
      }
    });
  } catch (err) {
    logger.error(`Socket connection event error: ${err?.message}`);
  }
});

// Listening to the socker server
const httpServer = server.listen(PORT, () => {
  logger.info(`Socket server connected successfully!`);
});

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received from socket, starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(() => {
    logger.info(`HTTP socket server closed`);

    // Close all socket connections
    io.close(() => {
      logger.info(`Socket.io server closed successfully`);

      // Clear online users
      onlineUsers = [];
      process.exit(0);
    });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error(`Forced socket shutdown after timeout`);
    process.exit(1);
  }, 10000);
};

// Listen for termination signals like (Docker/PM2) and Ctrl+C
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handling unhandled rejection error
process.on("unhandledRejection", (err) => {
  logger.error(`Socket rejection error: ${err.name}: ${err.message}`);
  httpServer.close(() => {
    process.exit(1);
  });
});
