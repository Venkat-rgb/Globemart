import mongoose from "mongoose";
import { getNumOfDaysLeft } from "../utils/getNumOfDaysLeft.js";

const couponSchema = new mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: [true, "Please enter coupon code!"],
      trim: true,
      unique: true,
      minlength: [5, "Coupon code must be atleast 5 characters"],
      maxlength: [20, "Coupon code must be <= 20 characters"],
      uppercase: true,
    },

    occasionName: {
      type: String,
      required: [true, "Please enter Occasion name!"],
      trim: true,
      unique: true,
      minlength: [5, "Occasion name must be atleast 5 characters"],
      maxlength: [40, "Occasion name must be <= 40 characters"],
      capitalize: true,
    },

    startDate: {
      type: Date,
      required: [true, "Please enter start date for the coupon!"],
      // validate: {
      //   validator: function (date) {
      //     return date >= new Date();
      //   },
      //   message: (props) => `Start date cannot be in past!`,
      // },
    },

    endDate: {
      type: Date,
      required: [true, "Please enter end date for the coupon!"],
      // validate: {
      //   validator: function (date) {
      //     return date > this.startDate;
      //   },
      //   message: `End date should be greater than start date!`,
      // },
    },

    discount: {
      type: Number,
      required: [true, "Please enter discount for the coupon!"],
      min: [2, "Discount should be atleast 2%"],
      max: [80, "Discount should be <= 80%"],
    },

    couponStatus: {
      type: String,
      trim: true,
      enum: {
        values: ["inactive", "active", "expired"],
        message: `Coupon status can be either inactive (or) active (or) expired`,
      },
      default: "inactive",
    },

    couponText: String,
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Creating couponText based on below parameters
couponSchema.methods.setCouponText = function (
  occasionName,
  couponCode,
  discount,
  startDate,
  endDate
) {
  try {
    // Calculating number of days left for coupon validity

    const numOfDaysLeft = getNumOfDaysLeft(
      new Date(endDate),
      new Date(startDate)
    );

    return `Sales for '${occasionName}' occasion are waiting for you, enter coupon ${couponCode} to get ${discount}% off! (${numOfDaysLeft} ${
      numOfDaysLeft === 1 ? "day" : "days"
    } left)`;
  } catch (err) {
    console.log("setCouponText method error: ", err?.message);
  }
};

export const Coupon = mongoose.model("Coupon", couponSchema);
