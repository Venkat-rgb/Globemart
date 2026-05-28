import { logger } from "./utils/logger.js";

// Handling Uncaught errors
process.on("uncaughtException", (err) => {
  logger.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  logger.error(`Uncaught Error: ${err.name} - ${err.message}`);
  process.exit(1);
});

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuring Environment variables
dotenv.config({
  path: path.join(__dirname, "config", "config.env"),
});

import express from "express";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import wishListRoutes from "./routes/wishListRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import nearbyStoreRoutes from "./routes/nearbyStoreRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import productReviewsRoutes from "./routes/productReviewsRoutes.js";
import aiCustomerSupportRoutes from "./routes/aiCustomerSupportRoutes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { AppError } from "./utils/appError.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import { startCouponJob } from "./utils/jobs/couponJob.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import NodeCache from "node-cache";
import { globalLimiter } from "./middlewares/rateLimiters.js";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;

// Adding trust proxy
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Setting Security HTTP Headers
app.use(helmet());

// Allowing form data
app.use(express.urlencoded({ limit: "11mb", extended: true }));

// Parsing data in form of json
app.use(express.json({ limit: "11mb" }));

// Santizing the user input and removing symbols like '$' or '.'
app.use(mongoSanitize());

// Parsing Cookies received from client
app.use(cookieParser());

// Using CORS to allow cross origin requests
// origin: [process.env.FRONTEND_URL, "http://localhost"],
app.use(
  cors({
    origin: [process.env.FRONTEND_URL_1],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

// Allowing files like images to upload
app.use(fileUpload());

// Configuring cloudinary to upload images
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initializing Node cache, expiring all the cache keys in 1 hr
export const myCache = new NodeCache({
  stdTTL: 3600, // expires the keys after 1hr
  checkperiod: 300, // runs a cleaning job of specific duration to delete expired keys
});

// Global Rate Limiter
app.use("/api/v1", globalLimiter);

// All routes of the app
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", productReviewsRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/wishlist", wishListRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/stores", nearbyStoreRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/ai", aiCustomerSupportRoutes);

// Default route for the server
app.get("/", (req, res) => {
  res.send(`<h1>API is working correctly!</h1>`);
});

// Showing page not found if URL doesn't exist
app.all("*", (req, res, next) => {
  return next(new AppError("Page Not Found!", 404));
});

// Using Error middleware to catch all the asynchronous errors in the app
app.use(errorMiddleware);

let server;

const startServer = async () => {
  try {
    // Connecting to Database
    await connectDB();

    // Starting the server
    server = app.listen(PORT, () => {
      logger.info(`Server is running on port: ${PORT}`);

      // Starting the Coupon Job Scheduler after starting the server
      startCouponJob();
      logger.info("⏰ Coupon job scheduler started");
    });

    // Setting up the graceful shutdown
    setupGracefulShutDown();
  } catch (err) {
    logger.error(`❌ Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

function setupGracefulShutDown() {
  const shutdown = async (signal) => {
    logger.info(`${signal} signal received: starting graceful shutdown...`);

    if (server) {
      server.close(async () => {
        logger.info("✅ HTTP server closed - no longer accepting connections");

        try {
          // Closing MongoDB connection
          await mongoose.connection.close();
          logger.info("✅ MongoDB connection closed gracefully");
          process.exit(0);
        } catch (err) {
          logger.error(`❌ Error during shutdown: ${err.message}`);
          process.exit(1);
        }
      });

      // Force shutdown after 15 seconds if graceful shutdown hangs
      setTimeout(() => {
        logger.error(
          "⚠️ Could not close connections in time, forcing shutdown",
        );
        process.exit(1);
      }, 15000);
    } else {
      process.exit(0);
    }
  };

  // Listen for termination signals
  process.on("SIGTERM", () => shutdown("SIGTERM")); // Docker/Kubernetes/Cloud platforms
  process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C in terminal
  process.on("SIGUSR2", () => shutdown("SIGUSR2")); // Nodemon restart
}

// Handling unhandled rejection error
process.on("unhandledRejection", (err) => {
  logger.error("💥 UNHANDLED REJECTION! Shutting down...");
  logger.error(`Rejection Error: ${err.name} - ${err.message}`);

  // Closing server gracefully
  if (server) {
    server.close(async () => {
      try {
        // Closing MongoDB connection
        await mongoose.connection.close();
        logger.info("MongoDB connection closed due to unhandled rejection");
      } catch (closeErr) {
        logger.error(`Error closing MongoDB: ${closeErr.message}`);
      }
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Starting the server
startServer();
