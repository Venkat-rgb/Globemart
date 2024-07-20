import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  getWishList,
  createOrUpdateWishList,
  deleteWishList,
  deleteProductFromWishList,
} from "../controllers/wishListController.js";

const router = express.Router();

router
  .route("/")
  .get(verifyToken, getWishList)
  .post(verifyToken, createOrUpdateWishList)
  .put(verifyToken, deleteProductFromWishList)
  .delete(verifyToken, deleteWishList);

export default router;
