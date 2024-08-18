import { Coupon } from "../models/Coupon.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import { myCache } from "../server.js";

// GET ALL COUPONS (ADMIN)
export const getAllCoupons = catchAsync(async (req, res) => {
  const { page } = req.query;

  // Finding total available coupons count
  const totalCouponsCount = await Coupon.find().countDocuments();

  // Finding all coupons present in database by sorting according to createdAt
  const coupons = await Coupon.find()
    .sort({ createdAt: -1 })
    .select("-couponText -startDate -endDate -createdAt -updatedAt")
    .skip(+page ? +page * 10 : 0)
    .limit(10);

  res.status(200).json({
    coupons,
    totalCouponsCount,
  });
});

// GET SINGLE VALID COUPON
export const singleValidCoupon = catchAsync(async (req, res, next) => {
  const cacheKey = `valid_coupon`;

  let coupon;

  if (myCache.has(cacheKey)) {
    coupon = JSON.parse(myCache.get(cacheKey));
    console.log("Cached Valid Coupon!");
  } else {
    // Finding active coupon
    coupon = await Coupon.findOne({ couponStatus: "active" })
      .sort("-createdAt")
      .select("couponCode couponText discount");

    // If active coupon doesn't exists then returning error to client
    if (!coupon) {
      return next(new AppError(`No valid coupon found!`, 404));
    }

    myCache.set(cacheKey, JSON.stringify(coupon));
    console.log("Valid Coupon from DB!");
  }

  res.status(200).json({
    coupon,
  });
});

// GET COUPON BY ID (ADMIN)
export const getCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Finding coupon by 'id'
  const coupon = await Coupon.findById(id).select(
    "-createdAt -updatedAt -couponText"
  );

  // If coupon is not found, then returning error to client
  if (!coupon) {
    return next(new AppError(`Coupon does not exist!`, 404));
  }

  // If coupon is found then returning to client
  res.status(200).json({
    coupon,
  });
});

// CREATE COUPON (ADMIN)
export const createCoupon = catchAsync(async (req, res, next) => {
  // Gives startdate day number in an year eg: (181)

  const { currentDate, ...otherDetails } = req.body;

  // Coupon start date time in milliseconds
  const startDateTime = new Date(otherDetails.startDate).getTime();

  // Coupon end date time in milliseconds
  const endDateTime = new Date(otherDetails.endDate).getTime();

  // Today's date time in milliseconds
  const currentDateTime = new Date(currentDate).getTime();

  /*
    Edge cases of startDate and endDate which we need to handle
    (1) startDate and endDate are less than the current date
    (2) startDate > currentDate, endDate > startDate
    (3) startDate = currentDate, endDate > startDate
    (4) startDate > currentDate, startDate > endDate
    (5) startDate = currentDate, startDate = endDate
  */

  // If coupon startdate is less than current date then throw error
  if (startDateTime < currentDateTime) {
    return next(new AppError(`Start date cannot be in past!`, 400));
  }

  // If coupon startDateTime is >= coupon endDatetime, throw error
  if (endDateTime <= startDateTime) {
    return next(new AppError(`End date should be greater than start date!`));
  }

  // Creating new coupon
  const coupon = await Coupon.create({ ...otherDetails });

  // If startDate is equal to current date then change status from 'inactive' to 'active'
  if (startDateTime === currentDateTime) {
    coupon.couponStatus = "active";
  }

  // Creating couponText by passing below arguments
  const couponText = coupon.setCouponText(
    coupon.occasionName,
    coupon.couponCode,
    coupon.discount,
    coupon.startDate,
    coupon.endDate
  );

  // Storing generated couponText in couponText field
  coupon.couponText = couponText;

  // Saving all fields along with couponText to database
  await coupon.save();

  // Invalidating the valid coupon
  const cacheKey = `valid_coupon`;
  myCache.del(cacheKey);

  console.log("Deleted Valid coupon cache from createCoupon");

  res.status(201).json({
    message: "Coupon code created successfully!",
  });
});

// VALIDATE COUPON
export const validateCoupon = catchAsync(async (req, res, next) => {
  const { couponCode } = req.body;

  // Finding if coupon exists with given couponCode by user
  const isCouponExists = await Coupon.findOne({ couponCode });

  // If coupon doesn't exist, then returning error
  if (!isCouponExists) {
    return next(new AppError(`Invalid Coupon code!`, 400));
  }

  // If coupon exist, then checking whether its inactive (or) expired
  if (
    isCouponExists.couponStatus === "inactive" ||
    isCouponExists.couponStatus === "expired"
  ) {
    return next(new AppError(`Invalid Coupon code!`, 400));
  }

  // If coupon is active then send the user the below response
  res.status(200).json({
    isCouponCodeValid: true,
    discount: isCouponExists.discount,
    couponCode: isCouponExists.couponCode,
  });
});

// UPDATE COUPON (ADMIN)
export const updateCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { currentDate, ...otherDetails } = req.body;

  // Coupon start date time in milliseconds
  const startDateTime = new Date(otherDetails.startDate).getTime();

  // Coupon end date time in milliseconds
  const endDateTime = new Date(otherDetails.endDate).getTime();

  // Today's date time in milliseconds
  const currentDateTime = new Date(currentDate).getTime();

  // Finding coupon by 'id'
  const coupon = await Coupon.findById(id);

  // If coupon is not found, then returning error
  if (!coupon) {
    return next(new AppError("Coupon does not exist!", 404));
  }

  // If startdate is less than current date then throw error
  if (startDateTime < currentDateTime) {
    return next(new AppError(`Start date cannot be in past!`, 400));
  }

  // If start date is >= end date then throw error
  if (endDateTime <= startDateTime) {
    return next(
      new AppError(`End date should be greater than start date!`, 400)
    );
  }

  // Updating fields
  const updatedCoupon = await Coupon.findByIdAndUpdate(
    id,
    { ...otherDetails },
    {
      new: true,
      runValidators: true,
    }
  );

  // Updating couponText by passing below arguments
  const couponText = coupon.setCouponText(
    updatedCoupon.occasionName,
    updatedCoupon.couponCode,
    updatedCoupon.discount,
    updatedCoupon.startDate,
    updatedCoupon.endDate
  );

  // Assume that while creating coupon startDate and endDate was scheduled 2 days after, but due to some reason, starting the couponCode from today itself
  if (startDateTime === currentDateTime) {
    coupon.couponStatus = "active";
  }

  // Updating couponText field using generated couponText above
  coupon.couponText = couponText;

  // Saving all fields along with updated couponText to database
  await coupon.save();

  // Invalidating the valid coupon
  const cacheKey = `valid_coupon`;
  myCache.del(cacheKey);

  console.log("Deleted Valid coupon cache from updateCoupon");

  res.status(200).json({
    message: "Coupon code updated successfully!",
  });
});

// DELETE COUPON (ADMIN)
export const deleteCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Finding coupon by 'id' and deleting it from the database
  const deletedCoupon = await Coupon.findByIdAndDelete(id);

  // If coupon is not found then returning error to client
  if (!deletedCoupon) {
    return next(new AppError("Coupon does not exist!", 404));
  }

  // Invalidating the valid coupon
  const cacheKey = `valid_coupon`;
  myCache.del(cacheKey);

  console.log("Deleted Valid coupon cache from deleteCoupon");

  res.status(200).json({
    message: "Coupon code deleted successfully!",
  });
});
