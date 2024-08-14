import express from "express";
import dotenv from "dotenv";
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
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { AppError } from "./utils/appError.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import { startCouponJob } from "./utils/jobs/couponJob.js";
import { manager, modalFilePath, trainAndSaveModel } from "./utils/train.js";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import fs from "fs";
import NodeCache from "node-cache";
import compression from "compression";

const app = express();

// Configuring Environment variables
dotenv.config({
  path: "./config/config.env",
});

// Handling Uncaught errors
process.on("uncaughtException", (err) => {
  console.log(`Uncaught Error: ${err.name}`, err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

// Using compression to optimize response body size and speed of application
app.use(
  compression({
    level: 6,
  })
);

// Setting Security HTTP Headers
app.use(helmet());

// Logging logs only in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Allowing form data
app.use(express.urlencoded({ extended: true }));

// Parsing data in form of json
app.use(express.json({ limit: "10mb" }));

// Santizing the user input and removing symbols like '$' or '.'
app.use(mongoSanitize());

// Parsing Cookies received from client
app.use(cookieParser());

// Using CORS to allow cross origin requests
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://127.0.0.1:4173",
      "http://192.168.0.131:65168",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Allowing files like images to upload
app.use(fileUpload());

// Configuring cloudinary to upload images
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connecting to the MongoDB database
(async () => {
  await connectDB();
})();

// Initializing Node cache
export const myCache = new NodeCache();

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

// Default route for the server
app.get("/", (req, res) => {
  res.send(`<h1>API is working correctly!</h1>`);
});

// Showing page not found if URL doesn't exist
app.all("*", (req, res, next) => {
  return next(new AppError("Page Not Found!", 404));
});

// Starting the server
const server = app.listen(PORT, (err) => {
  if (err) {
    console.log(`Server is not up and running on port: ${PORT}`, err);
    return;
  }
  console.log(`Server is up and running on port: ${PORT}`);

  // Starting the Coupon Job Scheduler
  startCouponJob();

  // Loading the NLP model
  (async () => {
    try {
      // Checking if the trained model already exists

      if (fs.existsSync(modalFilePath)) {
        // Trained Model already exists, so we directly load it
        await manager.load(modalFilePath);
      } else {
        // Model doesn't exists, so training and saving the model for further use
        await trainAndSaveModel();

        // Loading the model
        await manager.load(modalFilePath);
        console.log("Successfully model is trained and saved!");
      }

      console.log("Successfully model is loaded!");
    } catch (err) {
      console.log(
        "Training and loading model error in server.js file",
        err?.message
      );
    }
  })();
});

// Handling unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.name}`, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Using Error middleware to catch all the asynchronous errors in the app
app.use(errorMiddleware);
