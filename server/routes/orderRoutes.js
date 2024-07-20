import express from "express";
import {
  getOrders,
  getMyOrders,
  getOrder,
  createOrder,
  validateOrder,
  updateOrder,
  updateOrderPayment,
  deleteOrder,
} from "../controllers/orderController.js";
import { restrictTo, verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router
  .route("/")
  .get(verifyToken, restrictTo("admin"), getOrders)
  .post(verifyToken, createOrder);

router.get("/my-orders", verifyToken, getMyOrders);

router.post("/validate-order", verifyToken, validateOrder);

router
  .route("/:id")
  .get(verifyToken, getOrder)
  .put(verifyToken, restrictTo("admin"), updateOrder)
  .patch(verifyToken, restrictTo("admin"), updateOrderPayment)
  .delete(verifyToken, restrictTo("admin"), deleteOrder);

export default router;
