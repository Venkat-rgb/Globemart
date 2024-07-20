import rateLimit from "express-rate-limit";

// User can request 2 times and after that if we requests again then he need to wait for 2 minutes
export const loginLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_TIME * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX,
  message: "Too many login attempts, please try again after a minute!",
  standardHeaders: true,
  legacyHeaders: false,
});
