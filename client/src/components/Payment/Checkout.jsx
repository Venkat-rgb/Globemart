import MetaData from "../MetaData";
import CashOnDelivery from "./CashOnDelivery";
import OnlinePayment from "./OnlinePayment";
import ErrorBoundaryComponent from "../ErrorBoundary/ErrorBoundaryComponent";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import useSessionStorage from "../../hooks/basic/useSessionStorage";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Checkout = ({ isError }) => {
  // Keeps track of whether empty cart error is shown (or) not
  const [isCartEmptyErrorShown, setIsCartEmptyErrorShown] = useState(false);

  // Keeps track of whether empty orderInfo error is shown (or) not
  const [isOrderEmptyErrorShown, setIsOrderEmptyErrorShown] = useState(false);

  const { totalProductsCount } = useSelector((state) => state?.cart);

  const { getSessionData } = useSessionStorage();

  const orderInfo = getSessionData("orderInfo");

  // If products in cart are empty then we can't access this Checkout page
  useEffect(() => {
    // Showing error only when cart is empty and cartEmpty error is not shown yet
    if (totalProductsCount === 0 && !isCartEmptyErrorShown) {
      // Showing cart empty error
      toast.error("Please add some products to your cart first!");

      // Marking cart empty error as shown so that error will be shown only once
      setIsCartEmptyErrorShown(true);
    }
  }, [totalProductsCount, isCartEmptyErrorShown]);

  // If orderInfo is not present then we can't access this Checkout page
  useEffect(() => {
    // Showing error only when orderInfo is empty and orderInfo error is not shown yet
    if (!orderInfo && !isOrderEmptyErrorShown) {
      // Showing orderInfo empty error
      toast.error("Please enter your order information first!");

      // Marking orderInfo empty error as shown so that error will be shown only once
      setIsOrderEmptyErrorShown(true);
    }
  }, [orderInfo, isOrderEmptyErrorShown]);

  // Redirecting to /cart page only when cart is empty and cartEmpty error is shown
  if (totalProductsCount === 0 && isCartEmptyErrorShown) {
    return <Navigate to="/cart" replace={true} />;
  }

  // Redirecting to /order page only when orderInfo is empty and orderInfo error is shown
  if (!orderInfo && isOrderEmptyErrorShown) {
    return <Navigate to="/order" replace={true} />;
  }

  return (
    <div className="space-y-5 pb-10 max-[500px]:px-3">
      <MetaData title="Checkout" />
      <div>
        <p className="font-public-sans font-bold text-2xl max-[500px]:text-xl text-center drop-shadow text-neutral-500 pb-5">
          Payment Methods
        </p>

        {/* Offline Payment */}
        <ErrorBoundaryComponent errorMessage="Sorry, we're unable to process Cash on Delivery payments at the moment. Please try again later.">
          <CashOnDelivery />
        </ErrorBoundaryComponent>
      </div>

      <p className="text-center font-medium">(OR)</p>

      {/* Online Payment (Stripe) */}
      <ErrorBoundaryComponent errorMessage="Sorry, we're unable to process your payment using Stripe at the moment. Please try again later.">
        <OnlinePayment isError={isError} />
      </ErrorBoundaryComponent>
    </div>
  );
};

export default Checkout;

// import {
//   CardNumberElement,
//   CardExpiryElement,
//   CardCvcElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { PaymentElement } from "@stripe/react-stripe-js";
// import { formatCurrency } from "../utils/general/formatCurrency";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { CircularProgress } from "@mui/material";
// import toast from "react-hot-toast";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
// import EventIcon from "@mui/icons-material/Event";
// import VpnKeyIcon from "@mui/icons-material/VpnKey";
// import MetaData from "./MetaData";
// import { usePaymentIntentMutation } from "../redux/features/payment/paymentApiSlice";
// import { Navigate, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { deleteTotalCart } from "../redux/features/slices/cartSlice";
// import { useCreateOrderMutation } from "../redux/features/order/orderApiSlice";
// import { useGetCustomerAddressQuery } from "../redux/features/userAddress/userAddressApiSlice";
// import LockIcon from "@mui/icons-material/Lock";
// import { GiMoneyStack } from "react-icons/gi";
// import Loader from "./Loader";
// import Button from "./Button";

