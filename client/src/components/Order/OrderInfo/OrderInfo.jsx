import { motion } from "framer-motion";
import OrderInfoForm from "./OrderInfoForm";
import { Country, State, City } from "country-state-city";
import ErrorBoundaryComponent from "../../ErrorBoundary/ErrorBoundaryComponent";
import ErrorUI from "../../UI/ErrorUI";
import OrderedProducts from "./OrderedProducts";
import { useMemo } from "react";

const OrderInfo = ({
  shippingDetails,
  setShippingDetails,
  shippingDetailsChangeHandler,
  products,
  addressInfoError,
}) => {
  // Choosing location details from these below countries, states, and cities for product delivery
  const allCountries = useMemo(() => Country.getAllCountries(), []);
  const allStates = useMemo(
    () => State.getStatesOfCountry(shippingDetails?.country?.value),
    [shippingDetails?.country?.value]
  );
  const allCities = useMemo(
    () =>
      City.getCitiesOfState(
        shippingDetails?.country?.value,
        shippingDetails?.state?.value
      ),
    [shippingDetails?.country?.value, shippingDetails?.state?.value]
  );

  const formattedCountries = useMemo(
    () =>
      allCountries?.map((country) => {
        return { label: country?.name, value: country?.isoCode };
      }),
    [allCountries]
  );

  const formattedStates = useMemo(
    () =>
      allStates?.map((state) => {
        return { label: state?.name, value: state?.isoCode };
      }),
    [allStates]
  );

  const formattedCities = useMemo(
    () =>
      allCities?.map((city) => {
        return { label: city?.name, value: city?.name };
      }),
    [allCities]
  );

  return (
    <motion.div
      className="col-span-2 max-[850px]:col-span-1 space-y-5 shadow-lg p-4 rounded-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.2 }}
    >
      <div className="space-y-5">
        <p className="font-public-sans font-semibold text-neutral-600 drop-shadow  text-center text-lg">
          Your Details
        </p>

        {/* Showing errMsg, if an error occured during fetching customer address */}
        {addressInfoError && (
          <ErrorUI message="Unable to fetch customer address due to some error!" />
        )}

        {/* Customer Address Info */}
        <ErrorBoundaryComponent errorMessage="We're sorry, the shipping information of your order is currently unavailable. Please try again later.">
          <OrderInfoForm
            shippingDetails={shippingDetails}
            setShippingDetails={setShippingDetails}
            shippingDetailsChangeHandler={shippingDetailsChangeHandler}
            formattedCountries={formattedCountries}
            formattedStates={formattedStates}
            formattedCities={formattedCities}
          />
        </ErrorBoundaryComponent>
      </div>

      {/* Customer Ordering Products */}
      <OrderedProducts products={products} />
    </motion.div>
  );
};

export default OrderInfo;
