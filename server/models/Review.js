import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Product",
      required: [true, "Please enter product ID"],
    },

    user: {
      customerId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, "UserId is required!"],
      },
      customerName: {
        type: String,
        required: ["Please enter username of reviewer!"],
        trim: true,
      },
      customerProfileImg: {
        public_id: String,
        url: String,
      },
    },

    rating: {
      type: Number,
      required: [true, "Please give a Product rating!"],
      min: [1, `Product rating should be atleast 1`],
      max: [5, `Product rating can't exceed 5`],
    },

    review: {
      type: String,
      minlength: [5, "Review should be atleast 5 characters long!"],
      maxlength: [300, `Review can't be more than 300 characters long!`],
      required: [true, "Please give product review!"],
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export const Review = mongoose.model("Review", reviewSchema);
