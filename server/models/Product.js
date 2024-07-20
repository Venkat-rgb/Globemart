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

/*
hey i want to increase 20% discount on the current discount only when there are festivals. so what I'm thinking is I will create a file in utils folder called festivals.js and I will create an array which will be in below format:
const festivals = [
  {
        festival: 'Black Friday',
        month: 'November',
        startDay: '',
        endDay: '',
  }
]

// color: String,

    // size: {
    //   type: String,
    //   enum: {
    //     values: ["XS", "S", "M", "L", "XL"],
    //     message: "Size can be either (XS, S, M, L, XL)",
    //   },
    // },

/*
      -> below im manually passing fields customer id, name, profileImg instead of referencing User model bcz it helps in scenario where the user have review to some products and after that if i delete that user as im admin then those reviews should not be deleted.
      
      -> so if i referenced User model then immediately after deleting user the review doesnt have valid username and profileImg. 
    
    */

// reviews: [
//   {
//     user: {
//       customerId: {
//         type: mongoose.SchemaTypes.ObjectId,
//         required: [true, "UserId is required!"],
//       },
//       customerName: {
//         type: String,
//         required: ["Please enter username of reviewer!"],
//         trim: true,
//       },
//       customerProfileImg: {
//         public_id: String,
//         url: String,
//       },
//     },
//     rating: {
//       type: Number,
//       required: [true, "Please give a Product rating!"],
//       min: [1, `Product rating should be atleast 1`],
//       max: [5, `Product rating can't exceed 5`],
//     },
//     review: {
//       type: String,
//       maxlength: [300, `Review can't be more than 300 characters!`],
//     },
//     reviewCreatedAt: {
//       type: Date,
//       default: Date.now,
//     },
//     reviewUpdatedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
// ],
