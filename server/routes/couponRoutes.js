import express from "express";
import {
  getAllCoupons,
  getCoupon,
  singleValidCoupon,
  createCoupon,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import { restrictTo, verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router
  .route("/")
  .get(verifyToken, restrictTo("admin"), getAllCoupons)
  .post(verifyToken, restrictTo("admin"), createCoupon);

router.get("/single", singleValidCoupon);

router.post("/validate", validateCoupon);

router
  .route("/:id")
  .get(verifyToken, restrictTo("admin"), getCoupon)
  .put(verifyToken, restrictTo("admin"), updateCoupon)
  .delete(verifyToken, restrictTo("admin"), deleteCoupon);

export default router;
