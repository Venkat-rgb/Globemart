import { User } from "../models/User.js";
import { WishList } from "../models/WishList.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import cloudinary from "cloudinary";
import { myCache } from "../server.js";

// GET ALL USERS (Admin)
export const getUsers = catchAsync(async (req, res) => {
  const { page } = req.query;

  // Finding total users count who are registered in our ecommerce
  const totalUsersCount = await User.find().countDocuments();

  const users = await User.find()
    .select("-createdAt -updatedAt -passwordChangedAt")
    .skip(+page ? +page * 10 : 0)
    .limit(10);

  res.status(200).json({
    users,
    totalUsersCount,
  });
});

// GET USER (Admin)
export const getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let user;
  const cacheKey = `user-${id}`;

  // Check if user already exists in the cache
  if (myCache.has(cacheKey)) {
    console.log(`Cached User: ${id}`);
    user = JSON.parse(myCache.get(cacheKey));
  } else {
    // As user is not present in cache, making an API call to DB
    // Finding user based on userId
    user = await User.findById(id).select(
      "-username -email -profileImg -createdAt -updatedAt -passwordChangedAt"
    );

    // Returning error when user doesn't exist
    if (!user) return next(new AppError(`User does not exist!`, 404));

    myCache.set(cacheKey, JSON.stringify(user));
    console.log(`Getting User from DB: ${id}`);
  }

  res.status(200).json({
    user,
  });
});

// UPDATE USER (Admin)
export const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Admin can only change the role of user and not other information of user
  const { role } = req.body;

  // Updating the user role
  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );

  // if user is null then it means id is not present in database
  if (!user) return next(new AppError(`User does not exist!`, 404));

  // Deleting the user from cache
  const cacheKey = `user-${id}`;
  myCache.del(cacheKey);

  console.log(`Deleting user from cache in updateUser: ${id}`);

  res.status(200).json({
    message: `User updated successfully!`,
    user,
  });
});

// DELETE USER (Admin)
export const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  // Returning error when user doesn't exist
  if (!user) return next(new AppError(`User does not exist!`, 404));

  // Deleting User profile image if its present
  if (user?.profileImg?.public_id) {
    await cloudinary.v2.uploader.destroy(user?.profileImg?.public_id);
  }

  // Deleting User Wishlist if its present
  await WishList.findOneAndDelete({ user: id });

  // Deleting the user account
  await User.findByIdAndDelete(id);

  // Deleting the user from cache
  const cacheKey = `user-${id}`;
  myCache.del(cacheKey);
  console.log(`Deleting user from cache in deleteUser: ${id}`);

  res.status(200).json({
    message: `User deleted successfully!`,
  });
});
