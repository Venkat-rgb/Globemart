import { User } from "../models/User.js";
import { WishList } from "../models/WishList.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import cloudinary from "cloudinary";

// GET ALL USERS (Admin)
export const getUsers = catchAsync(async (req, res) => {
  const { page } = req.query;

  // Finding total users count who are registered in our ecommerce
  const totalUsersCount = await User.find().countDocuments();

  const users = await User.find()
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

  // Finding user based on userId
  const user = await User.findById(id);

  // Returning error when user doesn't exist
  if (!user) return next(new AppError(`User does not exist!`, 404));

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

  res.status(200).json({
    message: `User deleted successfully!`,
  });
});
