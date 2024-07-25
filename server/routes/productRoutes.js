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

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(verifyToken, restrictTo("admin"), createProduct);

router.get("/featured", getFeaturedProducts);

router.get("/voice-search", getProductsThroughVoice);

router
  .route("/:id")
  .get(getProduct)
  .put(verifyToken, restrictTo("admin"), updateProduct)
  .delete(verifyToken, restrictTo("admin"), deleteProduct);

export default router;
