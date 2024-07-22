import { useState } from "react";
import { useCreateOrderMutation } from "../../redux/features/order/orderApiSlice";
import { usePaymentIntentMutation } from "../../redux/features/payment/paymentApiSlice";
import { useGetCustomerAddressQuery } from "../../redux/features/userAddress/userAddressApiSlice";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { deleteTotalCart } from "../../redux/features/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import Button from "../UI/Button";
import { CircularProgress } from "@mui/material";
import { formatCurrency } from "../../utils/general/formatCurrency";
import LockIcon from "@mui/icons-material/Lock";
import Loader from "../UI/Loader";
import useSessionStorage from "../../hooks/basic/useSessionStorage";
import ErrorUI from "../UI/ErrorUI";

const OnlinePayment = ({ isError }) => {
  // Keeps track of whether payment is processing (or) not
  const [isProcessing, setIsProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetching customer address info
  const {
    data: addressInfo,
    isLoading: isAddressInfoLoading,
    isError: addressError,
  } = useGetCustomerAddressQuery();

  const [paymentIntent] = usePaymentIntentMutation();

  const [createOrder] = useCreateOrderMutation();

  const { getSessionData, removeSessionData } = useSessionStorage();

  const orderInfo = getSessionData("orderInfo");

  // Handling online payment (Stripe)
  const onlinePaymentHandler = async (e) => {
    e.preventDefault();

    try {
      setIsProcessing(true);

      // Creating the payment intent for the customer
      const secretRes = await paymentIntent({
        currency: orderInfo?.currency,
        finalAmount: orderInfo?.finalTotalAmountCountrySpecific,
        customerName: addressInfo?.address?.customer?.customerName,
        country: addressInfo?.address?.country?.countryCode,
        state: addressInfo?.address?.state?.stateName,
        city: addressInfo?.address?.city,
        line1: addressInfo?.address?.address,
      }).unwrap();

      // If stripe and elements are not loaded yet (or) undefined then return
      if (!stripe || !elements) return;

      // Confirming the card payment from the given details of the customer
      const paymentRes = await stripe.confirmCardPayment(
        secretRes?.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: addressInfo?.address?.customer?.customerName,
              address: {
                line1: addressInfo?.address?.address,
                country: addressInfo?.address?.country?.countryCode,
                state: addressInfo?.address?.state?.stateName,
                city: addressInfo?.address?.city,
              },
            },
          },
        }
      );

      // If payment was unsuccessfull (or) some issue occured
      if (paymentRes?.error) {
        toast.error(paymentRes?.error?.message);
      } else {
        // Payment is successfull
        if (
          paymentRes?.paymentIntent &&
          paymentRes?.paymentIntent?.status === "succeeded"
        ) {
          // 1) Save the order in database and mark it as paid
          const orderRes = await createOrder({
            ...orderInfo,
            paymentMode: "online",
            currencyConversion: orderInfo?.currencyConversion,
          }).unwrap();

          // 2) Remove orderInfo from sessionStorage
          removeSessionData("orderInfo");

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

  // Showing Loader when customer address, stripe, elements are loading
  if (isAddressInfoLoading || !stripe || !elements) {
    return <Loader styleProp="flex items-center justify-center h-[50vh]" />;
  }

  // Showing errorMsg, if an error occured during online stripe payment
  if (isError) {
    return (
      <ErrorUI
        message="Unable to make online payment due to some error!"
        styles="mt-32 w-1/2"
      />
    );
  }

  // Showing errMsg, if an error occured during fetching customer address
  if (addressError) {
    return (
      <ErrorUI message="Unable to get customer address due to some error!" />
    );
  }

  return (
    <form
      onSubmit={onlinePaymentHandler}
      className="space-y-8 shadow-2xl p-7 rounded bg-neutral-50"
    >
      <p className="font-public-sans font-bold text-2xl max-[500px]:text-xl text-center drop-shadow text-neutral-500">
        Stripe
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

      <Button isLoading={isProcessing} moreStyles="w-full">
        {isProcessing ? (
          <div className="flex items-center  justify-center gap-2">
            <p className="text-neutral-300/80 font-medium">Processing</p>
            <CircularProgress sx={{ color: "#cccccc" }} size={22} />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <p>
              Pay {formatCurrency(orderInfo?.finalTotalAmountCountrySpecific)}
            </p>
            <LockIcon fontSize="small" />
          </div>
        )}
      </Button>
    </form>
  );
};

export default OnlinePayment;
