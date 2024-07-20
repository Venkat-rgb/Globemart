import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  // getReviews,
  // createOrUpdateReview,
  // deleteReview,
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

// Be careful while placing router.route('/reviews') and router.route('/:id').

// router.route("/reviews/:id").get(getReviews);

// router
//   .route("/reviews")
//   .post(verifyToken, createOrUpdateReview)
//   .delete(verifyToken, restrictTo("admin"), deleteReview);

router
  .route("/:id")
  .get(getProduct)
  .put(verifyToken, restrictTo("admin"), updateProduct)
  .delete(verifyToken, restrictTo("admin"), deleteProduct);

export default router;
