// Showing detailed error to developers in development mode
const sendDevelopmentError = (res, err) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};

// Showing only error to user and hiding details in production mode
const sendProductionError = (res, err) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export const errorMiddleware = (err, req, res, next) => {
  try {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    // Mongoose Validation Error.
    if (err?.name === "ValidationError") {
      err.message = Object.values(err.errors)
        .map((item) =>
          item.message.includes("Cast") || item.message.includes("BSONError")
            ? `Invalid ${item.path} Id!`
            : item.message
        )
        .join(" | ");
      err.statusCode = 400;
    }

    // Duplicate field error.
    if (err?.code === 11000) {
      const fieldType = Object.keys(err.keyValue)[0];

      err.message = `${fieldType} already exists! Please enter new ${fieldType}`;
      err.statusCode = 400;
    }

    // Cast Error.
    if (err?.name === "CastError") {
      err.message = `Invalid ${err.path}`;
      err.statusCode = 400;
    }

    // jsonwebtoken invalid error.
    if (err?.name === "JsonWebTokenError") {
      err.message = `Token is Invalid, Try Again!`;
      err.statusCode = 401;
    }

    // jsonwebtoken expired error.
    if (err?.name === "TokenExpiredError") {
      err.message = `Token is Expired, Please login again!`;
      err.statusCode = 401;
    }

    // Sending appropriate error based on mode which our application is on
    if (process.env.NODE_ENV === "development") {
      sendDevelopmentError(res, err);
    } else if (process.env.NODE_ENV === "production") {
      sendProductionError(res, err);
    }
  } catch (err) {
    console.log("errorMiddleware error: ", err?.message);
  }
};
