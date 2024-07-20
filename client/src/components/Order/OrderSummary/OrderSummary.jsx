import { motion } from "framer-motion";
import { formatCurrency } from "../../../utils/general/formatCurrency";
import { RiSecurePaymentLine } from "react-icons/ri";
import { CircularProgress } from "@mui/material";
import Button from "../../UI/Button";
import SummaryPrice from "./SummaryPrice";
import Coupon from "./Coupon";

const OrderSummary = ({
  totalAmount,
  shippingCharges,
  gstCharges,
  gstPercent,
  finalAmountToBePaid,
  orderSubmitHandler,
  isValidating,
  shippingDetails,
  setShippingDetails,
  setFinalAmountToBePaid,
  currencyConversion,
}) => {
  // Managing the finalAmountToBePaid based on adding and removing the coupon
  const couponHandler = (couponInfo) => {
    const { role } = couponInfo;

    // Total amount to be paid without any coupon discount
    const totalPrice = Number(
      (totalAmount + shippingCharges + gstCharges).toFixed(2)
    );

    // Adding the coupon discount to the finalAmountToBePaid
    if (role === "apply") {
      // Coupon Discount
      const couponDiscountPrice = Number(
        (finalAmountToBePaid * (couponInfo.discount / 100)).toFixed(2)
      );

      // FinalAmountToBePaid after applying the above discount
      const couponPrice = Number(
        (finalAmountToBePaid - couponDiscountPrice).toFixed(2)
      );

      // Saving the new finalAmountToBePaid after applying the coupon
      setFinalAmountToBePaid(couponPrice);

      // Updating the shippingDetails with new coupon discount
      setShippingDetails({
        ...shippingDetails,
        coupon: {
          couponCode: couponInfo.couponCode,
          couponPriceInINR: Number(
            (couponDiscountPrice * currencyConversion).toFixed(2)
          ),
        },
        finalAmount: couponPrice,
      });
    } else if (role === "remove") {
      // Removing the coupon

      // Saving the finalAmountToBePaid without any coupon
      setFinalAmountToBePaid(totalPrice);

      // Updating the shippingDetails without coupon discount
      setShippingDetails({
        ...shippingDetails,
        coupon: null,
        finalAmount: totalPrice,
      });
    }
  };

  return (
    <motion.div
      className="col-span-1 space-y-5 shadow-lg p-4 rounded-md h-[450px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 0.2 }}
    >
      <p className="font-public-sans font-semibold text-neutral-600 drop-shadow  text-center text-lg">
        Order Summary
      </p>

      {/* Subtotal Amount */}
      <SummaryPrice title="Subtotal" price={totalAmount} />

      {/* Shipping Charges */}
      <SummaryPrice title="Shipping Charges" price={shippingCharges}>
        {shippingCharges === 0 ? "FREE" : formatCurrency(shippingCharges)}
      </SummaryPrice>

      {/* GST */}
      <SummaryPrice title={`GST (${gstPercent * 100}%)`} price={gstCharges} />

      {/* Managing the coupon */}
      <Coupon couponHandler={couponHandler} />

      {/* Final amount to be paid */}
      <SummaryPrice title="Total" price={finalAmountToBePaid} />

      {/* Submitting the order */}
      <Button
        onClick={orderSubmitHandler}
        isLoading={isValidating}
        moreStyles="w-full"
      >
        {isValidating ? (
          <div className="flex items-center gap-3">
            <p className="text-[#f1f1f1]/80">Proceeding</p>
            <CircularProgress sx={{ color: "white", opacity: 0.8 }} size={20} />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <RiSecurePaymentLine
              style={{ color: "white", fontSize: "1.3rem" }}
            />
            <p className="text-[#f1f1f1]">Proceed For Payment</p>
          </div>
        )}
      </Button>
    </motion.div>
  );
};

export default OrderSummary;

// import { motion } from "framer-motion";
// import { formatCurrency } from "../../../utils/general/formatCurrency";
// import { RiSecurePaymentLine } from "react-icons/ri";
// import { CircularProgress } from "@mui/material";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import Button from "../../Button";
// import { useValidateCouponMutation } from "../../../redux/features/coupons/couponApiSlice";
// import SummaryPrice from "./SummaryPrice";
// import Coupon from "./Coupon";

// const OrderSummary = ({
//   totalAmount,
//   shippingCharges,
//   gstCharges,
//   finalAmountToBePaid,
//   orderSubmitHandler,
//   isValidating,
//   couponHandler,
// }) => {
//   // const [coupon, setCoupon] = useState("");
//   // const [isCouponApplied, setIsCouponApplied] = useState(false);
//   // const [couponApplied, setCouponApplied] = useState("");
//   // const [couponAppliedDiscount, setCouponAppliedDiscount] = useState("");

//   // const { couponCode, discount } = useSelector((state) => state?.coupon);

//   // const [validateCoupon, { isLoading: isCouponValidating }] =
//   //   useValidateCouponMutation();

//   // const couponApplyHandler = async () => {
//   //   try {
//   //     const trimmedCoupon = coupon?.trim();
//   //     if (!trimmedCoupon) return;

//   //     const validateCouponRes = await validateCoupon({
//   //       couponCode: trimmedCoupon,
//   //     }).unwrap();

//   //     console.log("validateCouponRes: ", validateCouponRes);

