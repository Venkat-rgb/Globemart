import { motion } from "framer-motion";
import CashOnDelivery from "./CashOnDelivery";
import { useEffect, useState } from "react";
import { useUpdateOrderMutation } from "../../../../redux/features/order/orderApiSlice";
import lodash from "lodash";
import toast from "react-hot-toast";
import InputDivStyle from "../../../../components/UI/InputDivStyle";
import RouteIcon from "@mui/icons-material/Route";
import Button from "../../../UI/Button";
import { CircularProgress } from "@mui/material";

const UpdateOrderStatus = ({ orderId, orderData, orderDeliveryStatus }) => {
  // Keeping track of orderStatus till now
  const [orderStatus, setOrderStatus] = useState("");

  const [updateOrder, { isLoading: isOrderUpdating }] =
    useUpdateOrderMutation();

  // Making an api request to update orderStatus
  const updateOrderStatusHandler = async (e) => {
    e.preventDefault();

    if (!orderStatus.trim()) return;

    try {
      // Making an API request only when orderStatus changed
      if (!lodash.isEqual(orderDeliveryStatus, orderStatus)) {
        const updateOrderRes = await updateOrder({
          id: orderId,
          deliveryStatus: orderStatus,
        }).unwrap();

        // Showing order updated successfully message
        toast.success(updateOrderRes?.message);
      }
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  useEffect(() => {
    // Updating the orderStatus when its updated
    if (orderDeliveryStatus) {
      setOrderStatus(orderDeliveryStatus);
    }
  }, [orderDeliveryStatus]);

  return (
    <motion.div
      className="bg-neutral-50 p-3 max-[500px]:mb-10 drop-shadow-lg rounded-xl col-span-2 max-[880px]:col-span-4 space-y-5 max-h-72"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ delay: 0.5 }}
    >
      {/* Showing MarkOrderAsPaid button only when payment is not paid & payment mode is offline  */}
      {!orderData?.paymentInfo?.paymentStatus &&
        orderData?.paymentInfo?.paymentMode === "offline" && (
          <CashOnDelivery orderId={orderId} />
        )}

      <p className="text-neutral-400 font-bold border-b-[1px] inline-block font-inter uppercase">
        Process Order
      </p>

      <form
        onSubmit={updateOrderStatusHandler}
        className="font-public-sans w-full space-y-4"
      >
        {/* OrderStatus options */}
        <InputDivStyle>
          <RouteIcon className="text-neutral-400" />
          <select
            onChange={(e) => setOrderStatus(e.target.value)}
            className="outline-none w-full px-3"
            value={orderStatus}
          >
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>

            {orderData?.paymentInfo?.paymentStatus && (
              <option value="delivered">Delivered</option>
            )}
          </select>
        </InputDivStyle>

        {/* Displaying loader while orderStatus is being updated */}
        <Button isLoading={isOrderUpdating} moreStyles="w-full">
          {isOrderUpdating ? (
            <div className="flex items-center justify-center gap-2">
              <p className="text-neutral-300 font-medium font-inter">
                Updating
              </p>
              <CircularProgress sx={{ color: "#cccccc" }} size={22} />
            </div>
          ) : (
            <p>Update Status</p>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default UpdateOrderStatus;
