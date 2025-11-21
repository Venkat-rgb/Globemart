import express from "express";
import {
  getUser,
  updateUser,
  updateMyPassword,
  deleteUserAccount,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { imageLimitMiddleware } from "../middlewares/imageLimitMiddleware.js";
import { profileLimiter } from "../middlewares/rateLimiters.js";

const router = express.Router();

// verify token is used to check whether user is logged in.
router.get("/me", verifyToken, getUser);

// Updates the logged in user's profile
router.put(
  "/me/update",
  verifyToken,
  profileLimiter,
  imageLimitMiddleware,
  updateUser
);

// Updates the logged in user's password
router.put("/me/password/update", verifyToken, updateMyPassword);

// Deletes the user account
router.delete(`/me/delete-account`, verifyToken, deleteUserAccount);

export default router;
