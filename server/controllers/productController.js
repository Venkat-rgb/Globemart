import { catchAsync } from "../utils/catchAsync.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import { manager } from "../utils/train.js";
import { Review } from "../models/Review.js";

// GET ALL PRODUCTS
export const getProducts = catchAsync(async (req, res) => {
  // Filtering the products
  const features = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sortBy();

  let products = await features.query;

  const totalProductsCount = products.length;

  // Applying pagination and limiting the fields which are to be send to client
  features.limitFields().paginate();

  // Creating copy of features query, so that we can modify it without affecting the actual query
  products = await features.query.clone();

  res.status(200).json({
    products,
    totalProductsCount,
  });
});

// GET FEATURED PRODUCTS
export const getFeaturedProducts = catchAsync(async (req, res) => {
  const products = await Product.find()
    .sort({ rating: -1, createdAt: -1 })
    .limit(9);

  res.status(200).json({ products });
});

// GET PRODUCTS THROUGH VOICE
export const getProductsThroughVoice = catchAsync(async (req, res, next) => {
  const { text } = req.query;

  const trimmedText = text?.trim();

  // If user doesn't speaked anything
  if (!trimmedText) {
    return next(new AppError("Please speak!", 400));
  }

  // Processing the user's voice and getting the matched product category
  const productCategoryRes = await manager.process(trimmedText);

  const category = productCategoryRes?.answer;

  // If category doesn't exists, then the error
  if (!category) {
    return next(new AppError("No products found, please try again!", 404));
  }

  // Getting only 10 products based on product category
  const products = await Product.find({ category }).limit(10);

  // Sending products as response
  res.status(200).json({
    products,
  });
});

// export const getProduct = catchAsync(async (req, res, next) => {
//   const { id } = req.params;

//   const product = await Product.findById(id).populate({
//     path: "reviews.user",
//     select: "username profileImg",
//   });

//   if (!product) {
//     return next(new AppError(`Product does not exist!`, 400));
//   }

//   res.status(200).json({
//     success: true,
//     product,
//   });
// });

// GET SINGLE PRODUCT
export const getProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new AppError(`Product does not exist!`, 400));
  }

  res.status(200).json({
    product,
  });
});

// CREATE PRODUCT (Admin)
export const createProduct = catchAsync(async (req, res, next) => {
  const reqFields = {
    title: req.body.title,
    description: req.body.description,
    productFeatures: req.body.productFeatures,
    category: req.body.category,
    price: req.body.price,
    discount: req.body.discount,
    stock: req.body.stock,
  };

  const images = req.body.images,
    imgRes = [];

  if (!images) {
    return next(new AppError("Please enter product images!"));
  }

  // Checking if price and discount are there so that we can calculate discountPrice
  if (reqFields?.price > 50 && reqFields?.discount > 1) {
    const productDiscount = Number(
      (reqFields?.price * (reqFields?.discount / 100)).toFixed(2)
    );

    // Adding new discountPrice property to reqField
    reqFields["discountPrice"] = Number(
      (reqFields?.price - productDiscount).toFixed(2)
    );
  }

  // Creating new product in DB
  const product = await Product.create(reqFields);

  // If there is only single product image
  if (typeof images === "string") {
    // Uploading single image to cloudinary
    const imgData = await cloudinary.v2.uploader.upload(images, {
      folder: "products",
    });

    // Saving the stored cloudinary's image info in imgRes array
    imgRes.push({ public_id: imgData?.public_id, url: imgData?.secure_url });
  } else {
    // If there are multiple product images
    for (let i = 0; i < images?.length; i++) {
      // Uploading image to cloudinary
      const imgData = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      // Saving the stored cloudinary's image info in imgRes array
      imgRes.push({ public_id: imgData?.public_id, url: imgData?.secure_url });
    }
  }

  // w_800,h_800,c_fill,f_auto,q_80/

  // Storing images with their respective cloudinary image url's in images field of product model
  product.images = imgRes;

  // Saving the updated product model to DB
  await product.save();

  res.status(201).json({
    message: "Product created successfully!",
  });
});

