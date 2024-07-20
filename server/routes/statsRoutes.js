import express from "express";
import { restrictTo, verifyToken } from "../middlewares/verifyToken.js";
import { getStats } from "../controllers/statsController.js";

const router = express.Router();

router.get("/", verifyToken, restrictTo("admin"), getStats);

export default router;
