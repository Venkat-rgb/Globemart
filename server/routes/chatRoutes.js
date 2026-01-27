import express from "express";
import { restrictTo, verifyToken } from "../middlewares/verifyToken.js";
import {
  createChat,
  getAllChatsOfUser,
  getSingleChat,
  getSingleChatWithLastMessage,
} from "../controllers/chatsController.js";
import { chatLimiter, chatReadLimiter } from "../middlewares/rateLimiters.js";

const router = express.Router();

router
  .route("/")
  .get(verifyToken, restrictTo("admin"), getAllChatsOfUser)
  .post(verifyToken, chatLimiter, restrictTo("user"), createChat);

router.route("/:id").get(verifyToken, chatReadLimiter, getSingleChat);

router
  .route("/:id/last-message")
  .get(verifyToken, restrictTo("admin"), getSingleChatWithLastMessage);

export default router;
