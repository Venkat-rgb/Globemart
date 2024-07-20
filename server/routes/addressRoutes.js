import express from "express";
import {
  getAddress,
  createOrUpdateAddress,
} from "../controllers/addressController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router
  .route("/")
  .get(verifyToken, getAddress)
  .post(verifyToken, createOrUpdateAddress);

export default router;
