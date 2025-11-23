import { BlacklistToken } from "../models/BlacklistToken.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";
import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";
import { WishList } from "../models/WishList.js";
import { myCache } from "../server.js";
import { Conversation } from "../models/Conversation.js";
import { Review } from "../models/Review.js";

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

  // Here we upload profileImg to cloudinary if its exists in req.files.profileImg
  let imgRes = {};

  if (req.files && req.files?.profileImg.data) {
    const base64Image = `data:${
      req.files.profileImg.mimetype
    };base64,${req.files.profileImg.data.toString("base64")}`;

    // Updating image by uploading new image and deleting the existing image in cloudinary
    if (user?.profileImg?.public_id) {
      imgRes = await cloudinary.v2.uploader.upload(base64Image, {
        public_id: user.profileImg.public_id,
        overwrite: true,
        invalidate: true,
      });
    } else {
      // Uploading new proflie image for user, as the profileImg doesn't exist
      imgRes = await cloudinary.v2.uploader.upload(base64Image, {
        folder: "avatars",
      });
    }

    // Storing the updated image details from cloudinary
    user.profileImg = {
      public_id: imgRes?.public_id,
      url: imgRes?.secure_url,
    };

    // Saving the updated user to DB
    await user.save();

    logger.info(`Updated User_${req.user._id} profile images`);
  }

  logger.info(`Updated User_${req.user._id} profile successfully`);

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

  // Checking if old and new password is satisfying the conditions
  if (!oldPassword || !trimmedOldPassword) {
    return next(new AppError(`Please enter the old password!`, 400));
  }

  if (!newPassword || !trimmedNewPassword) {
    return next(new AppError(`Please enter the new password!`, 400));
  }

  if (!confirmNewPassword || !trimmedConfirmNewPassword) {
    return next(new AppError(`Please confirm the new password!`, 400));
  }

  // Returning No content if refreshToken (or) accessToken is not present
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

  logger.info(`User_${req.user._id} password changed successfully`);

  // Making sure that user is logged out, so that they can login using new password
  // Getting the remaining expiration time of accessToken while user logging out
  const remainingExpirationTime =
    jwt.verify(token, process.env.JWT_SECRET)?.exp * 1000;

  // Storing this accessToken with remaning expiration time in BlacklistToken collection, inorder to prevent hackers
  await BlacklistToken.create({
    token,
    expiresAt: remainingExpirationTime,
  });

  logger.info(
    `Blacklisting the User_${req.user._id} JWT to re-login as password changed`
  );

  // Clearing the cookie as the user is logged out
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    expires: new Date(0),
    // should include secure: true for https and also sameSite: 'none' for cross-site cookie access.
    // Make sure to include expires like above, inorder to delete the cookie successfully, instead of leaving empty cookie without any value
  });

  logger.info(
    `Clearing the refreshToken cookie to re-login the User_${req.user._id}`
  );

  res.status(200).json({
    message: `Password changed successfully!`,
  });
});

// Deletes user account
export const deleteUserAccount = catchAsync(async (req, res, next) => {
  const userId = (req.params.id || req.user._id).toString();

  // Admin account can't be deleted
  if (req.user._id.toString() === userId && req.user.role === "admin") {
    return next(new AppError(`Admin account cannot be deleted`, 403));
  }

  const user = await User.findById(userId);

  // Checks if user exists
  // If user is deleting, then this check is already done in verifyToken
  // But if admin is deleting, then this check is needed
  if (!user) {
    return next(new AppError(`User not found!`, 404));
  }

  // 1) Delete the profile image of user
  const publicId = user?.profileImg?.public_id;
  const deleteProfileImgFromCloudinary = publicId
    ? cloudinary.v2.uploader.destroy(publicId, { invalidate: true })
    : Promise.resolve();

  // 2) Make the customerProfileImg to null in Review model
  const deleteUserReviewImg = Review.updateMany(
    {
      "user.customerId": userId,
    },
    {
      $set: { "user.customerProfileImg": null },
    }
  );

  // 3) Delete the user wishlist
  const deleteWishlist = WishList.findOneAndDelete({
    user: userId,
  });

  // 4) Delete the user cache
  const keysToBeDeleted = [
    `user_address_${userId}`,
    `user_${userId}`,
    `user_orders_${userId}`,
    `user_wishlist_${userId}`,
    "product_reviews",
  ];

  const filteredKeys = myCache.keys().filter((key) => {
    return keysToBeDeleted.some((prefix) => key.startsWith(prefix));
  });

  myCache.del(filteredKeys);

  // 5) Delete the user's refreshToken cookie (only user can delete his cookie)
  if (req.user._id.toString() === userId) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0),
      // should include secure: true for https and also sameSite: 'none' for cross-site cookie access.
    });
  }

  // 6) Delete the user's AI customer support chat and messages
  const deleteAIChat = Conversation.findOneAndDelete({
    userId,
  });

  // 7) Finding user chat
  const chat = await Chat.findOne({
    usersInChat: {
      $in: [userId],
    },
  });

  // If chat doesn't exist for this user, then delete the above operations parallelly
  if (!chat) {
    await Promise.all([
      deleteProfileImgFromCloudinary,
      deleteUserReviewImg,
      deleteWishlist,
      deleteAIChat,
    ]);
  } else {
    // Chat exists, so delete (above operations + chat messages) parallelly
    // Deleting the user chat and messages in this chat
    const deleteChat = Chat.findByIdAndDelete(chat._id);
    const deleteChatMessages = Message.deleteMany({
      chat: chat._id,
    });

    await Promise.all([
      deleteProfileImgFromCloudinary,
      deleteUserReviewImg,
      deleteWishlist,
      deleteAIChat,
      deleteChat,
      deleteChatMessages,
    ]);
  }

  // 8) Delete the user info
  await User.findByIdAndDelete(userId);

  // 9) logger.info
  logger.info(`User_${userId} account deleted successfully`);

  // 10) Send message that account is deleted successfully
  res.status(200).json({
    message: `User account deleted successfully`,
  });
});
