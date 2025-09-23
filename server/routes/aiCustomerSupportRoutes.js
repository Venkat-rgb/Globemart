import express from "express";
import {
  customerSupportChat,
  deleteChat,
  getChat,
} from "../controllers/aiCustomerSupportController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/customer-support-agent", verifyToken, customerSupportChat);
router
  .route("/customer-support-agent/:userId")
  .get(verifyToken, getChat)
  .delete(verifyToken, deleteChat);

export default router;
