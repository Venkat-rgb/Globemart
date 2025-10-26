import express from "express";
import {
  createOrUpdateReview,
  deleteReview,
  getReviews,
  getSingleReview,
} from "../controllers/productReviewsController.js";
import { restrictTo, verifyToken } from "../middlewares/verifyToken.js";
import {
  readReviewLimiter,
  reviewLimiter,
} from "../middlewares/rateLimiters.js";

const router = express.Router();

router.route("/:id").get(readReviewLimiter, getReviews);

router.route("/single/:id").get(verifyToken, getSingleReview);

router
  .route("/")
  .post(reviewLimiter, verifyToken, createOrUpdateReview)
  .delete(verifyToken, restrictTo("admin"), deleteReview);

export default router;
