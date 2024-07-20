import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useGetStripeKeyQuery } from "../redux/features/payment/paymentApiSlice";
import Checkout from "../components/Payment/Checkout";

const Payment = () => {
  // Keeps track of stripeApiKey
  const [stripeKeyPromise, setStripeKeyPromise] = useState("");

  // Fetching stripeApiKey Info
  const { data: stripeApiKey, isError } = useGetStripeKeyQuery();

  // Storing stripeApiKey in state if stripeApiKey exist
  useEffect(() => {
    if (stripeApiKey?.stripeKey) {
      setStripeKeyPromise(stripeApiKey.stripeKey);
    }
  }, [stripeApiKey?.stripeKey]);

  return (
    <div className="pt-24 font-inter max-w-md mx-auto">
      {/* loading stripe when stripeApiKey exists */}
      {stripeKeyPromise && (
        <Elements stripe={loadStripe(stripeKeyPromise)}>
          <Checkout isError={isError} />
        </Elements>
      )}
    </div>
  );
};

export default Payment;
