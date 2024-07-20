import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/adminUsersController.js";
import { restrictTo, verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, restrictTo("admin"), getUsers);

router
  .route("/:id")
  .get(verifyToken, restrictTo("admin"), getUser)
  .put(verifyToken, restrictTo("admin"), updateUser)
  .delete(verifyToken, restrictTo("admin"), deleteUser);

export default router;