//   //     if (validateCouponRes?.isCouponCodeValid) {
//   //       // Apply the coupon and update the total amount!
//   //       setIsCouponApplied(true);
//   //       setCouponApplied(validateCouponRes?.couponCode);
//   //       setCouponAppliedDiscount(validateCouponRes?.discount);

//   //       couponHandler({
//   //         role: "apply",
//   //         discount: validateCouponRes?.discount,
//   //         couponCode: validateCouponRes?.couponCode,
//   //       });
//   //     }

//   //     setCoupon("");
//   //   } catch (err) {
//   //     toast.error(err?.message || err?.data?.message);
//   //   }
//   // };

//   // const couponRemoveHandler = () => {
//   //   setIsCouponApplied(false);

//   //   // Remove the coupon discount and show the orginal finalAmountToBePaid
//   //   couponHandler({ role: "remove" });

//   //   // Remove the coupon and discount from useState
//   //   setCouponApplied("");
//   //   setCouponAppliedDiscount("");
//   // };

//   return (
//     <motion.div
//       className="col-span-1 space-y-5 shadow-lg p-4 rounded-md h-[450px]"
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//     >
//       <p className="font-public-sans font-semibold text-neutral-600 drop-shadow  text-center text-lg">
//         Order Summary
//       </p>

//       <SummaryPrice title="Subtotal" price={totalAmount} />

//       <SummaryPrice title="Shipping Charges" price={shippingCharges}>
//         {shippingCharges === 0 ? "FREE" : formatCurrency(shippingCharges)}
//       </SummaryPrice>

//       <SummaryPrice title="GST" price={gstCharges} />

//       <Coupon couponHandler={couponHandler} />
//       {/* {isCouponApplied && (
//         <div className="space-y-4 border-t pt-2">
//           <p className="font-medium drop-shadow text-neutral-500 leading-relaxed">
//             Coupon <span className="font-bold">{couponApplied}</span> applied:
//             Enjoy a {couponAppliedDiscount}% discount on your order!
//           </p>

//           <button
//             className="w-full bg-[#f1f1f1] py-2 px-3 shadow-md text-sm rounded"
//             type="button"
//             onClick={couponRemoveHandler}
//           >
//             Remove coupon
//           </button>
//         </div>
//       )} */}

//       {/* {!isCouponApplied && (
//         <div className="flex flex-col items-start gap-2 border-t pt-2 space-y-2">
//           <p className="font-medium drop-shadow text-neutral-500 leading-relaxed">
//             {couponCode && (
//               <span>
//                 Use <span className="font-bold">{couponCode}</span> to get{" "}
//                 {discount}% off (or){" "}
//               </span>
//             )}
//             <span>Have coupon code?</span>
//           </p>

//           <div className="flex items-center gap-3">
//             <input
//               type="text"
//               placeholder="Enter coupon here..."
//               className="outline-none border py-2 px-3 w-full rounded-tr-lg rounded-bl-lg text-sm flex-3"
//               value={coupon}
//               onChange={(e) => setCoupon(e.target.value)}
//             />

//             <Button
//               onClick={couponApplyHandler}
//               isLoading={isCouponValidating}
//               moreStyles="flex-1 text-sm"
//             >
//               {isCouponValidating ? (
//                 <CircularProgress color="inherit" size={20} />
//               ) : (
//                 "Apply"
//               )}
//             </Button>
//           </div>
//         </div>
//       )} */}

//       <SummaryPrice title="Total" price={finalAmountToBePaid} />

//       <Button onClick={orderSubmitHandler} isLoading={isValidating}>
//         {isValidating ? (
//           <div className="flex items-center gap-3">
//             <p className="text-[#f1f1f1]/80">Proceeding</p>
//             <CircularProgress sx={{ color: "white", opacity: 0.8 }} size={20} />
//           </div>
//         ) : (
//           <div className="flex items-center gap-3">
//             <RiSecurePaymentLine
//               style={{ color: "white", fontSize: "1.3rem" }}
//             />
//             <p className="text-[#f1f1f1]">Proceed For Payment</p>
//           </div>
//         )}
//       </Button>
//     </motion.div>
//   );
// };

// export default OrderSummary;

// {
/* <button
              className="font-inter bg-indigo-600 text-[#f1f1f1] rounded-md py-2 px-5 font-medium shadow flex items-center gap-3 justify-center text-sm"
              type="button"
              onClick={couponApplyHandler}
              disabled={isCouponValidating}
            >
              {isCouponValidating ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Apply"
              )}
            </button> */
// }

// {
/* <button
        className={`bg-indigo-600 ${
          isValidating && "hover:bg-indigo-500"
        }  px-4 py-2 rounded shadow-lg transition-all duration-300 text-neutral-600 w-full flex items-center justify-center`}
        disabled={isValidating}
        onClick={orderSubmitHandler}
        type="button"
      >
        {isValidating ? (
          <div className="flex items-center gap-3">
            <p className="text-[#f1f1f1]/80">Proceeding</p>
            <CircularProgress sx={{ color: "white", opacity: 0.8 }} size={20} />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <RiSecurePaymentLine
              style={{ color: "white", fontSize: "1.3rem" }}
            />
            <p className="text-[#f1f1f1]">Proceed For Payment</p>
          </div>
        )}
      </button> */
// }
