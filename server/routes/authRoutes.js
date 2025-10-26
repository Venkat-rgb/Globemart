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
import {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} from "../middlewares/rateLimiters.js";
import { imageLimitMiddleware } from "../middlewares/imageLimitMiddleware.js";

const router = express.Router();

router.post("/register", registerLimiter, imageLimitMiddleware, registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", verifyToken, logoutUser);
router.post("/password/forgot", forgotPasswordLimiter, forgotPassword);
router.put("/password/reset/:token", resetPasswordLimiter, resetPassword);
router.get("/refresh-token", newAccessToken);

export default router;
