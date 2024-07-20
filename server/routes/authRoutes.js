import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  newAccessToken,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { loginLimiter } from "../middlewares/loginLimiter.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", verifyToken, logoutUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/refresh-token", newAccessToken);

export default router;
