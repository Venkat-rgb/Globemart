import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  getWishList,
  createOrUpdateWishList,
  deleteWishList,
  deleteProductFromWishList,
} from "../controllers/wishListController.js";
import { wishlistLimiter } from "../middlewares/rateLimiters.js";

const router = express.Router();

router
  .route("/")
  .get(verifyToken, wishlistLimiter, getWishList)
  .post(verifyToken, wishlistLimiter, createOrUpdateWishList)
  .put(verifyToken, wishlistLimiter, deleteProductFromWishList)
  .delete(verifyToken, wishlistLimiter, deleteWishList);

export default router;
