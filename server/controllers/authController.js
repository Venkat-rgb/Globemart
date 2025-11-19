import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import { User } from "../models/User.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import { BlacklistToken } from "../models/BlacklistToken.js";
import { logger } from "../utils/logger.js";

// REGISTER USER
export const registerUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Registering new user
  const user = await User.create({
    username,
    email,
    password,
  });

  /*
    -> Here we may get doubt that why cant we add this if condition above User.create(). the reason is bcz if there are any validation errors then still image will be saved to cloudinary. so this should not happen. so when there are no validation errors then only we upload the image to cloudinary.
  */

  if (req.files && req.files?.profileImg.data) {
    const base64Image = `data:${
      req.files.profileImg.mimetype
    };base64,${req.files.profileImg.data.toString("base64")}`;

    const imgRes = await cloudinary.v2.uploader.upload(base64Image, {
      folder: "avatars",
    });

    // Storing image info from cloudinary in profileImg property of the user model
    user.profileImg = {
      public_id: imgRes?.public_id,
      url: imgRes?.secure_url,
    };

    // Saving updated user model to DB
    await user.save();
    logger.info(
      `User_${user?._id} profile image stored during registration successfully`
    );
  }

  // Creating JSON web token and cookie and returning to the client.
  sendToken(
    res,
    201,
    user,
    `User registered Successfully, Welcome ${user?.username}!`,
    `User_${user?._id} registed Successfully`,
    next
  );
});

// LOGIN USER
export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // If user is not passing email or password in req.body then we are displaying error.
  if (!email || !password) {
    return next(new AppError(`Please enter Email and Password!`, 400));
  }

  // if user passed both email and password but they are empty then also we are displaying error
  if (email?.trim() === "" || password?.trim() === "") {
    return next(new AppError(`Please enter Email and Password!`, 400));
  }

  // Here we have email and password.
  // now checking if user exists in database.
  const isUserExists = await User.findOne({ email }).select("+password");

  if (!isUserExists) {
    return next(new AppError(`Invalid email (or) password!`, 400));
  }

  // Checking if passwords match.
  const isPasswordMatched = await isUserExists.checkPassword(
    password,
    isUserExists.password
  );

  if (!isPasswordMatched) {
    return next(new AppError(`Invalid email (or) password!`, 400));
  }

  // here passwords match so we return the create token, cookie and return.
  sendToken(
    res,
    200,
    isUserExists,
    `Welcome ${isUserExists.username}!`,
    `User_${isUserExists?._id} logged in successfully`,
    next
  );
});

// LOGOUT USER
export const logoutUser = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const authHeader = req.headers.authorization;
  const accessToken = authHeader.split(" ")[1];

  if (!refreshToken || !accessToken) return res.status(204).end();

  // Getting the remaining expiration time of accessToken while user logging out
  const remainingExpirationTime =
    jwt.verify(accessToken, process.env.JWT_SECRET)?.exp * 1000;

  // Storing this accessToken with remaning expiration time in BlacklistToken collection, inorder to prevent hackers
  await BlacklistToken.create({
    token: accessToken,
    expiresAt: remainingExpirationTime,
  });

  logger.info(`User_${req.user._id} JWT has been blacklisted due to logout`);

  // Clearing the cookie as the user is logged out
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
    // should include secure: true for https and also sameSite: 'none' for cross-site cookie access.
  });

  logger.info(
    `Clearing refreshToken cookie of User_${req.user._id} due to logout`
  );
  logger.info(`User_${req.user._id} logged out successfully`);

  res.status(200).json({
    message: "User has successfully logged out!",
  });
});

// FORGOT PASSWORD
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // 1) Find if user exists in database.
  const trimmedEmail = email?.trim();

  if (!email || !trimmedEmail) {
    return next(new AppError(`Please enter an email!`, 400));
  }

  // here email may be "   email@gmail.com  ", but as we are using trim: true in email field in mongoose schema, so spaces will be removed while searching for email@gmail.com
  // here we may get doubt that what if someone knows our email and enteres the email. but we dont have to worry because they cant see our mail as they dont know our gmail password.
  const user = await User.findOne({ email });

  if (!user) return next(new AppError(`Email does not exist!`, 404));

  // 2) Generate a random reset token.
  const resetToken = user.createPasswordResetToken();

  /*
    -> here if we dont set validateBeforeSave: false, then we get errors bcz as we are saving the document, automatically all the validators are runned and we need to pass all the fields which are mentioned as required in mongoose schema, otherwise we get errors.
    -> so to not run the validators automatically we set validateBeforeSave: false.
  */
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL_1}/password/reset/${resetToken}`;

  const emailMessage = `Your password reset token is: \n\n ${resetPasswordUrl} \n\n Validity of token is ${process.env.RESET_TOKEN_EXPIRES} minutes. \n\n If you have not requested this email then, please ignore it.`;

  const emailSubject = `Globemart - Online store`;

  // Sending reset password mail to the user's mail address
  await sendEmail({
    emailMessage,
    trimmedEmail,
    emailSubject,
  });

  logger.info(
    `ForgotPassword mail sent to User_${user?._id} email: ${trimmedEmail}`
  );

  res.status(200).json({
    // user,
    message: `Email sent to ${trimmedEmail} successfully!`,
  });
});

// RESET PASSWORD
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !password?.trim()) {
    return next(new AppError(`Please enter the password!`, 400));
  }

  if (!confirmPassword || !confirmPassword?.trim()) {
    return next(new AppError("Please enter confirm password!", 400));
  }

  // 1) Get the user from the database based on the token

  // to compare the token with token in database, we are 1st encrypting the token received from req.params
  const encryptToken = crypto.createHash("sha256").update(token).digest("hex");

  // now searching the token and also its expiry. so basically the below code finds the document which has passwordResetToken same as encryptToken and also unexpired resetToken.
  const user = await User.findOne({
    passwordResetToken: encryptToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError(`Reset Token is invalid (or) expired!`, 400));
  }

  // 2) As token is valid, lets set the new password
  if (password?.trim() !== confirmPassword?.trim()) {
    return next(new AppError(`Passwords does not match!`, 400));
  }

  // Storing the updated password
  user.password = password;
  user.passwordConfirm = confirmPassword;

  // now as there is no use of below 2 properties to be left with old resetToken and their expiry, we remove those properties from the user document by assigning them to undefined.
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  // Validating the updated user model
  await user.validate();

  // Saving the updated user model
  await user.save();

  // 3) Now setting the passwordChangedAt property. so we did this in pre('save') middleware

  logger.info(`User_${user?._id} password changed successfully`);

  // 4) Now send new jwt and Login the user as the password is changed.
  res.status(200).json({
    message: "Password changed successfully!",
  });
});

// REFRESH TOKEN TO GET NEW ACCESSTOKEN
export const newAccessToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(204).end();
  }

  // checking whether refresh token is valid (or) expired.
  const isRefreshTokenValid = jwt.verify(
    refreshToken,
    process.env.REFRESH_SECRET
  );

  // Here refresh token is valid
  // Before generating the new accessToken, we are checking whether the user who is requesting the new accessToken even exists for security reasons.
  const isUserExists = await User.findById(isRefreshTokenValid.id);

  if (!isUserExists) return next(new AppError(`User doesn't exists!`, 404));

  // As user exists, we are generating new accessToken
  const accessToken = isUserExists.getJWTToken();

  res.status(200).json({
    accessToken,
  });
});