// UPDATE PRODUCT (Admin)
export const updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const reqFields = {
    title: req.body.title,
    description: req.body.description,
    productFeatures: req.body.productFeatures,
    category: req.body.category,
    price: req.body.price,
    discount: req.body.discount,
    stock: req.body.stock,
  };

  // Updating discountPrice if price (or) discount are changed
  const beforeUpdatingProduct = await Product.findById(id);

  const productDiscount = Number(
    (reqFields?.price * (reqFields?.discount / 100)).toFixed(2)
  );

  // If price and discount are changed then only update discountPrice
  if (
    beforeUpdatingProduct?.price !== +reqFields?.price ||
    beforeUpdatingProduct?.discount !== +reqFields?.discount
  ) {
    reqFields["discountPrice"] = Number(
      (reqFields?.price - productDiscount).toFixed(2)
    );
  }

  // Updating the product details
  const updatedProduct = await Product.findByIdAndUpdate(id, reqFields, {
    new: true,
    runValidators: true,
  });

  // Returning error if product doesn't exist
  if (!updatedProduct) {
    return next(new AppError(`Product does not exist!`, 400));
  }

  const modifiedProduct = await Product.findById(id);

  let images = req.body.images,
    imgRes = [];

  // If user wants to modify the product images
  if (images && images?.length > 0) {
    // 1) Delete existing images from cloudinary

    for (let i = 0; i < modifiedProduct?.images?.length; ++i) {
      // Deleting the image from cloudinary
      await cloudinary.v2.uploader.destroy(
        modifiedProduct?.images[i]?.public_id
      );
    }

    // 2) Now save new images to cloudinary
    if (typeof images === "string") {
      // If there is single new image
      const imgData = await cloudinary.v2.uploader.upload(images, {
        folder: "products",
      });

      // Saving the stored cloudinary's image info in imgRes array
      imgRes.push({ public_id: imgData?.public_id, url: imgData?.secure_url });
    } else {
      // If there are multiple new images
      for (let i = 0; i < images?.length; ++i) {
        const imgData = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });

        // Saving the stored cloudinary's image info in imgRes array
        imgRes.push({
          public_id: imgData?.public_id,
          url: imgData?.secure_url,
        });
      }
    }

    // Storing new images with their respective cloudinary image url's in images field of product model
    modifiedProduct.images = imgRes;

    // Saving the updated product model in DB
    await modifiedProduct.save();
  }

  res.status(200).json({
    message: `Product Updated Successfully!`,
    images,
  });
});

// DELETE PRODUCT (Admin)
export const deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new AppError(`Product does not exist!`, 400));
  }

  // Deleting all product images
  for (let i = 0; i < product.images?.length; ++i) {
    await cloudinary.v2.uploader.destroy(product.images[i]?.public_id);
  }

  // Deleting the product
  await Product.findByIdAndDelete(id);

  // Deleting all the reviews of this product
  await Review.deleteMany({ productId: id });

  res.status(200).json({
    message: `Product deleted successfully!`,
  });
});

// export const getReviews = catchAsync(async (req, res, next) => {
//   const { id: productId } = req.params;

//   const trimmedProductId = productId?.trim();

//   if (!mongoose.Types.ObjectId.isValid(trimmedProductId)) {
//     return next(new AppError(`Please enter Product ID!`, 404));
//   }

//   // Getting Product By populating reviews.user field by username. so reviews.user contain (username, _id) properties and not only _id
//   const reviews = await Product.findById(trimmedProductId)?.populate(
//     "reviews.user",
//     "username profileImg"
//   );

//   if (!reviews) return next(new AppError(`Product does not exist!`, 400));

//   res.status(200).json({
//     success: true,
//     reviews: reviews.reviews,
//   });
// });

// GET SINGLE PRODUCT REVIEWS
// export const getReviews = catchAsync(async (req, res, next) => {
//   const { id: productId } = req.params;
//   // const { page } = req.query;

//   const trimmedProductId = productId?.trim();

//   // Checking if productId is valid
//   if (!mongoose.Types.ObjectId.isValid(trimmedProductId)) {
//     return next(new AppError(`Please enter Product ID!`, 404));
//   }

//   // const totalReviewsCount =

//   // Getting Product By populating reviews.user field by username. so reviews.user contain (username, _id) properties and not only _id
//   const reviews = await Product.findById(trimmedProductId);

//   // Returning error if product doesn't exists
//   if (!reviews) return next(new AppError(`Product does not exist!`, 400));

//   // Sending reviews to client
//   res.status(200).json({
//     reviews: reviews.reviews,
//   });
// });

// CREATE (OR) UPDATE PRODUCT REVIEW
// export const createOrUpdateReview = catchAsync(async (req, res, next) => {
//   const { productId, rating, review } = req.body;

//   const trimmedProductId = productId?.trim();
//   const trimmedReview = review?.trim();

//   // Checking if Product ID is valid
//   if (!mongoose.Types.ObjectId.isValid(trimmedProductId)) {
//     return next(new AppError(`Please enter valid Product ID!`, 400));
//   }

//   if (!rating) {
//     return next(new AppError(`Please enter rating!`, 400));
//   }

//   if (!review || !trimmedReview) {
//     return next(new AppError(`Please enter review!`, 400));
//   }

//   const reqObj = {
//     user: req.user._id,
//     rating,
//     review: trimmedReview,
//   };

//   const product = await Product.findById(trimmedProductId);

//   if (!product)
//     return next(new AppError(`Product does not exist with this ID!`, 400));

//   // Checking if user already gave a review to a product (or) not
//   const isUserAlreadyReviewed = product.reviews.find(
//     (item) => item.user.toString() === req.user._id.toString()
//   );

//   // if User already gave a review we should not update the rating but just review.
//   if (isUserAlreadyReviewed) {
//     const updatedReview = await Product.updateOne(
//       { _id: trimmedProductId, "reviews.user": req.user._id },
//       {
//         $set: {
//           "reviews.$.review": trimmedReview,
//           "reviews.$.reviewUpdatedAt": new Date().toISOString(),
//         },
//       },
//       { runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: `Review updated successfully!`,
//     });
//   } else {
//     // As the user didn't give the review so we will create one
//     product.reviews.push(reqObj);

