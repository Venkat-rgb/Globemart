import express from "express";
import {
  createOrUpdateReview,
  deleteReview,
  getReviews,
  getSingleReview,
} from "../controllers/productReviewsController.js";
import { restrictTo, verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.route("/:id").get(getReviews);

router.route("/single/:id").get(verifyToken, getSingleReview);

router
  .route("/")
  .post(verifyToken, createOrUpdateReview)
  .delete(verifyToken, restrictTo("admin"), deleteReview);

export default router;
