import express from "express";
import {
  getStripeKey,
  processPayment,
} from "../controllers/paymentsController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { paymentLimiter } from "../middlewares/rateLimiters.js";

const router = express.Router();

router.get("/stripe-key", verifyToken, getStripeKey);

router.post("/payment-checkout", paymentLimiter, verifyToken, processPayment);

export default router;