// const Checkout = () => {
//   const [isProcessing, setIsProcessing] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const stripe = useStripe();
//   const elements = useElements();

//   const [paymentIntent] = usePaymentIntentMutation();

//   const [createOrder, { isLoading: isOrderGettingCreated }] =
//     useCreateOrderMutation();

//   const orderInfo =
//     sessionStorage.getItem("orderInfo") &&
//     JSON.parse(sessionStorage.getItem("orderInfo"));

//   const { data: addressInfo } = useGetCustomerAddressQuery();

//   console.log("customer addressInfo: ", addressInfo);

//   const { totalProductsCount } = useSelector((state) => state?.cart);

//   const onlinePaymentHandler = async (e) => {
//     e.preventDefault();

//     try {
//       console.log("going to confirm payment!");

//       setIsProcessing(true);

//       const secretRes = await paymentIntent({
//         currency: orderInfo?.currency,
//         finalAmount: orderInfo?.finalTotalAmountCountrySpecific,
//         customerName: addressInfo?.address?.customer?.customerName,
//         country: addressInfo?.address?.country?.countryCode,
//         state: addressInfo?.address?.state?.stateName,
//         city: addressInfo?.address?.city,
//         line1: addressInfo?.address?.address,
//       }).unwrap();

//       if (!stripe || !elements) return;

//       const paymentRes = await stripe.confirmCardPayment(
//         secretRes?.clientSecret,
//         {
//           payment_method: {
//             card: elements.getElement(CardNumberElement),
//             billing_details: {
//               name: addressInfo?.address?.customer?.customerName,
//               address: {
//                 line1: addressInfo?.address?.address,
//                 country: addressInfo?.address?.country?.countryCode,
//                 state: addressInfo?.address?.state?.stateName,
//                 city: addressInfo?.address?.city,
//               },
//             },
//           },
//         }
//       );

//       if (paymentRes?.error) {
//         toast.error(paymentRes?.error?.message);
//       } else {
//         if (
//           paymentRes?.paymentIntent &&
//           paymentRes?.paymentIntent.status === "succeeded"
//         ) {
//           console.log("Payment successfull!");

//           // 1) Save the order in database and mark it as paid
//           const orderRes = await createOrder({
//             ...orderInfo,
//             paymentMode: "online",
//             currencyConversion: orderInfo?.currencyConversion,
//           }).unwrap();

//           console.log("Checkout orderRes: ", orderRes);

//           // 2) Remove orderInfo from sessionStorage
//           sessionStorage.removeItem("orderInfo");

//           // 3) Empty the cart
//           dispatch(deleteTotalCart());

//           // 4) Navigate to order success page
//           navigate("/order-success", { replace: true });
//         } else {
//           toast.error("There was some error while processing payment!");
//         }
//       }

//       setIsProcessing(false);
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//       navigate("/order-failure", { replace: true });
//     }
//   };

//   const offlinePaymentHandler = async () => {
//     try {
//       // (1) Update order with 'offline' payment mode and paymentStatus as false as the user chosen 'Cash on Delivery' (Its false by default).
//       const updateOrderRes = await createOrder({
//         ...orderInfo,
//         paymentMode: "offline",
//         currencyConversion: orderInfo?.currencyConversion,
//       }).unwrap();

//       console.log("updateOrderRes offline: ", updateOrderRes);

//       // (2) Delete orderInfo from session storage.
//       sessionStorage.removeItem("orderInfo");

//       // 3) Empty the cart
//       dispatch(deleteTotalCart());

//       // 4) Navigate to order success page
//       navigate("/order-success", { replace: true });
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//       navigate("/order-failure", { replace: true });
//     }
//   };

//   // if (isOrderDataLoading) {
//   //   return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
//   // }

//   // if (!orderInfo) {
//   //   // If both orderInfo and cart is empty then we navigate to cart, else we navigate to order as the cart the is not empty

//   //   if (totalProductsCount === 0) {
//   //     toast.error("Please add some products to your cart first!");
//   //     return <Navigate to="/cart" replace={true} />;
//   //   } else {
//   //     toast.error("Please enter your order information first!");
//   //     return <Navigate to="/order" replace={true} />;
//   //   }
//   // }

