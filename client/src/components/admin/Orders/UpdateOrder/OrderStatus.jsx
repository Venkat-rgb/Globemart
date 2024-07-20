import { motion } from "framer-motion";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import Lottie from "lottie-react";
import { useEffect, useRef } from "react";
import OrderSuccess from "../../../../assets/orderSuccess.json";
import OrderProcessing from "../../../../assets/orderProcessing.json";

const OrderStatus = ({ deliveryStatus, deliveredAt }) => {
  const lottieRef = useRef(null);

  // Playing animation when orderDeliveryStatus is changed
  useEffect(() => {
    lottieRef?.current.pause();
    const timer = setTimeout(() => {
      lottieRef?.current.play();
    }, 700);
    return () => {
      clearTimeout(timer);
    };
  }, [deliveryStatus]);

  return (
    <motion.div
      className="p-3 bg-neutral-50 rounded-xl h-[170px]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ delay: 0.26 }}
    >
      <div>
        <div className="flex items-center justify-between">
          <p className="text-neutral-400 font-bold font-inter tracking-tight border-b-[1px] inline-block">
            ORDER STATUS
          </p>
          <div
            style={{
              color: "green",
              backgroundColor: "rgba(0, 128, 0, 0.2)",
            }}
            className="flex-shrink-0 pb-1 px-1 rounded-lg"
          >
            <DeliveryDiningOutlinedIcon />
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {/* Displaying lottie animation based on deliveryStatus */}
            <Lottie
              animationData={
                deliveryStatus === "processing" || deliveryStatus === "shipped"
                  ? OrderProcessing
                  : OrderSuccess
              }
              lottieRef={lottieRef}
              autoPlay={false}
              loop={
                deliveryStatus === "processing" || deliveryStatus === "shipped"
                  ? true
                  : false
              }
              className="w-[120px]"
            />
          </div>

          {/* Showing orderDeliveryStatus and deliveredTime */}
          <div className="font-inter space-y-1">
            <p className="font-semibold text-lg text-neutral-700 drop-shadow-md whitespace-nowrap">
              {deliveryStatus === "processing"
                ? "Order Processing!"
                : deliveryStatus === "shipped"
                ? "Order Shipped!"
                : "Order Delivered!"}
            </p>

            {deliveredAt && (
              <p className="text-neutral-400 text-sm">
                {new Date(deliveredAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderStatus;