//     product.numOfReviews++;

//     const totalRatings = product.reviews.reduce(
//       (acc, product) => acc + product.rating,
//       0
//     );

//     product.rating = (totalRatings / product.reviews.length).toPrecision(2);

//     await product.validate();

//     await product.save();

//     res.status(201).json({
//       success: true,
//       message: "Review added Successfully!",
//     });
//   }
// });

// export const createOrUpdateReview = catchAsync(async (req, res, next) => {
//   const { productId, rating, review } = req.body;

//   const trimmedProductId = productId?.trim();
//   const trimmedReview = review?.trim();

//   // Checking if Product ID is valid
//   if (!mongoose.Types.ObjectId.isValid(trimmedProductId)) {
//     return next(new AppError(`Please enter valid Product ID!`, 400));
//   }

//   if (!rating) {
//     return next(new AppError(`Please enter rating!`, 400));
//   }

//   if (!review || !trimmedReview) {
//     return next(new AppError(`Please enter review!`, 400));
//   }

//   // Getting details of user who gave (or) about to give the review
//   const reviewingCustomer = await User.findById(req.user._id);

//   // collecting user information in object form
//   const reqObj = {
//     user: {
//       customerId: reviewingCustomer?._id,
//       customerName: reviewingCustomer?.username,
//       customerProfileImg: reviewingCustomer?.profileImg
//         ? {
//             public_id: reviewingCustomer?.profileImg?.public_id,
//             url: reviewingCustomer?.profileImg?.url,
//           }
//         : {},
//     },
//     rating,
//     review: trimmedReview,
//   };

//   // Finding the product, so that reviews can be added to it
//   const product = await Product.findById(trimmedProductId);

//   // Returning error if product is not found
//   if (!product)
//     return next(new AppError(`Product does not exist with this ID!`, 400));

//   // Checking if user already gave a review to a product (or) not
//   const isUserAlreadyReviewed = product.reviews.find(
//     (item) => item.user.customerId.toString() === req.user._id.toString()
//   );

//   // if User already gave a review we should not update the rating but just review.
//   if (isUserAlreadyReviewed) {
//     const updatedReview = await Product.updateOne(
//       { _id: trimmedProductId, "reviews.user.customerId": req.user._id },
//       {
//         $set: {
//           "reviews.$.review": trimmedReview,
//           "reviews.$.reviewUpdatedAt": new Date().toISOString(),
//         },
//       },
//       { runValidators: true }
//     );

//     res.status(200).json({
//       message: `Review updated successfully!`,
//     });
//   } else {
//     // As the user didn't give the review so we will create one
//     product.reviews.push(reqObj);

//     // Increasing the count of number of reviews
//     product.numOfReviews++;

//     // Calculating the average rating of the product
//     const totalRatings = product.reviews.reduce(
//       (acc, product) => acc + product.rating,
//       0
//     );

//     // Storing the average rating of product in rating field
//     product.rating = (totalRatings / product.reviews.length).toPrecision(2);

//     // Validating the updated product, to catch any errors as product is updated
//     await product.validate();

//     // Saving the updated product in DB
//     await product.save();

//     res.status(201).json({
//       message: "Review added Successfully!",
//     });
//   }
// });

// DELETE PRODUCT REVIEW
// export const deleteReview = catchAsync(async (req, res, next) => {
//   const { productId, reviewId } = req.body;

//   const trimmedProductId = productId?.trim();
//   const trimmedReviewId = reviewId?.trim();

//   // Checking if productId is valid
//   if (!mongoose.Types.ObjectId.isValid(trimmedProductId)) {
//     return next(new AppError(`Please enter valid Product ID!`, 400));
//   }

//   // Checking if reviewId is valid
//   if (!mongoose.Types.ObjectId.isValid(trimmedReviewId)) {
//     return next(new AppError(`Please enter valid Review ID!`, 400));
//   }

//   // Removing the review with reviewId
//   const deletingReview = await Product.findOneAndUpdate(
//     { _id: trimmedProductId },
//     { $pull: { reviews: { _id: trimmedReviewId } } },
//     { new: true }
//   );

//   // Returning error if product doesn't exist
//   if (!deletingReview) {
//     return next(new AppError(`Product does not exist with given ID!`, 404));
//   }

//   const product = await Product.findById(trimmedProductId);

//   // As the review is getting deleted we also need to decrease numOfReviews and rating.
//   product.numOfReviews--;

//   // Calculating the average rating of product again, as the review is deleted above
//   const totalRatings = product.reviews.reduce(
//     (acc, product) => acc + product.rating,
//     0
//   );

//   // Update the actual rating if there are any reviews given to the product
//   if (totalRatings > 0 && product.reviews.length > 0) {
//     product.rating = (totalRatings / product.reviews.length).toPrecision(2);
//   } else {
//     // As nobody gave the review to the product, rating should be 0
//     product.rating = 0;
//   }

//   // Validating the updated product to find any errors
//   await product.validate();

//   // Saving the updated product to DB
//   await product.save();

//   res.status(200).json({
//     message: "Review deleted successfully!",
//   });
// });
