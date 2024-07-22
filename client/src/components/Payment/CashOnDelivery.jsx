import { motion } from "framer-motion";
import { useCreateOrderMutation } from "../../redux/features/order/orderApiSlice";
import { useDispatch } from "react-redux";
import { deleteTotalCart } from "../../redux/features/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { GiMoneyStack } from "react-icons/gi";
import useSessionStorage from "../../hooks/basic/useSessionStorage";

const CashOnDelivery = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { getSessionData, removeSessionData } = useSessionStorage();

  const orderInfo = getSessionData("orderInfo");

  const [createOrder, { isLoading: isOrderGettingCreated }] =
    useCreateOrderMutation();

  // Handling offline payment (Cash on delivery)
  const offlinePaymentHandler = async () => {
    try {
      // 1) Update order with 'offline' payment mode and paymentStatus as false as the user chosen 'Cash on Delivery' (Its false by default).
      const updateOrderRes = await createOrder({
        ...orderInfo,
        paymentMode: "offline",
        currencyConversion: orderInfo?.currencyConversion,
      }).unwrap();

      // 2) Delete orderInfo from session storage.

      removeSessionData("orderInfo");

      // sessionStorage.removeItem("orderInfo");

      // 3) Empty the cart
      dispatch(deleteTotalCart());

      // 4) Navigate to order success page
      navigate("/order-success", { replace: true });
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
      navigate("/order-failure", { replace: true });
    }
  };

  return (
    <motion.button
      className="font-inter  bg-neutral-50 rounded-md py-3 px-5 font-medium w-full shadow-lg border text-neutral-700 flex items-center gap-3 justify-center"
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={offlinePaymentHandler}
      disabled={isOrderGettingCreated}
    >
      {/* Showing Loader while order is getting created  */}
      {isOrderGettingCreated ? (
        <div className="flex items-center gap-3 text-neutral-500">
          <p className="text-neutral-500">Processing</p>
          <CircularProgress color="inherit" size={20} />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-3">
          <GiMoneyStack style={{ fontSize: "1.23rem" }} />
          <p>Cash on Delivery</p>
        </div>
      )}
    </motion.button>
  );
};

export default CashOnDelivery;
