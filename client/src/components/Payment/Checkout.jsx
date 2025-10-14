import MetaData from "../MetaData";
import CashOnDelivery from "./CashOnDelivery";
import OnlinePayment from "./OnlinePayment";
import ErrorBoundaryComponent from "../ErrorBoundary/ErrorBoundaryComponent";
import { Navigate } from "react-router-dom";
import useSessionStorage from "../../hooks/basic/useSessionStorage";

const Checkout = ({ isError }) => {
  const { getSessionData } = useSessionStorage();

  const orderInfo = getSessionData("orderInfo");

  // Redirecting the user to order page if orderInfo is not present
  if (!orderInfo) {
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
