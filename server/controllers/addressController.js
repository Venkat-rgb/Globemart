import { Address } from "../models/Address.js";
import { catchAsync } from "../utils/catchAsync.js";
import { myCache } from "../server.js";
import { AppError } from "../utils/appError.js";

// GET USER ADDRESS
export const getAddress = catchAsync(async (req, res, next) => {
  const cacheKey = `user_address_${req.user._id}`;

  let address;

  // Checking if the customer's address is present in the cache
  if (myCache.has(cacheKey)) {
    address = JSON.parse(myCache.get(cacheKey));
    console.log("Cached User Address!");
  } else {
    // Getting customer address
    address = await Address.findOne({
      "customer.customerId": req.user._id,
    });

    // Sending error if address is not present
    if (!address) {
      return next(new AppError(`User address not found!`, 404));
    }

    myCache.set(cacheKey, JSON.stringify(address));

    console.log("User Address from DB!");
  }

  res.status(200).json({ address });
});

// export const getAddress = catchAsync(async (req, res) => {
//   // Getting customer address
//   const address = await Address.findOne({
//     "customer.customerId": req.user._id,
//   });

//   res.status(200).json({ address });
// });

// CREATE (OR) UPDATE USER ADDRESS
export const createOrUpdateAddress = catchAsync(async (req, res) => {
  // Getting customer address
  const doesAddressExists = await Address.findOne({
    "customer.customerId": req.user._id,
  });

  let address = "";

  // As address doesn't exist for customer we create one
  if (!doesAddressExists) {
    address = await Address.create(req.body);
  } else {
    // Address already exists so we update with new details
    address = await Address.findByIdAndUpdate(
      doesAddressExists?._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // Deleting the user address cache
  const cacheKey = `user_address_${req.user._id}`;
  myCache.del(cacheKey);

  console.log("Deleted User Address cache from createOrUpdateAddress");

  res.status(200).json({ addressId: address?._id });
});
