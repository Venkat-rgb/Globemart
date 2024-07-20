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

// import { motion } from "framer-motion";
// import CartItem from "../CartItem";
// import OrderInfoForm from "./OrderInfoForm";

// const OrderInfo = ({
//   shippingDetails,
//   setShippingDetails,
//   shippingDetailsChangeHandler,
//   formattedCountries,
//   formattedStates,
//   formattedCities,
//   products,
// }) => {
//   return (
//     <motion.div
//       className="col-span-2 space-y-5 shadow-lg p-4 rounded-md"
//       initial={{ opacity: 0, y: -50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//     >
//       <p className="font-public-sans font-semibold text-neutral-600 drop-shadow  text-center text-lg">
//         Your Details
//       </p>

//       <OrderInfoForm
//         shippingDetails={shippingDetails}
//         setShippingDetails={setShippingDetails}
//         shippingDetailsChangeHandler={shippingDetailsChangeHandler}
//         formattedCountries={formattedCountries}
//         formattedStates={formattedStates}
//         formattedCities={formattedCities}
//       />

//       <div className="space-y-5 border-t pt-4">
//         <p className="font-public-sans font-semibold text-neutral-600 drop-shadow  text-center text-lg">
//           Ordered Items
//         </p>

//         <div className="flex items-center justify-between font-medium">
//           <p className="text-center underline underline-offset-2">Product</p>
//           <div className="flex items-center gap-[8.8rem]">
//             <p className="underline underline-offset-2">Qty</p>
//             <p className="underline underline-offset-2 pr-3">Price</p>
//           </div>
//         </div>

//         {products?.map((product) => (
//           <CartItem
//             key={product.productId}
//             id={product.productId}
//             image={product.productImg}
//             title={product.productTitle}
//             price={product.productPrice}
//             quantity={product.productQty}
//             placeOfUse="Order"
//           />
//         ))}
//       </div>
//     </motion.div>
//   );
// };
