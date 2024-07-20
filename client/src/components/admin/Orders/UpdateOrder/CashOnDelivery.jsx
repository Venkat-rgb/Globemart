import { useUpdatePaymentStatusMutation } from "../../../../redux/features/order/orderApiSlice";
import toast from "react-hot-toast";
import Button from "../../../UI/Button";
import { CircularProgress } from "@mui/material";

const CashOnDelivery = ({ orderId }) => {
  const [updatePaymentStatus, { isLoading: isPaymentStatusUpdating }] =
    useUpdatePaymentStatusMutation();

  // Updating paymentStatus of offline order to true
  const paymentHandler = async () => {
    try {
      const updatePaymentRes = await updatePaymentStatus(orderId).unwrap();

      // Showing payment status successfully updated message
      toast.success(updatePaymentRes?.message);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-neutral-400 font-bold border-b-[1px] font-inter uppercase inline-block">
        Process Payment
      </p>

      {/* Marks the order as paid, when admin clicks on this button */}
      <Button
        onClick={paymentHandler}
        isLoading={isPaymentStatusUpdating}
        moreStyles="w-full"
      >
        {isPaymentStatusUpdating ? (
          <div className="flex items-center justify-center gap-2">
            <p className="text-neutral-300 font-medium font-inter">Updating</p>
            <CircularProgress sx={{ color: "#cccccc" }} size={22} />
          </div>
        ) : (
          <p>Mark Order As Paid</p>
        )}
      </Button>
    </div>
  );
};

export default CashOnDelivery;
