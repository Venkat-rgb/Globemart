import express from "express";
import {
  generateProductEmbedding,
  searchProducts,
} from "../controllers/aiTestController.js";

const router = express.Router();

router.get("/generate-embedding", generateProductEmbedding);
router.post("/search", searchProducts);

export default router;
