import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter store name!"],
      trim: true,
      unique: true,
      minlength: [2, "Store name must be atleast 2 characters!"],
      maxlength: [200, "Store name must be <= 200 characters!"],
    },

    address: {
      type: String,
      required: [true, "Please enter store address!"],
      trim: true,
      unique: true,
      minlength: [10, "Store address must be atleast 10 characters!"],
      maxlength: [400, "Store address must be <= 400 characters!"],
    },

    ratingInfo: {
      rating: {
        type: Number,
        required: [true, "Please enter store rating!"],
        min: [1, "Store rating must be atleast 1"],
        max: [5, "Store rating must be <= 5"],
      },

      reviewsCount: Number,
    },

    categories: {
      type: [String],
      validate: {
        validator: function (value) {
          // categories should be array type and user should enter atleast 1 category
          return Array.isArray(value) && value?.length > 0;
        },
        message: `Categories for store must be atleast 1`,
      },
    },

    location: {
      type: {
        type: String,
        trim: true,
        required: [true, "Please enter store location Type!"],
        enum: {
          values: ["Point"],
          message: "Location can only be of type 'Point'",
        },
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: function (value) {
            // If coordinates array have > 2 values (or) if length of array is 0 then show error
            if (value?.length > 2 || value?.length === 0) {
              return false;
            }

            const [longitude, latitude] = value;

            // Latitude and Longitude should be in valid range
            return (
              latitude <= 90 &&
              latitude >= -90 &&
              longitude >= -180 &&
              longitude <= 180
            );
          },
          message: `Invalid co-ordinates for the store!`,
        },
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export const Store = mongoose.model("Store", storeSchema);
