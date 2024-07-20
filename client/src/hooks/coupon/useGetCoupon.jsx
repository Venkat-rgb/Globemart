import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setCoupon,
  setCouponModal,
} from "../../redux/features/slices/couponSlice";
import { useGetValidCouponQuery } from "../../redux/features/coupons/couponApiSlice";

const useGetCoupon = () => {
  const dispatch = useDispatch();

  const { data: couponData, isError, error } = useGetValidCouponQuery();

  // Getting Coupon if present
  useEffect(() => {
    if (couponData?.coupon) {
      dispatch(
        setCoupon({
          couponId: couponData?.coupon?._id,
          couponText: couponData?.coupon?.couponText,
          couponCode: couponData?.coupon?.couponCode,
          discount: couponData?.coupon?.discount,
        })
      );
      dispatch(setCouponModal(true));
    }
  }, [couponData?.coupon, dispatch]);

  // Handling error during fetching the coupon data
  if (isError) {
    console.error("useGetCoupon error: ", error?.data?.message);
  }

  return { couponData };
};

export default useGetCoupon;
