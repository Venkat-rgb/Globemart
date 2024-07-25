import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please enter Product title!"],
      minlength: [5, "Product title should be atleast 5 characters!"],
      maxlength: [100, "Product title should be less than 100 characters!"],
    },

    description: {
      type: String,
      trim: true,
      required: [true, "Please enter Product description!"],
      minlength: [20, "Product description should be atleast 20 characters!"],
      maxlength: [
        500,
        "Product description should be less than 500 characters!",
      ],
    },

    productFeatures: {
      type: String,
      trim: true,
      required: [true, "Please enter Product Features!"],
    },

    rating: {
      type: Number,
      default: 0,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      required: [true, "Please enter product category!"],
    },

    price: {
      type: Number,
      required: [true, "Please enter Product price!"],
      min: [50, "Product price should be atleast ₹50!"],
      max: [300000, `Product price can't exceed ₹300000!`],
    },

    discount: {
      type: Number,
      required: [true, "Please enter Discount!"],
      min: [2, "Discount should be atleast 2%"],
      max: [50, "Discount should be less then 50%"],
    },

    discountPrice: Number,

    images: [
      {
        public_id: {
          type: String,
          required: [true, "Please enter product's image publicId!"],
        },
        url: {
          type: String,
          required: [true, "Please enter product's image URL!"],
        },
      },
    ],

    stock: {
      type: Number,
      max: [100, `Product stock can't exceed 100`],
      default: 1,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
