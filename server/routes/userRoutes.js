import express from "express";
import {
  getUser,
  updateUser,
  updateMyPassword,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// verify token is used to check whether user is logged in.
router.get("/me", verifyToken, getUser);

// Updates the logged in user's profile
router.put("/me/update", verifyToken, updateUser);

// Updates the logged in user's password
router.put("/me/password/update", verifyToken, updateMyPassword);

export default router;
