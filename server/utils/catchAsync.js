export const catchAsync = (func) => {
  try {
    // Capturing the errors
    return (req, res, next) => {
      func(req, res, next).catch(next);
    };
  } catch (err) {
    console.log("catchAsync function error: ", err?.message);
  }
};
