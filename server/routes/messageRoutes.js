import express from "express";
import {
  createMessage,
  getAllMessagesOfChat,
  markMessagesAsSeen,
} from "../controllers/messageController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { messageLimiter } from "../middlewares/rateLimiters.js";

const router = express.Router();

router.post("/", verifyToken, messageLimiter, createMessage);

router.get("/:chatId", verifyToken, getAllMessagesOfChat);

router.put("/", verifyToken, markMessagesAsSeen);

export default router;
