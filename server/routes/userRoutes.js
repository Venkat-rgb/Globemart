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

router.put("/me/update", verifyToken, updateUser);

router.put("/me/password/update", verifyToken, updateMyPassword);

export default router;
