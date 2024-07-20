import { motion } from "framer-motion";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddressTag from "./AddressTag";

const Payment = ({
  paymentStatus,
  amountPaid,
  amountPaidAt,
  paymentMode,
  subTotalAmount,
  shippingAmount,
  GST,
  coupon,
}) => {
  return (
    <motion.div
      className="p-3 bg-neutral-50 rounded-xl font-inter space-y-3 h-[170px] overflow-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ delay: 0.13 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-neutral-400 font-bold font-inter tracking-tight border-b-[1px] inline-block">
          PAYMENT
        </p>
        <div
          style={{
            color: "goldenrod",
            backgroundColor: "rgba(218, 165, 32, 0.2)",
          }}
          className="flex-shrink-0 pb-1 px-1 rounded-lg"
        >
          <PaidOutlinedIcon />
        </div>
      </div>
      <p>
        <span className="text-neutral-500 font-semibold">Status :</span>
        <span
          className={`ml-3 text-sm ${
            paymentStatus === "Paid"
              ? "text-green-600 bg-green-100"
              : "text-red-400 bg-red-100"
          }  px-2 py-1 rounded-md uppercase`}
        >
          {paymentStatus === "Paid" ? (
            <CheckCircleIcon sx={{ fontSize: "1rem" }} />
          ) : (
            <CancelIcon sx={{ fontSize: "1rem" }} />
          )}
          <span className="ml-1 font-semibold text-xs">{paymentStatus}</span>
        </span>
      </p>

      <AddressTag
        title="Subtotal Amount"
        value={`₹${subTotalAmount?.toLocaleString()} (+)`}
      />

      <AddressTag
        title="Shipping Charges"
        value={`₹${shippingAmount?.toLocaleString()} (+)`}
      />

      <AddressTag title="GST" value={`₹${GST?.toLocaleString()} (+)`} />

      {coupon && (
        <AddressTag
          title="Coupon Discount"
          value={`₹${coupon?.couponPriceInINR?.toLocaleString()} (-)`}
        />
      )}

      <AddressTag
        title={`${
          paymentStatus === "Not Paid" ? "Amount To Be Paid" : "Amount Paid"
        }`}
        value={`₹${amountPaid?.toLocaleString()}`}
      />

      {paymentStatus === "Paid" && (
        <AddressTag
          title="Amount Paid on"
          value={new Date(amountPaidAt)?.toLocaleString()}
        />
      )}

      <AddressTag
        title="Payment Mode"
        value={`${
          paymentMode === "online"
            ? "Stripe (Online)"
            : "Cash on Delivery (Offline)"
        }`}
      />
    </motion.div>
  );
};

export default Payment;
