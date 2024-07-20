import { AppError } from "./appError.js";

export const sendToken = async (res, statusCode, user, message, next) => {
  // Creating jsonwebtoken in userSchema methods.
  try {
    // Generating new JWT accessToken
    const accessToken = user.getJWTToken();

    // Generating new JWT refreshToken
    const refreshToken = user.getRefreshToken();

    // Storing the refreshToken in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
    });

    // Sending the accessToken to the client
    res.status(statusCode).json({
      message,
      accessToken,
      profileImg: user?.profileImg?.url,
    });
  } catch (err) {
    return next(new AppError(err?.message, 400));
  }
};
