import express from "express";
import {
  getAddress,
  createOrUpdateAddress,
} from "../controllers/addressController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { addressLimiter } from "../middlewares/rateLimiters.js";

const router = express.Router();

router
  .route("/")
  .get(verifyToken, getAddress)
  .post(addressLimiter, verifyToken, createOrUpdateAddress);

export default router;
