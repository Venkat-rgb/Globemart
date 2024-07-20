import { catchAsync } from "../utils/catchAsync.js";
import { Store } from "../models/Store.js";
import { calculateDistanceInKM } from "../utils/calculateDistanceInKM.js";

export const getNearbyStores = catchAsync(async (req, res) => {
  const { latitude, longitude, category, page } = req.body;

  const locationQuery = {
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: 100000,
      },
    },
    categories: { $in: [category] },
  };

  // Finding total number of stores available
  const totalStores = await Store.find(locationQuery);

  const pageLimit = 6;

  // Get all nearby stores of given category in sorted order from nearest to farthest
  const stores = await Store.find(locationQuery)
    .limit(pageLimit)
    .skip((+page - 1) * pageLimit);

  // Storing stores in new array so that actual stores doesn't get overwritten
  let updatedStores = [...stores];

  // Calculating distance in kilometers between customer's location and store's location only if stores are present
  if (updatedStores?.length > 0) {
    updatedStores = updatedStores?.map((store) => {
      const storeLocation = store?.location?.coordinates;

      // Using Haversine formula to calculate distance in KM
      const distanceInKM = calculateDistanceInKM(
        latitude,
        longitude,
        storeLocation[1],
        storeLocation[0]
      );

      // Creating new field (distanceInKM) to schema and assigning the distance in KM
      store._doc.distanceInKM = Number(distanceInKM.toFixed(2));

      return store._doc;
    });
  }

  res
    .status(200)
    .json({ totalStores: totalStores?.length, stores: updatedStores });
});

export const createNearbyStore = catchAsync(async (req, res) => {
  // Creating the store document and storing in database
  await Store.create(req.body);

  res.status(201).json({ message: "Nearby store created successfully!" });
});