//   return (
//     <div className="space-y-5">
//       <MetaData title="Ecommercy | Checkout" />
//       <div>
//         <p className="font-public-sans font-bold text-2xl text-center drop-shadow text-neutral-500 pb-5">
//           Payment Methods
//         </p>
//         <motion.button
//           className="font-inter  bg-neutral-50 rounded-md py-3 px-5 font-medium w-full shadow-lg border text-neutral-700 flex items-center gap-3 justify-center"
//           whileTap={{ scale: 0.95 }}
//           type="button"
//           onClick={offlinePaymentHandler}
//           disabled={isOrderGettingCreated}
//         >
//           {isOrderGettingCreated ? (
//             <div className="flex items-center gap-3 text-neutral-500">
//               <p className="text-neutral-500">Processing</p>
//               <CircularProgress color="inherit" size={20} />
//             </div>
//           ) : (
//             <div className="flex items-center justify-center gap-3">
//               <GiMoneyStack style={{ fontSize: "1.23rem" }} />
//               <p>Cash on Delivery</p>
//             </div>
//           )}
//         </motion.button>
//       </div>
//       <p className="text-center font-medium">(OR)</p>

//       <form
//         onSubmit={onlinePaymentHandler}
//         className="space-y-8 shadow-2xl p-7 rounded bg-neutral-50"
//       >
//         <p className="font-public-sans font-bold text-2xl text-center drop-shadow text-neutral-500">
//           Stripe
//         </p>

//         <div className="space-y-5">
//           <div className="flex items-center gap-4 border py-2 px-4 drop-shadow rounded ">
//             <CreditCardIcon className="text-neutral-500" />
//             <CardNumberElement className="w-full" />
//           </div>
//           <div className="flex items-center gap-4 border py-2 px-4 drop-shadow rounded">
//             <EventIcon className="text-neutral-500" />
//             <CardExpiryElement className="w-full" />
//           </div>
//           <div className="flex items-center gap-4 border py-2 px-4 drop-shadow rounded">
//             <VpnKeyIcon className="text-neutral-500" />
//             <CardCvcElement className="w-full" />
//           </div>
//         </div>

//         {/* <motion.div whileTap={{ scale: 0.97 }} className="drop-shadow-xl">
//           <button
//             className="text-center w-full bg-indigo-700 text-neutral-300 font-medium py-2 px-4 rounded"
//             disabled={isProcessing}
//           >
//             {isProcessing ? (
//               <div className="flex items-center  justify-center gap-2">
//                 <p className="text-neutral-300/80 font-medium">Processing</p>
//                 <CircularProgress sx={{ color: "#cccccc" }} size={22} />
//               </div>
//             ) : (
//               <div className="flex items-center justify-center gap-3">
//                 <p>
//                   Pay{" "}
//                   {formatCurrency(orderInfo?.finalTotalAmountCountrySpecific)}
//                 </p>
//                 <LockIcon fontSize="small" />
//               </div>
//             )}
//           </button>
//         </motion.div> */}

//         <Button isLoading={isProcessing}>
//           {isProcessing ? (
//             <div className="flex items-center  justify-center gap-2">
//               <p className="text-neutral-300/80 font-medium">Processing</p>
//               <CircularProgress sx={{ color: "#cccccc" }} size={22} />
//             </div>
//           ) : (
//             <div className="flex items-center justify-center gap-3">
//               <p>
//                 Pay {formatCurrency(orderInfo?.finalTotalAmountCountrySpecific)}
//               </p>
//               <LockIcon fontSize="small" />
//             </div>
//           )}
//         </Button>
//       </form>
//     </div>
//   );
// };

