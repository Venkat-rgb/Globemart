import express from "express";
import {
  getStripeKey,
  processPayment,
} from "../controllers/paymentsController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/stripe-key", verifyToken, getStripeKey);

router.post("/payment-checkout", verifyToken, processPayment);

export default router;
