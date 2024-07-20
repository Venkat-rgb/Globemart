import { Address } from "../models/Address.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAddress = catchAsync(async (req, res) => {
  // Getting customer address
  const address = await Address.findOne({
    "customer.customerId": req.user._id,
  });

  res.status(200).json({ address });
});

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

  res.status(200).json({ addressId: address?._id });
});
