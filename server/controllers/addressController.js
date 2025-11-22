import { Address } from "../models/Address.js";
import { catchAsync } from "../utils/catchAsync.js";
import { myCache } from "../server.js";
import { logger } from "../utils/logger.js";

// GET USER ADDRESS
export const getAddress = catchAsync(async (req, res, next) => {
  const cacheKey = `user_address_${req.user._id}`;

  let address;

  // Checking if the customer's address is present in the cache
  if (myCache.has(cacheKey)) {
    address = JSON.parse(myCache.get(cacheKey));
  } else {
    // Getting customer address
    address = await Address.findOne({
      "customer.customerId": req.user._id,
    });

    // Storing the customer address in cache for the future use
    myCache.set(cacheKey, JSON.stringify(address));
  }

  res.status(200).json({ address });
});

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

  logger.info(
    `Deleted User_${req.user._id} address cache from createOrUpdateAddress`
  );

  res.status(200).json({ addressId: address?._id });
});
