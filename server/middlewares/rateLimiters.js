import rateLimit from "express-rate-limit";

// 1) Auth Routes Limiters
export const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // wait time 2 min
  max: 3, // max 3 attempts
  message: {
    message: "Too many login attempts, please try again after 2 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // wait time 15 min
  max: 10, // max 10 attempts
  message: {
    message:
      "Too many accounts created from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // wait time 15 min
  max: 3, // max 3 attempts
  message: {
    message:
      "Too many password reset requests, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // wait time 15 min
  max: 5, // max 5 attempts
  message: {
    message:
      "Too many password reset attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// 2) Payment Routes Limiters
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // wait time 1 hr
  max: 10, // max 10 payment attempts
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    message: "Too many payment attempts, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3) Order Routes Limiters
export const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // wait time 15 min
  max: 10, // max 10 order attempts
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    message: "Too many orders created, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4) AI Chat Routes Limiters
export const aiChatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // wait time 1 min
  max: 10, // 10 message per minute
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    message:
      "You're sending messages too quickly. please try again after a minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const aiReadChatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // wait time 5 min
  max: 30, // max 30 aiChat read requests
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    message: "Too many requests, please try again after 5 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 5) Customer Support Chat Routes Limiters
export const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // wait time 1 min
  max: 30, // 30 messages per minute
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    message:
      "You're sending messages too quickly! please try again after a minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // wait time 15 min
  max: 15, // 15 chat requests
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    message: "Too many chat requests, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const chatReadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // wait time 1 min
  max: 15, // 15 chat requests
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    message: "Too many chat read requests, please try again after a minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 6) Products Limiter
export const productsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // wait time 1 min
  max: 50, // 50 requests per minute
  message: {
    message: "Too many requests, please try again after a minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const productLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // wait time 1 min
  max: 40, // 40 requests per minute
  message: {
    message: "Too many requests, please try again after a minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const featuredProductsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // wait time 1 min
  max: 20, // 20 requests per minute
  message: {
    message: "Too many requests, please try again after a minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI Voice Product Search Limiter
export const voiceSearchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // wait time 5 min
  max: 15, // 15 voice searches
  message: {
    message: "Too many voice searches, please try again after 5 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 7) Product Review Routes Limiter
export const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // wait time 15 min
  max: 5, // 5 reviews
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    message: "Too many reviews submitted, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const readReviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // wait time 15 min
  max: 50, // 50 reviews
  message: {
    message: "Too many review read requests, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 8) Nearby Stores Limiter
export const storeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // wait time 10 min
  max: 30, // max 30 store requests
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    message: "Too many store requests, please try again after 10 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 9) User Routes Limiter
export const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // wait time 15 min
  max: 10, // max 10 profile updates
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    message: "Too many profile updates, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 10) Address Routes Limiter
export const addressLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // wait time 15 min
  max: 5, // max 5 address updates
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    message: "Too many address updates, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 11) Wishlist Routes Limiter
export const wishlistLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // wait time 10 min
  max: 100, // max 100 wishlist requests
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    message: "Too many wishlist requests, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 12) Global middleware
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // wait time 15 min
  max: 200, // max 200 requests
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
