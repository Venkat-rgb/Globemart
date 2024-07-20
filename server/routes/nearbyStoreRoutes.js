import express from "express";
import {
  getNearbyStores,
  createNearbyStore,
} from "../controllers/nearbyStoreController.js";
import { restrictTo, verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/get-nearby-stores", verifyToken, getNearbyStores);

router.route("/").post(verifyToken, restrictTo("admin"), createNearbyStore);

export default router;
