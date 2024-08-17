import { catchAsync } from "../utils/catchAsync.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import { manager } from "../utils/train.js";
import { Review } from "../models/Review.js";
import { myCache } from "../server.js";

// GET ALL PRODUCTS
export const getProducts = catchAsync(async (req, res) => {
  // Filtering the products
  let features = new APIFeatures([], req.query).search().filter().sortBy();

  let products = await Product.aggregate([
    ...features.query,
    { $count: "productsCount" },
  ]);

  const productsTotalCount = products[0]?.productsCount;

  features = new APIFeatures(features.query, req.query)
    .limitFields()
    .paginate();

  let finalTrimmedProducts = await Product.aggregate(features.query);

  res.status(200).json({
    products: finalTrimmedProducts,
    totalProductsCount: productsTotalCount > 0 ? productsTotalCount : 0,
  });
});

// GET FEATURED PRODUCTS
export const getFeaturedProducts = catchAsync(async (req, res) => {
  let products = [];

  const cacheKey = "featured_products";

  // Checking if the products exists in the cache
  if (myCache.has(cacheKey)) {
    console.log("Cached Featured Products!");
    // If exists, then send these products to client without making any request to database
    products = JSON.parse(myCache.get(cacheKey));
  } else {
    // Making request to database as products are not available in cache
    products = await Product.aggregate([
      {
        $sort: { rating: -1, createdAt: -1 },
      },
      {
        $project: {
          title: 1,
          rating: 1,
          numOfReviews: 1,
          price: 1,
          discount: 1,
          discountPrice: 1,
          images: { $slice: ["$images", 1] },
        },
      },
      { $limit: 9 },
    ]);

    // Storing the featured products in cache for future use
    myCache.set(cacheKey, JSON.stringify(products));
    console.log("Featured Products from DB!");
  }

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

  // Getting products based on product category
  const products = await Product.aggregate([
    { $match: { category } },
    {
      $project: {
        _id: "$_id",
        title: "$title",
        description: { $substr: ["$description", 0, 165] },
        images: { $slice: ["$images", 1] },
      },
    },
  ]);

  // Sending products as response
  res.status(200).json({
    products,
  });
});

// GET SINGLE PRODUCT
export const getProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const key = `product_${id}`;

  let product;

  // If product is present in cache we don't make an API call to database
  if (myCache.has(key)) {
    product = JSON.parse(myCache.get(key));
    console.log(`Cached Single product: ${id}`);
  } else {
    // Making API call to database as product is not in cache
    product = await Product.findById(id);

    // Returning error if product doesn't exist in DB
    if (!product) {
      return next(new AppError(`Product does not exist!`, 400));
    }

    // Setting product in cache for further use
    myCache.set(key, JSON.stringify(product));
    console.log(`Single Product from DB: ${id}`);
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

  // Deleting the featured products cache as we are adding new product
  const cacheKey = [
    "featured_products",
    `related_products_${product?.category}`,
  ];

  myCache.del(cacheKey);

  console.log(`Deleted ${cacheKey} from cache in createProductController`);

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

  // Deleting the products from the cache as they are getting updated
  const cacheKeys = [
    "featured_products",
    `product_${id}`,
    `related_products_${modifiedProduct?.category}`,
  ];

  myCache.del(cacheKeys);

  console.log(`Deleted ${cacheKeys} from cache in updateProductController`);

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

  // Deleting the products from the cache as they are getting updated
  const cacheKeys = [
    "featured_products",
    `product_${id}`,
    `related_products_${product?.category}`,
  ];

  myCache.del(cacheKeys);

  console.log(`Deleted ${cacheKeys} from cache in deleteProductController`);

  res.status(200).json({
    message: `Product deleted successfully!`,
  });
});
