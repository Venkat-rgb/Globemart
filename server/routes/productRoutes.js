import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsThroughVoice,
  getFeaturedProducts,
} from "../controllers/productController.js";
import { restrictTo, verifyToken } from "../middlewares/verifyToken.js";
import { imageLimitMiddleware } from "../middlewares/imageLimitMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(verifyToken, restrictTo("admin"), imageLimitMiddleware, createProduct);

router.get("/featured", getFeaturedProducts);

router.get("/voice-search", getProductsThroughVoice);

router
  .route("/:id")
  .get(getProduct)
  .put(verifyToken, restrictTo("admin"), imageLimitMiddleware, updateProduct)
  .delete(verifyToken, restrictTo("admin"), deleteProduct);

export default router;
