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
