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
