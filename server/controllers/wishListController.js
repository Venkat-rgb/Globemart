import mongoose from "mongoose";
import { WishList } from "../models/WishList.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { myCache } from "../server.js";

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

  const cacheKey = [
    `user_wishlist_${req.user._id}_${+page ? page : 0}`,
    `user_wishlist_${req.user._id}_full`,
  ];

  let paginatedWishlistProducts = [];

  if (page) {
    // Checking for paginated wishlist in the cache as page is provided
    if (myCache.has(cacheKey[0])) {
      paginatedWishlistProducts = JSON.parse(myCache.get(cacheKey[0]));

      console.log("Cached wishlist data page is provided!");

      // Sending the cached paginated wishlist to the client
      return res.status(200).json({
        wishList: paginatedWishlistProducts,
        totalWishlistCount: wishlistProductsCount[0]?.productsCount,
      });
    }
  } else {
    // Checking for total wishlist in the cache as page is not provided
    if (myCache.has(cacheKey[1])) {
      paginatedWishlistProducts = JSON.parse(myCache.get(cacheKey[1]));

      console.log("Cached wishlist data page is not provided!");

      // Sending the cached total wishlist to the client
      return res.status(200).json({
        wishList: paginatedWishlistProducts,
        totalWishlistCount: wishlistProductsCount[0]?.productsCount,
      });
    }
  }

  // Fetching wishlist as it is not present in the cache
  // Using aggregation inorder to fetch only 9 products and only first product  image in images array
  paginatedWishlistProducts = await WishList.aggregate([
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

  // Caching the wishlist for future use
  myCache.set(
    cacheKey[+page ? 0 : 1],
    JSON.stringify(paginatedWishlistProducts)
  );

  console.log(
    `Caching wishlist data for page:${cacheKey[+page ? 0 : 1]} for further use!`
  );

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

  const isWishListExists = await WishList.findOne({
    user: req.user._id,
  }).select("-createdAt -updatedAt");

  const filteredKeys = myCache
    .keys()
    .filter((key) => key.includes(`user_wishlist_${req.user._id}`));

  console.log("filteredKeys in createOrUpdateWishlist: ", filteredKeys);

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

      // Invalidating the user wishlist cache as wishlist is updated
      myCache.del(filteredKeys);

      console.log(`Deleted user wishlist from update part!`);

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

    // Invaliting the user wishlist cache as wishlist is created
    myCache.del(filteredKeys);

    console.log(`Deleted user wishlist from create part!`);

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

  const wishList = await WishList.findOne({ user: req.user._id }).select(
    "-createdAt -updatedAt"
  );

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

  // Invalidating wishlist cache as product is deleted from wishlist
  const filteredKeys = myCache
    .keys()
    .filter((key) => key.includes(`user_wishlist_${req.user._id}`));

  console.log("filteredKeys in deleteProductFromWishList: ", filteredKeys);

  myCache.del(filteredKeys);

  console.log(`Deleted single product from user wishlist!`);

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

  // Invalidating wishlist cache as wishlist has become empty
  const filteredKeys = myCache
    .keys()
    .filter((key) => key.includes(`user_wishlist_${req.user._id}`));

  myCache.del(filteredKeys);

  console.log("filteredKeys in deleteWishList: ", filteredKeys);

  console.log(`Deleted all products from user wishlist!`);

  res.status(200).json({
    message: `Products deleted from wishlist successfully!`,
  });
});
