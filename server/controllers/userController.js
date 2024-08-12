import { BlacklistToken } from "../models/BlacklistToken.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";

// Get Logged in user
export const getUser = catchAsync(async (req, res) => {
  const { username, email, createdAt } = req.user;
  const reqFields = { username, email, createdAt };

  // Checking if profileImg exists
  if (Object.keys(req.user.profileImg).length > 0) {
    // Creating new property profileImg in reqFields and setting the profileImg url
    reqFields["profileImg"] = req.user.profileImg.url;
  }

  // Sending only the reqFields object, and not all details to the client
  res.status(200).json({
    user: reqFields,
    // check whether is sending passwordChangedAt, passwordResetToken, passwordResetTokenExpires to client is needed.
  });
});

// Update logged in user
export const updateUser = catchAsync(async (req, res) => {
  // only fields that user can update.
  const requiredFields = ["username", "email"];

  // storing fields from req.body which match requiredFields.
  const newReqObj = {};

  for (const item in req.body) {
    if (requiredFields.includes(item) && req.body[item]) {
      newReqObj[item] = req.body[item];
    }
  }

  // while testing in postman if we pass fields role and password then newReqObj will be empty and this empty object is passed into findByIdAndUpdate method which returns the same previous document without any change.

  const user = await User.findByIdAndUpdate(req.user._id, newReqObj, {
    new: true,
    runValidators: true,
  });

  /*
     -> In verifyToken middleware we checked if user was deleted but still token is valid and we deleted that user if he is not present in database.
     -> But if we didnt perform that check and if we didnt stop that user from giving authorization then here in above findByIdAndUpdate method user will be null as mongodb cant find.
     -> so here when we performed that check and removed user from database then we dont need the below check otherwise we need to perform a check:
     Check:
     if(!user) return next(new AppError('Invalid Id!',400));
  */

  /*
    -> Above we are setting runValidators: true, bcz if we dont set runValidators property then if req.body[item] is username and if its value is "  " then we update username with "" which is not correct.
    -> so runValidators: true, will run validators for all fields in the userSchema.
  */

  // Here we upload profileImg to cloudinary if its exists in req.body.profileImg
  let imgRes = {};

  // Updating image by uploading new image and deleting the existing image in cloudinary
  if (req.body.profileImg && user?.profileImg?.public_id) {
    imgRes = await cloudinary.v2.uploader.upload(req.body.profileImg, {
      public_id: user.profileImg.public_id,
      overwrite: true,
      invalidate: true,
    });

    // Storing the new updated image details from cloudinary
    user.profileImg = {
      public_id: imgRes?.public_id,
      url: imgRes?.secure_url,
    };

    // Saving the updated user to DB
    await user.save();
  } else if (req.body.profileImg) {
    // Uploading new proflie image for user, as the profileImg doesn't exist

    imgRes = await cloudinary.v2.uploader.upload(req.body.profileImg, {
      folder: "avatars",
    });

    // Storing the new updated image details from cloudinary
    user.profileImg = {
      public_id: imgRes?.public_id,
      url: imgRes?.secure_url,
    };

    // Saving the updated user to DB
    await user.save();
  }

  res.status(200).json({
    message: `User updated successfully!`,
  });
});

// Update password of logged in user
export const updateMyPassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword, confirmNewPassword, token } = req.body;
  const { refreshToken } = req.cookies;

  const trimmedOldPassword = oldPassword?.trim();
  const trimmedNewPassword = newPassword?.trim();
  const trimmedConfirmNewPassword = confirmNewPassword?.trim();

  if (!oldPassword || !trimmedOldPassword) {
    return next(new AppError(`Please enter the old password!`, 400));
  }

  if (!newPassword || !trimmedNewPassword) {
    return next(new AppError(`Please enter the new password!`, 400));
  }

  if (!confirmNewPassword || !trimmedConfirmNewPassword) {
    return next(new AppError(`Please confirm the new password!`, 400));
  }

  if (!refreshToken || !token) {
    return res.status(204);
  }

  // Finding the user with password field included
  const user = await User.findById(req.user._id).select(
    "+password -username -email -createdAt -updatedAt -profileImg"
  );

  // checking if old password is matching the password present in database
  const isPasswordsMatching = await user.checkPassword(
    trimmedOldPassword,
    user.password
  );

  // Returning error if passwords are not matching
  if (!isPasswordsMatching) {
    return next(new AppError(`Please enter old password correctly!`, 400));
  }

  // as old password is matching now we are checking whether newPassword and confirmNewPassword are matching
  if (trimmedNewPassword !== trimmedConfirmNewPassword) {
    return next(
      new AppError(`New password and Confirm password does not match!`, 400)
    );
  }

  // as newPassword and confirmNewPassword are matching saving them to database.
  user.password = trimmedNewPassword;
  user.passwordConfirm = trimmedConfirmNewPassword;

  await user.validate();

  await user.save();

  // Making sure that user is logged out, so that they can login using new password
  // Getting the remaining expiration time of accessToken while user logging out
  const remainingExpirationTime =
    jwt.verify(token, process.env.JWT_SECRET)?.exp * 1000;

  // Storing this accessToken with remaning expiration time in BlacklistToken collection, inorder to prevent hackers
  await BlacklistToken.create({
    token,
    expiresAt: remainingExpirationTime,
  });

  // Clearing the cookie as the user is logged out
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    expires: new Date(0),
    // should include secure: true for https and also sameSite: 'none' for cross-site cookie access.
    // Make sure to include expires like above, inorder to delete the cookie successfully, instead of leaving empty cookie without any value
  });

  res.status(200).json({
    message: `Password changed successfully!`,
  });
});
