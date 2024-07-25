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
  .get(verifyToken, getAllChatsOfUser)
  .post(verifyToken, createChat);

router.route("/:id").get(verifyToken, getSingleChat);

export default router;
