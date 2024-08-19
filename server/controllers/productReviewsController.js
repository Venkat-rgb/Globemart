import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { myCache } from "../server.js";

// GET ALL PRODUCT REVIEWS
export const getReviews = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { page, pageLimit } = req.query;

  const pageLimitNum = +pageLimit ? +pageLimit : 10;
  const pageNum = +page ? +page * +pageLimitNum : 0;

  const trimmedProductId = id?.trim();

  // Checking if productId is valid
  if (!mongoose.Types.ObjectId.isValid(trimmedProductId)) {
    return next(new AppError(`Please enter Product ID!`, 404));
  }

  const cacheKey = `product_reviews_${pageNum}`;

  let reviews = [];

  if (myCache.has(cacheKey)) {
    reviews = JSON.parse(myCache.get(cacheKey));
    console.log("Cached Product Reviews!");
  } else {
    // Fetching product reviews from DB as they don't exist in cache
    reviews = await Review.find({ productId: trimmedProductId })
      .skip(pageNum)
      .limit(pageLimitNum);

    // Storing the newly fetched reviews into the cache
    myCache.set(cacheKey, JSON.stringify(reviews));
    console.log("Product Reviews from DB!");
  }

  // Finding all product reviews based on productId
  const totalReviewsCount = await Review.find({
    productId: trimmedProductId,
  }).countDocuments();

  // Sending reviews to client
  res.status(200).json({
    reviews,
    totalReviewsCount,
  });
});

// GET SINGLE PRODUCT REVIEW
export const getSingleReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const trimmedProductId = id?.trim();

  // Checking if productId is valid
  if (!mongoose.Types.ObjectId.isValid(trimmedProductId)) {
    return next(new AppError(`Please enter Product ID!`, 404));
  }

  // Finding customer review
  const review = await Review.findOne({
    productId: trimmedProductId,
    "user.customerId": req.user._id,
  });

  // Sending reviews to client
  res.status(200).json({
    review,
  });
});

// CREATE OR UPDATE REVIEW
export const createOrUpdateReview = catchAsync(async (req, res, next) => {
  const { productId, rating, review } = req.body;

  const trimmedProductId = productId?.trim();
  const trimmedReview = review?.trim();

  // Checking if Product ID is valid
  if (!mongoose.Types.ObjectId.isValid(trimmedProductId)) {
    return next(new AppError(`Please enter valid Product ID!`, 400));
  }

  // Checking if rating is given
  if (!rating) {
    return next(new AppError(`Please enter rating!`, 400));
  }

  // Checking if review is given
  if (!review || !trimmedReview) {
    return next(new AppError(`Please enter review!`, 400));
  }

  // Getting details of user who gave (or) about to give the review
  const reviewingCustomer = await User.findById(req.user._id);

  // collecting user information in object form
  const reqObj = {
    productId: trimmedProductId,
    user: {
      customerId: reviewingCustomer?._id,
      customerName: reviewingCustomer?.username,
      customerProfileImg: reviewingCustomer?.profileImg
        ? {
            public_id: reviewingCustomer?.profileImg?.public_id,
            url: reviewingCustomer?.profileImg?.url,
          }
        : {},
    },
    rating,
    review: trimmedReview,
  };

  const isReviewAlreadyExist = await Review.findOne({
    productId: trimmedProductId,
    "user.customerId": req.user._id,
  });

  // Checking if customer has already given the review
  if (isReviewAlreadyExist) {
    // Updating the existing review
    isReviewAlreadyExist.review = trimmedReview;

    // Validating the modified existing review to find any errors
    await isReviewAlreadyExist.validate();

    // Saving the modified review to DB
    await isReviewAlreadyExist.save();

    // Deleting all the product reviews
    const productReviewKeys = myCache
      .keys()
      .filter((key) => key.includes(`product_reviews`));

    console.log("productReviewKeys in updateReviewPart: ", productReviewKeys);

    myCache.del(productReviewKeys);

    console.log("Deleted product reviews from cache in updateReviewPart: ");

    res.status(200).json({
      message: "Review updated successfully!",
    });
  } else {
    // Creating new review
    await Review.create(reqObj);

    // Finding product to increase reviews count and calculate average rating
    const product = await Product.findById(trimmedProductId);

    // Increasing reviews count as review is given
    product.numOfReviews++;

    // Finding all the reviews given for this product
    const productReview = await Review.find({ productId: trimmedProductId });

    // Calculating the sum of all the ratings for this product
    const totalRatings = productReview?.reduce(
      (acc, item) => acc + item.rating,
      0
    );

    // Calculating the average rating of all reviews and assigning to the rating property of product model
    product.rating = (totalRatings / productReview.length).toPrecision(2);

    // Validating the product to find any errors
    await product.validate();

    // Saving the modified product to DB
    await product.save();

    // Deleting all the product reviews
    let cacheKeys = [
      `product_${product?._id}`,
      `featured_products`,
      `related_products_${product?.category}`,
    ];

    const productReviewKeys = myCache
      .keys()
      .filter((key) => key.includes(`product_reviews`));

    // const userWishlistKeys = myCache
    //   .keys()
    //   .filter((key) => key.includes(`user_wishlist`));

    cacheKeys = cacheKeys.concat(productReviewKeys);

    console.log("cacheKeys: ", cacheKeys);
    console.log("productReviewKeys in createReviewPart: ", productReviewKeys);

    myCache.del(cacheKeys);

    console.log("Deleted product reviews from cache in createReviewPart: ");

    res.status(201).json({
      message: "Review created successfully!",
    });
  }
});

