import express from "express";
import { restrictTo, verifyToken } from "../middlewares/verifyToken.js";
import {
  createChat,
  getAllChatsOfUser,
  getSingleChat,
} from "../controllers/chatsController.js";

const router = express.Router();

router
  .route("/")
  .get(verifyToken, restrictTo("admin"), getAllChatsOfUser)
  .post(verifyToken, restrictTo("user"), createChat);

router.route("/:id").get(verifyToken, getSingleChat);

export default router;
