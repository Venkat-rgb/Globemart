import { AppError } from "../utils/appError.js";

export const imageLimitMiddleware = (req, res, next) => {
  try {
    // If no files are provided
    if (!req.files) {
      return next();
    }

    let images;

    if (req.files?.images) {
      // Product images
      images = req.files.images;
    } else if (req.files?.profileImg) {
      // User profile image
      images = req.files.profileImg;
    } else {
      // No images or profileImg field found, skip validation
      return next();
    }

    // Limiting the image size to 10MB
    const imageSizeLimit = 10 * 1024 * 1024;

    // Only allowing these image types
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    // Handles when there is only single image
    if (!Array.isArray(images)) {
      images = [images];
    }

    // Checking for valid image type and size
    for (let i = 0; i < images.length; ++i) {
      if (!allowedTypes.includes(images[i].mimetype)) {
        return next(
          new AppError(
            `File "${images[i].name}" has invalid format. Only JPEG, PNG, and WEBP images are allowed.`,
            400
          )
        );
      }

      if (images[i].size > imageSizeLimit) {
        return next(
          new AppError(`File "${images[i].name}" exceeds 10MB limit`, 413)
        );
      }
    }

    // As every image has correct type and correct size
    next();
  } catch (err) {
    console.log("imageLimitMiddleware error: ", err?.message);
    next(new AppError("Error validating images", 500));
  }
};