// DELETE PRODUCT REVIEW (Admin)
export const deleteReview = catchAsync(async (req, res, next) => {
  const { productId, reviewId } = req.body;

  const trimmedProductId = productId?.trim();
  const trimmedReviewId = reviewId?.trim();

  // Checking if productId is valid
  if (!mongoose.Types.ObjectId.isValid(trimmedProductId)) {
    return next(new AppError(`Please enter valid Product ID!`, 400));
  }

  // Checking if reviewId is valid
  if (!mongoose.Types.ObjectId.isValid(trimmedReviewId)) {
    return next(new AppError(`Please enter valid Review ID!`, 400));
  }

  // Removing the review with reviewId
  const deletingReview = await Review.findOneAndDelete({
    _id: trimmedReviewId,
    productId: trimmedProductId,
  });

  // Returning error if product doesn't exist
  if (!deletingReview) {
    return next(new AppError(`Product does not exist with given ID!`, 404));
  }

  // Finding product to update rating and numOfReview as the review is deleted above
  const product = await Product.findById(trimmedProductId);

  // Finding new reviews after deleting the old review
  const updatedReviews = await Review.find({ productId: trimmedProductId });

  // As the review is getting deleted we need to decrease numOfReviews and rating.
  product.numOfReviews--;

  // Calculating the average rating of product again, as the review is deleted above
  const totalRatings = updatedReviews.reduce(
    (acc, product) => acc + product.rating,
    0
  );

  // Update the actual rating if there are any reviews given to the product
  if (totalRatings > 0 && updatedReviews.length > 0) {
    product.rating = (totalRatings / updatedReviews.length).toPrecision(2);
  } else {
    // As nobody gave the review to the product, rating should be 0
    product.rating = 0;
  }

  // Validating the updated product to find any errors
  await product.validate();

  // Saving the updated product to DB
  await product.save();

  // Deleting all the product reviews
  let cacheKeys = [
    `product_${product?._id}`,
    `featured_products`,
    `related_products_${product?.category}`,
  ];

  const productReviewKeys = myCache
    .keys()
    .filter((key) => key.includes(`product_reviews`));

  cacheKeys = cacheKeys.concat(productReviewKeys);

  console.log("cacheKeys: ", cacheKeys);
  console.log("productReviewKeys in createReviewPart: ", productReviewKeys);

  myCache.del(cacheKeys);

  console.log("Deleted product reviews from cache in deleteReviewPart: ");

  res.status(200).json({
    message: "Review deleted successfully!",
  });
});
