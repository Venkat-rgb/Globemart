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
import {
  featuredProductsLimiter,
  productLimiter,
  productsLimiter,
  voiceSearchLimiter,
} from "../middlewares/rateLimiters.js";

const router = express.Router();

router
  .route("/")
  .get(productsLimiter, getProducts)
  .post(verifyToken, restrictTo("admin"), imageLimitMiddleware, createProduct);

router.get("/featured", featuredProductsLimiter, getFeaturedProducts);

router.get("/voice-search", voiceSearchLimiter, getProductsThroughVoice);

router
  .route("/:id")
  .get(productLimiter, getProduct)
  .put(verifyToken, restrictTo("admin"), imageLimitMiddleware, updateProduct)
  .delete(verifyToken, restrictTo("admin"), deleteProduct);

export default router;