/*
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import { formatCurrency } from "../utils/general/formatCurrency";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import MetaData from "./MetaData";
import { usePaymentIntentMutation } from "../redux/features/payment/paymentApiSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteTotalCart } from "../redux/features/slices/cartSlice";
import { useCreateOrderMutation } from "../redux/features/order/orderApiSlice";
import { useGetCustomerAddressQuery } from "../redux/features/userAddress/userAddressApiSlice";
import LockIcon from "@mui/icons-material/Lock";

const Checkout = ({ totalAmount }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stripe = useStripe();
  const elements = useElements();

  const [paymentIntent] = usePaymentIntentMutation();

  const { data: addressInfo } = useGetCustomerAddressQuery();

  const [createOrder] = useCreateOrderMutation();

  const { totalProductsCount } = useSelector((state) => state?.cart);

  const orderInfo =
    sessionStorage.getItem("orderInfo") &&
    JSON.parse(sessionStorage.getItem("orderInfo"));

  const paymentHandler = async (e) => {
    e.preventDefault();

    try {
      console.log("going to confirm payment!");

      setIsProcessing(true);

      const secretRes = await paymentIntent({
        currency: orderInfo?.currency,
        finalAmount: orderInfo?.finalTotalAmountCountrySpecific,
        customerName: addressInfo?.address?.customer?.customerName,
        country: addressInfo?.address?.country?.countryCode,
        state: addressInfo?.address?.state?.stateName,
        city: addressInfo?.address?.city,
        line1: addressInfo?.address?.address,
      }).unwrap();

      if (!stripe || !elements) return;

      const paymentRes = await stripe.confirmCardPayment(
        secretRes?.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: orderInfo?.user?.customerName,
              address: {
                line1: orderInfo?.shippingInfo?.address,
                country: orderInfo?.shippingInfo?.country?.countryCode,
                state: orderInfo?.shippingInfo?.state,
                city: orderInfo?.shippingInfo?.city,
              },
            },
          },
        }
      );

      if (paymentRes?.error) {
        toast.error(paymentRes?.error?.message);
      } else {
        if (
          paymentRes?.paymentIntent &&
          paymentRes?.paymentIntent.status === "succeeded"
        ) {
          console.log("Payment successfull!");

          // 1) Save the order in database and mark it as paid
          const orderRes = await createOrder(orderInfo).unwrap();
          console.log("orderRes: ", orderRes);

          // 2) Remove orderInfo from sessionStorage
          sessionStorage.removeItem("orderInfo");

          // 3) Empty the cart
          dispatch(deleteTotalCart());

          // 4) Navigate to order success page
          navigate("/order-success", { replace: true });
        } else {
          toast.error("There was some error while processing payment!");
        }
      }

      setIsProcessing(false);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
      navigate("/order-failure", { replace: true });
    }
  };

  // if (!orderInfo) {
  //   // If both orderInfo and cart is empty then we navigate to cart, else we navigate to order as the cart the is not empty

  //   if (totalProductsCount === 0) {
  //     toast.error("Please add some products to your cart first!");
  //     return <Navigate to="/cart" replace={true} />;
  //   } else {
  //     toast.error("Please enter your order information first!");
  //     return <Navigate to="/order" replace={true} />;
  //   }
  // }

  return (
    <div className="space-y-4">
      <MetaData title="Ecommercy | Checkout" />
      <form
        onSubmit={paymentHandler}
        className="space-y-8 shadow-2xl p-7 rounded"
      >
        <p className="font-public-sans font-bold text-2xl text-center drop-shadow text-neutral-500">
          Payment (Stripe)
        </p>

        <div className="space-y-5">
          <div className="flex items-center gap-4 border py-2 px-4 drop-shadow rounded ">
            <CreditCardIcon className="text-neutral-500" />
            <CardNumberElement className="w-full" />
          </div>
          <div className="flex items-center gap-4 border py-2 px-4 drop-shadow rounded">
            <EventIcon className="text-neutral-500" />
            <CardExpiryElement className="w-full" />
          </div>
          <div className="flex items-center gap-4 border py-2 px-4 drop-shadow rounded">
            <VpnKeyIcon className="text-neutral-500" />
            <CardCvcElement className="w-full" />
          </div>
        </div>

        <motion.div whileTap={{ scale: 0.97 }} className="drop-shadow-xl">
          <button
            className="text-center w-full bg-indigo-700 text-neutral-300 font-medium py-2 px-4 rounded"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center  justify-center gap-2">
                <p className="text-neutral-300/80 font-medium">Processing</p>
                <CircularProgress sx={{ color: "#cccccc" }} size={22} />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <p>Pay {formatCurrency(orderInfo?.finalTotalAmount)}</p>
                <LockIcon fontSize="small" />
              </div>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default Checkout;
*/
