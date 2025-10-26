import express from "express";
import {
  customerSupportChat,
  deleteChat,
  getChat,
} from "../controllers/aiCustomerSupportController.js";
import { restrictTo, verifyToken } from "../middlewares/verifyToken.js";
import {
  aiChatLimiter,
  aiReadChatLimiter,
} from "../middlewares/rateLimiters.js";

const router = express.Router();

router.post(
  "/customer-support-agent",
  aiChatLimiter,
  verifyToken,
  restrictTo("user"),
  customerSupportChat
);

router
  .route("/customer-support-agent/:userId")
  .get(aiReadChatLimiter, verifyToken, restrictTo("user"), getChat)
  .delete(verifyToken, restrictTo("user"), deleteChat);

export default router;
