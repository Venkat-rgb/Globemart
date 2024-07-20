import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      customerId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, "Customer Id is required!"],
      },
      customerName: {
        type: String,
        required: [true, "Customer name is required!"],
      },
    },
    products: [
      {
        product: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Product",
          required: [true, "ProductId is required!"],
        },
        quantity: {
          type: Number,
          required: [true, "Please enter Product Quantity!"],
        },
        price: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Product",
          required: [true, "Please enter Product Price!"],
        },
      },
    ],

    shippingInfo: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Address",
      required: [true, "Please enter Shipping Info!"],
    },

    paymentInfo: {
      paymentStatus: {
        type: Boolean,
        default: false,
      },
      paidAt: Date,
      paymentMode: {
        type: String,
        enum: {
          values: ["online", "offline"],
          message: `Payment mode can be either online (or) offline`,
        },
      },
    },

    currency: String,

    coupon: {
      couponCode: String,
      couponPriceInINR: Number,
    },

    shippingAmount: {
      type: Number,
      required: [true, "Please enter shipping amount!"],
    },

    gstAmount: {
      type: Number,
      required: [true, "Please enter GST!"],
    },

    subTotalAmount: {
      type: Number,
      required: [true, "Please enter Sub-total amount!"],
    },

    finalTotalAmountCountrySpecific: Number,

    finalTotalAmountInINR: {
      type: Number,
      required: [true, "Please enter Final total amount in INR!"],
    },

    productsOrderedDate: Date,

    deliveryInfo: {
      deliveryStatus: {
        type: String,
        trim: true,
        enum: {
          values: ["processing", "shipped", "delivered"],
          message: `Status can be either processing, shipped, delivered`,
        },
        default: "processing",
      },
      deliveredAt: Date,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
