import mongoose from "mongoose";
import { WishList } from "../models/WishList.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

// GETTING USER WISHLIST
export const getWishList = catchAsync(async (req, res, next) => {
  const { page } = req.query;

  // Getting the total wishlist products count
  const wishlistProductsCount = await WishList.aggregate([
    {
      $match: { user: req.user._id },
    },
    {
      $unwind: "$products",
    },
    {
      $count: "productsCount",
    },
  ]);

  // Either wishlist is not created (or) products in wishlist are empty
  if (!wishlistProductsCount?.length) {
    return res.status(200).json({ productsCount: 0 });
  }

  // Using pagination
  const pageLimit = +page > 0 ? 9 : wishlistProductsCount[0]?.productsCount;
  const skipQty = +page > 0 ? (+page - 1) * pageLimit : 0;

  // Using aggregation inorder to fetch only 9 products and only first product  image in images array
  let paginatedWishlistProducts = await WishList.aggregate([
    {
      $match: { user: req.user._id },
    },
    {
      $project: { products: 1, _id: 0 },
    },
    {
      $unwind: "$products",
    },
    {
      $skip: skipQty,
    },
    {
      $limit: pageLimit,
    },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $project: {
        product: {
          _id: "$productDetails._id",
          title: "$productDetails.title",
          price: "$productDetails.price",
          rating: "$productDetails.rating",
          numOfReviews: "$productDetails.numOfReviews",
          discount: "$productDetails.discount",
          discountPrice: "$productDetails.discountPrice",
          images: { $slice: ["$productDetails.images", 1] },
        },
      },
    },
  ]);

  res.status(200).json({
    wishList: paginatedWishlistProducts,
    totalWishlistCount: wishlistProductsCount[0]?.productsCount,
  });
});

// CREATING OR UPDATING USER WISHLIST
export const createOrUpdateWishList = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  const trimmedProductId = productId?.trim();

  // Checking if productId is valid
  if (!mongoose.Types.ObjectId.isValid(trimmedProductId)) {
    return next(new AppError(`Please enter valid Product ID!`, 400));
  }

  const isWishListExists = await WishList.findOne({ user: req.user._id });

  // If wishlist is already present
  if (isWishListExists) {
    // 1) If product already exists in wishlist then we dont want to insert again
    const isProductExists = isWishListExists.products.find(
      (item) => item.product.toString() === trimmedProductId
    );

    // Returning error when user trying to insert product in wishlist when its  already present
    if (isProductExists) {
      return next(
        new AppError(`Product has been already added to wishlist!`, 400)
      );
    } else {
      // Product does not exist in wishlist so we can insert this new product now
      isWishListExists.products.push({ product: trimmedProductId });

      // Validating the wishlist to find any errors
      await isWishListExists.validate();

      // Saving the updated wishlist to the DB
      await isWishListExists.save();

      res.status(200).json({
        message: `Product added to wishlist successfully!`,
      });
    }
  } else {
    // If wishlist is not present then creating the new one
    await WishList.create({
      user: req.user._id,
      products: [{ product: trimmedProductId }],
    });

    res.status(201).json({
      message: `Product added to wishlist successfully!`,
    });
  }
});

// DELETING SINGLE PRODUCT FROM USER WISHLIST
export const deleteProductFromWishList = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  const trimmedProductId = productId?.trim();

  // Checking if productId is valid
  if (!mongoose.Types.ObjectId.isValid(trimmedProductId)) {
    return next(new AppError(`Please enter a valid product ID!`, 400));
  }

  const wishList = await WishList.findOne({ user: req.user._id });

  if (!wishList) {
    return next(
      new AppError(`Wishlist is empty, please add some products!`, 400)
    );
  }

  // Check if productExists
  const isProductExists = wishList.products.find(
    (item) => item.product.toString() === trimmedProductId
  );

  // Returning error as we can't delete product from wishlist if its not
  if (!isProductExists) {
    return next(new AppError(`Product does not exist in the wishlist!`, 400));
  }

  // Deleting the product from wishlist
  await WishList.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: { product: trimmedProductId } } },
    { new: true }
  );

  res.status(200).json({
    message: `Product deleted successfully from Wishlist!`,
  });
});

// DELETING TOTAL WISHLIST OF USER
export const deleteWishList = catchAsync(async (req, res, next) => {
  // Deleting all the products from wishlist
  const wishList = await WishList.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    { new: true }
  );

  // Returning error if wishlist doesn't exist
  if (!wishList) {
    return next(
      new AppError(`Wishlist is empty, please add some products!`, 400)
    );
  }

  res.status(200).json({
    message: `Products deleted from wishlist successfully!`,
  });
});
