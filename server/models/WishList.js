import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, `UserId is required!`],
    },
    products: [
      {
        product: {
          type: mongoose.SchemaTypes.ObjectId,
          trim: true,
          ref: "Product",
          required: [true, `ProductId is required!`],
        },
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
  }
);

export const WishList = mongoose.model("WishList", wishListSchema);
