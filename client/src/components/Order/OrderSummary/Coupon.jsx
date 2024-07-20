import { useState } from "react";
import { useSelector } from "react-redux";
import { useValidateCouponMutation } from "../../../redux/features/coupons/couponApiSlice";
import toast from "react-hot-toast";
import Button from "../../UI/Button";
import { CircularProgress } from "@mui/material";

const Coupon = ({ couponHandler }) => {
  // Keeps track of the coupon entered by customer
  const [coupon, setCoupon] = useState("");

  // Keeps track of whether coupon is applied (or) not
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Keeps track of details about coupon which is successfully applied
  const [couponApplied, setCouponApplied] = useState("");

  // Keeps track of about discount of coupon which is applied successfully
  const [couponAppliedDiscount, setCouponAppliedDiscount] = useState("");

  const { couponCode, discount } = useSelector((state) => state?.coupon);

  const [validateCoupon, { isLoading: isCouponValidating }] =
    useValidateCouponMutation();

  // Applying the coupon
  const couponApplyHandler = async () => {
    try {
      // Trimming the entered coupon by customer
      const trimmedCoupon = coupon?.trim();

      // If coupon is not entered then returning from this function
      if (!trimmedCoupon) return;

      // Checking the coupon whether it is valid (or) expired
      const validateCouponRes = await validateCoupon({
        couponCode: trimmedCoupon,
      }).unwrap();

      // If coupon is valid then applying it to the finalAmountToBePaid
      if (validateCouponRes?.isCouponCodeValid) {
        // Apply the coupon and update the total amount!
        setIsCouponApplied(true);

        // Setting the coupon code
        setCouponApplied(validateCouponRes?.couponCode);

        // Setting the coupon discount
        setCouponAppliedDiscount(validateCouponRes?.discount);

        // Adding the coupon discount to the finalAmountToBePaid
        couponHandler({
          role: "apply",
          discount: validateCouponRes?.discount,
          couponCode: validateCouponRes?.couponCode,
        });
      }

      // Clearing the coupon input
      setCoupon("");
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Removing the coupon from finalAmountToBePaid
  const couponRemoveHandler = () => {
    setIsCouponApplied(false);

    // Remove the coupon discount and show the orginal finalAmountToBePaid
    couponHandler({ role: "remove" });

    // Remove the coupon and discount from useState
    setCouponApplied("");

    setCouponAppliedDiscount("");
  };

  return (
    <>
      {/* Showing applied coupon details only if customer has applied valid coupon */}
      {isCouponApplied && (
        <div className="space-y-4 border-t pt-2">
          <p className="font-medium drop-shadow text-neutral-500 leading-relaxed">
            Coupon <span className="font-bold">{couponApplied}</span> applied:
            Enjoy a {couponAppliedDiscount}% discount on your order!
          </p>

          <button
            className="w-full bg-[#f1f1f1] py-2 px-3 shadow-md text-sm rounded"
            type="button"
            onClick={couponRemoveHandler}
          >
            Remove coupon
          </button>
        </div>
      )}

      {/* As coupon is not applied, showing the input box to enter coupon */}
      {!isCouponApplied && (
        <div className="flex flex-col items-start gap-2 border-t pt-2 space-y-2">
          <p className="font-medium drop-shadow text-neutral-500 leading-relaxed">
            {/* Showing message only when default couponCode is present in redux */}
            {couponCode && (
              <span>
                Use <span className="font-bold">{couponCode}</span> to get{" "}
                {discount}% off (or){" "}
              </span>
            )}
            <span>Have coupon code?</span>
          </p>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter coupon here..."
              className="outline-none border py-2 px-3 w-full rounded-tr-lg rounded-bl-lg text-sm flex-3"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />

            {/* Applying the coupon */}
            <Button
              onClick={couponApplyHandler}
              isLoading={isCouponValidating}
              moreStyles="flex-1 text-sm w-full"
            >
              {isCouponValidating ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Coupon;
