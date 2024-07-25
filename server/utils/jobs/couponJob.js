import schedule from "node-schedule";
import { Coupon } from "../../models/Coupon.js";
import { getNumOfDaysLeft } from "../getNumOfDaysLeft.js";

// Marking all the 'inactive' coupons as 'active'
const checkInactiveCoupons = async () => {
  try {
    // Finding all the inactive coupons
    const inactiveCoupons = await Coupon.find({ couponStatus: "inactive" });

    inactiveCoupons.forEach(async (coupon) => {
      // Getting startDateTime and currentDateTime in seconds
      const startDateTime = new Date(coupon.startDate).getTime();
      const currentDateTime = new Date().getTime();

      const currentDateInISOFormat = new Date();
      // It gives the currentdate with time set to start of the day at midnight (12:00AM) in ISO format
      currentDateInISOFormat.setUTCHours(0, 0, 0, 0);

      // If currentDateTime is >= coupon startDateTime, then mark couponStatus as active
      if (currentDateTime >= startDateTime) {
        coupon.couponStatus = "active";

        // Updating the couponText with coupon startDate as currentDate
        const updatedCouponText = coupon.setCouponText(
          coupon.occasionName,
          coupon.couponCode,
          coupon.discount,
          currentDateInISOFormat.toISOString(),
          coupon.endDate
        );

        // Saving the updated couponText in couponText field
        coupon.couponText = updatedCouponText;

        // Saving updated fields in database
        await coupon.save();
      }
    });
  } catch (err) {
    console.error(
      "Error in changing status from inactive to active coupons handler: ",
      err?.message
    );
  }
};

// Checking for expiry of the active coupons
const checkActiveCoupons = async () => {
  try {
    // Getting all the active coupons
    const activeCoupons = await Coupon.find({ couponStatus: "active" });

    activeCoupons.forEach(async (coupon) => {
      // Getting coupon endDate and currentDateTime
      const endDateTime = new Date(coupon.endDate).getTime();
      const currentDateTime = new Date().getTime();

      const currentDateInISOFormat = new Date();
      // It gives the currentdate with time set to start of the day at midnight (12:00AM) in ISO format
      currentDateInISOFormat.setUTCHours(0, 0, 0, 0);

      // If currentDateTime >= endDateTime then coupon is expired
      if (currentDateTime >= endDateTime) {
        // Marking couponStatus as expired
        coupon.couponStatus = "expired";
      } else {
        // If currentDateTime < endDateTime, then it means coupon is still active
        // As coupon is active, we update the couponText with startDate as currentDate
        // We are doing this to display user the remaining days left before coupon expires
        const updatedCouponText = coupon.setCouponText(
          coupon.occasionName,
          coupon.couponCode,
          coupon.discount,
          currentDateInISOFormat.toISOString(),
          coupon.endDate
        );

        // Saving the updated couponText in couponText field
        coupon.couponText = updatedCouponText;
      }

      // Saving updated fields in database
      await coupon.save();
    });
  } catch (err) {
    console.error("Error in Expiring of coupons handler: ", err?.message);
  }
};

export const startCouponJob = () => {
  try {
    // job1 runs everyday midnight at 12:01:00 AM
    const job1 = schedule.scheduleJob("0 1 0 * * *", async () => {
      try {
        // Get Inactive coupons and make them active if currentDate is equal to coupon  startDate
        await checkInactiveCoupons();
      } catch (err) {
        console.log("Error in checking Inactive coupons Job", err?.message);
      }
    });

    // job2 runs everyday midnight at 12:01:05 AM
    const job2 = schedule.scheduleJob("5 1 0 * * *", async () => {
      try {
        // Get Active coupons and check if they are expired
        await checkActiveCoupons();
      } catch (err) {
        console.log("Error in checking Expiry coupons Job", err?.message);
      }
    });
  } catch (err) {
    console.log("startCouponJob error: ", err?.message);
  }
};
