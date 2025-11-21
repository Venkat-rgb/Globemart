import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
} from "../controllers/adminUsersController.js";
import { restrictTo, verifyToken } from "../middlewares/verifyToken.js";
import { deleteUserAccount } from "../controllers/userController.js";

const router = express.Router();

router.get("/", verifyToken, restrictTo("admin"), getUsers);

router
  .route("/:id")
  .get(verifyToken, restrictTo("admin"), getUser)
  .put(verifyToken, restrictTo("admin"), updateUser);

// Deletes the user account
router.delete(
  `/delete-account/:id`,
  verifyToken,
  restrictTo("admin"),
  deleteUserAccount
);

export default router;
