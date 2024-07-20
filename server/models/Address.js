import mongoose from "mongoose";
import { parsePhoneNumber } from "libphonenumber-js/mobile";

const addressSchema = new mongoose.Schema(
  {
    customer: {
      customerId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, "Please enter customer ID!"],
      },
      customerName: {
        type: String,
        required: [true, "Please enter Customer name!"],
      },
    },

    address: {
      type: String,
      trim: true,
      required: [true, "Please enter your Home Address!"],
      minlength: [10, "Home Address should be atleast 10 characters!"],
      maxlength: [150, "Home Address should be <= 150 characters!"],
    },

    country: {
      countryName: {
        type: String,
        trim: true,
        required: [true, "Please enter your Country name!"],
      },
      countryCode: String,
    },

    state: {
      stateName: {
        type: String,
        trim: true,
        required: [true, "Please enter your State name!"],
      },
      stateCode: String,
    },

    city: {
      type: String,
      trim: true,
      required: [true, "Please enter your city!"],
    },

    phoneNo: {
      type: Object,
      validate: {
        validator: (v) => {
          const parsingPhoneNumber = parsePhoneNumber(v.phone, v.countryCode);

          return parsingPhoneNumber.isValid();
        },
        message: ({ value }) => `${value.phone} is not a valid phone number!`,
      },
      required: [true, "Please enter your Phone Number!"],
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export const Address = mongoose.model("Address", addressSchema);
