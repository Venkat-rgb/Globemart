import { BlacklistToken } from "../models/BlacklistToken.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";

export const verifyToken = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // if authorization header is not set then we return header as there is no accessToken in header.
  if (!authHeader) return next(new AppError(`Please Login First!`, 401));

  const accessToken = authHeader.split(" ")[1];

  // Checking if accessToken is valid.
  const isTokenValid = jwt.verify(accessToken, process.env.JWT_SECRET);

  // if we came till here it means that user is present with valid accessToken.
  // Now check if token is invalidated (or) Blacklisted
  const isTokenInvalidated = await BlacklistToken.findOne({
    token: accessToken,
  });

  // If token is invalidated then not allowing user to access any API.
  if (isTokenInvalidated) {
    return next(new AppError(`Token is invalidated, please login again!`, 403));
  }

  // now there may be case where user is deleted from database but the token is still valid. so we should not give access.
  const user = await User.findById(isTokenValid.id);

  // Sending error if the user doesn't exists
  if (!user) {
    return next(
      new AppError(
        `The user belonging to this token does no longer exist!`,
        404
      )
    );
  }

  /*
    -> now lets check whether the user changed his password after jwt was issued.
    Why are we implementing this below functionality?
    -> assume that user has changed his password after jwt was issued.
    -> now when user requests a resource from server which requires user verification whether he is logged in. so if jwt is verified then user can access the resource.
    -> but here the problem is that user should be prompted to login again as he changed the password.
  */

  const isPasswordChangedAfterJWT = user.checkPasswordChangedAfterJWTIssued(
    isTokenValid.iat
  );

  if (isPasswordChangedAfterJWT) {
    return next(
      new AppError(`Please login again as the password is changed!`, 401)
    );
  }

  // as token is valid we are are creating user property on req object.
  req.user = await User.findById(isTokenValid.id);

  next();
});

export const restrictTo = (...roles) => {
  try {
    return (req, res, next) => {
      // Returning error if user doesn't have permission to access particular route
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError(
            `You don't have permission to perform restricted actions!`,
            403
          )
        );
      }

      next();
    };
  } catch (err) {
    console.log("restrictTo middleware error: ", err?.message);
  }
};
