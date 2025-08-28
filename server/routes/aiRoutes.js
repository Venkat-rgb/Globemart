import express from "express";
import { getResult } from "../controllers/aiTestController.js";

const router = express.Router();

router.post("/", getResult);

export default router;
