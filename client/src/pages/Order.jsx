import { useEffect, useMemo, useState } from "react";
import { Loader, MetaData } from "../components";
import { motion } from "framer-motion";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BiChevronLeft } from "react-icons/bi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { gstCalculation } from "../utils/general/gstCalculation";
import { useValidateOrderMutation } from "../redux/features/order/orderApiSlice";
import {
  useCreateOrUpdateAddressMutation,
  useGetCustomerAddressQuery,
} from "../redux/features/userAddress/userAddressApiSlice";
import lodash from "lodash";
import OrderInfo from "../components/Order/OrderInfo/OrderInfo";
import OrderSummary from "../components/Order/OrderSummary/OrderSummary";
import ErrorBoundaryComponent from "../components/ErrorBoundary/ErrorBoundaryComponent";
import useSessionStorage from "../hooks/basic/useSessionStorage";

const Order = () => {
  const navigate = useNavigate();

  // Keeps track of finalAmountToBePaid by customer
  const [finalAmountToBePaid, setFinalAmountToBePaid] = useState(0);

  // Keeps track of whether (empty cart) error is shown or not
  const [isCartEmptyErrorShown, setIsCartEmptyErrorShown] = useState(false);

  // Fetching the addressInfo of the customer
  const {
    data: addressInfo,
    isLoading: isAddressInfoLoading,
    isError: addressInfoError,
  } = useGetCustomerAddressQuery();

  const [createOrUpdateAddress] = useCreateOrUpdateAddressMutation();

  const [validateOrder, { isLoading: isValidating }] =
    useValidateOrderMutation();

  const { getSessionData, setSessionData } = useSessionStorage();

  // const currencyData =
  //   sessionStorage.getItem("currencyData") &&
  //   JSON.parse(sessionStorage.getItem("currencyData"));

  const currencyData = getSessionData("currencyData");

  // const userCurrency =
  //   sessionStorage.getItem("userCurrency") &&
  //   JSON.parse(sessionStorage.getItem("userCurrency"));

  const userCurrency = getSessionData("userCurrency");

  const { userInfo } = useSelector((state) => state?.auth);

  // Getting ordered items with its details to show the customer
  const { products, totalAmount, totalProductsCount } = useSelector(
    (state) => state?.cart
  );

  // Calculating shippingCharges and gstCharges
  const shippingCharges = useMemo(
    () =>
      totalAmount * currencyData?.conversion > 2000 ? totalAmount * 0.02 : 0,
    [currencyData?.conversion, totalAmount]
  );

  const gstPercent = useMemo(
    () => gstCalculation(totalAmount * currencyData?.conversion),
    [currencyData?.conversion, totalAmount]
  );

  const gstCharges = useMemo(
    () => totalAmount * gstPercent,
    [gstPercent, totalAmount]
  );

  // Selecting only particular properties in ordered products to show customer
  const filteredProducts = useMemo(
    () =>
      products?.map((product) => {
        return {
          product: product?.productId,
          quantity: product?.productQty,
          price: product?.productId,
        };
      }),
    [products]
  );

  // Keeps track of the orderDetails of customer
  const [shippingDetails, setShippingDetails] = useState({
    fullName: userInfo?.username,
    phoneNo: {
      phone: "",
      countryCode: userCurrency?.countryCode,
    },
    address: "",
    country: "",
    state: "",
    city: "",
    subTotalAmount: totalAmount,
    shippingPrice: shippingCharges,
    finalAmount: finalAmountToBePaid,
    orderedProducts: filteredProducts,
  });

  // Previous addressDetails before user updated his addressDetails
  const previousAddressInfo = {
    address: addressInfo?.address?.address,
    phoneNo: addressInfo?.address?.phoneNo,
    country: addressInfo?.address?.country,
    state: addressInfo?.address?.state,
    city: addressInfo?.address?.city,
  };

  // Setting the orderDetails
  const shippingDetailsChangeHandler = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const orderSubmitHandler = async () => {
    try {
      // Current addressDetails
      const addressDetails = {
        address: shippingDetails.address,

        country: {
          countryName:
            shippingDetails.country?.label ||
            shippingDetails.country?.countryName,
          countryCode:
            shippingDetails.country?.value ||
            shippingDetails.country?.countryCode,
        },
        state: {
          stateName:
            shippingDetails.state?.label || shippingDetails.state?.stateName,
          stateCode:
            shippingDetails.state?.value || shippingDetails.state?.stateCode,
        },
        city: shippingDetails.city?.label || shippingDetails?.city,
        phoneNo: shippingDetails.phoneNo,
      };

      const addressObj = {
        customer: {
          customerId: userInfo?.id,
          customerName: shippingDetails.fullName,
        },
        ...addressDetails,
      };

      let addressRes = "";

      // Updating the customer address only if they didn't update it
      if (!lodash.isEqual(addressDetails, previousAddressInfo)) {
        addressRes = await createOrUpdateAddress(addressObj).unwrap();
      }

      // Total Order Information
      const orderObj = {
        user: {
          customerId: userInfo?.id,
          customerName: shippingDetails?.fullName,
        },
        products: shippingDetails?.orderedProducts,
        shippingInfo: addressRes
          ? addressRes?.addressId
          : addressInfo?.address?._id,
        subTotalAmount: Number(
          (shippingDetails?.subTotalAmount * currencyData?.conversion).toFixed(
            2
          )
        ),
        shippingAmount: Number(
          (shippingDetails?.shippingPrice * currencyData?.conversion).toFixed(2)
        ),
        gstAmount: Number((gstCharges * currencyData?.conversion).toFixed(2)),
        finalTotalAmountInINR: Number(
          (shippingDetails?.finalAmount * currencyData?.conversion).toFixed(2)
        ),

        finalTotalAmountCountrySpecific: Number(
          shippingDetails?.finalAmount.toFixed(2)
        ),
        currency: userCurrency?.currency?.toLowerCase(),
      };

      // If coupon exists then add it to orderObj
      if (shippingDetails?.coupon) {
        orderObj["coupon"] = shippingDetails?.coupon;
      }

      // Validating the orderDetails if all fields are correct
      const validateRes = await validateOrder(orderObj).unwrap();

      // Saving the orderDetails to the sessionStorage
      setSessionData("orderInfo", {
        ...orderObj,
        currencyConversion: currencyData?.conversion,
      });

      // sessionStorage.setItem(
      //   "orderInfo",
      //   JSON.stringify({
      //     ...orderObj,
      //     currencyConversion: currencyData?.conversion,
      //   })
      // );

      // Redirecting to Checkout page to make payment
      navigate("/checkout", { replace: true });
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Setting finalAmountToBePaid in useState, so that while applying coupon we can decrease finalAmountToBePaid
  useEffect(() => {
    const totalPrice = Number(
      (totalAmount + shippingCharges + gstCharges).toFixed(2)
    );
    setFinalAmountToBePaid(totalPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // As finalAmountToBePaid is not reflected immediately in shippingDetails, so we are using another useEffect to set finalAmount
  useEffect(() => {
    setShippingDetails({
      ...shippingDetails,
      finalAmount: finalAmountToBePaid,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalAmountToBePaid]);

  // Showing the address info to user if addressinfo of user already exists
  useEffect(() => {
    if (addressInfo?.address) {
      setShippingDetails({
        ...shippingDetails,
        address: addressInfo?.address?.address,
        country: addressInfo?.address?.country,
        state: addressInfo?.address?.state,
        city: addressInfo?.address?.city,
        phoneNo: {
          phone: addressInfo?.address?.phoneNo?.phone,
          countryCode: addressInfo?.address?.phoneNo?.countryCode,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressInfo?.address]);

  // If totalProductsCount is 0 then we don't want user to access Order page
  useEffect(() => {
    // Showing error when cart is empty and cart empty error has not been shown yet
    if (totalProductsCount === 0 && !isCartEmptyErrorShown) {
      // Showing error
      toast.error("Please add some products to your cart first!");

      // Marking cart empty error as shown so that error will be shown only once
      setIsCartEmptyErrorShown(true);
    }
  }, [totalProductsCount, isCartEmptyErrorShown]);

  // Redirecting to /cart page only when cartEmpty error is shown
  if (totalProductsCount === 0 && isCartEmptyErrorShown) {
    return <Navigate to="/cart" replace={true} />;
  }

  // Showing Loader while addressInfo is loading
  if (isAddressInfoLoading) {
    return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
  }

  return (
    <div className="pt-24 pb-12 space-y-8 max-w-5xl mx-auto max-[1050px]:px-2 font-inter">
      <MetaData title="Order" />

      <p className="font-public-sans font-semibold text-2xl max-[550px]:text-xl text-neutral-600 drop-shadow text-center">
        Your Order
      </p>
      <div className="flex items-center justify-between gap-4 font-inter">
        <div className="flex items-center gap-3 border rounded-full pl-3 max-[750px]:pl-0">
          <p className="max-[820px]:text-sm max-[750px]:hidden">
            Wanna Modify Products?
          </p>

          {/* Redirecting user to cart */}
          <Link to="/cart">
            <motion.div
              className="flex items-center gap-[0.4rem] bg-neutral-800/90 text-[#f1f1f1] py-[0.28rem] pl-2 pr-4 rounded-full shadow-md"
              whileTap={{ scale: 0.97 }}
            >
              <BiChevronLeft className="text-[1.3rem]" />
              <p className="max-[820px]:text-sm max-[350px]:text-xs">
                Go To Cart
              </p>
            </motion.div>
          </Link>
        </div>

        <div className="flex items-center gap-3 border rounded-full pl-3 max-[750px]:pl-0">
          <p className="max-[820px]:text-sm max-[750px]:hidden">
            Wanna Add More Products?
          </p>

          {/* Redirecting user to Products Page */}
          <Link to="/products">
            <motion.div
              className="flex items-center gap-[0.4rem] bg-neutral-800/90 text-[#f1f1f1] py-[0.28rem] pl-2 pr-4 rounded-full shadow-md"
              whileTap={{ scale: 0.97 }}
            >
              <BiChevronLeft className="text-[1.3rem]" />
              <p className="max-[820px]:text-sm max-[350px]:text-xs">
                Continue Shopping
              </p>
            </motion.div>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-3 max-[850px]:grid-cols-1 gap-4">
        {/* Showing Customer Address details and Ordered products */}
        <OrderInfo
          shippingDetails={shippingDetails}
          setShippingDetails={setShippingDetails}
          shippingDetailsChangeHandler={shippingDetailsChangeHandler}
          products={products}
          addressInfoError={addressInfoError}
        />

        {/* Showing Order Summary */}

        <ErrorBoundaryComponent errorMessage="Sorry, we are unable to show your Order summary. Please try again later.">
          <OrderSummary
            totalAmount={totalAmount}
            shippingCharges={shippingCharges}
            gstCharges={gstCharges}
            gstPercent={gstPercent}
            finalAmountToBePaid={finalAmountToBePaid}
            orderSubmitHandler={orderSubmitHandler}
            isValidating={isValidating}
            shippingDetails={shippingDetails}
            setShippingDetails={setShippingDetails}
            setFinalAmountToBePaid={setFinalAmountToBePaid}
            currencyConversion={currencyData?.conversion}
          />
        </ErrorBoundaryComponent>
      </div>
    </div>
  );
};

export default Order;

// FULL NEW
// import { useEffect, useState } from "react";
// import { MetaData } from "../components";
// import { motion } from "framer-motion";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import { BiChevronLeft } from "react-icons/bi";
// import { Country, State, City } from "country-state-city";
// import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import { gstCalculation } from "../utils/general/gstCalculation";
// import {
//   useCreateOrderMutation,
//   useValidateOrderMutation,
// } from "../redux/features/order/orderApiSlice";
// import {
//   useCreateOrUpdateAddressMutation,
//   useGetCustomerAddressQuery,
// } from "../redux/features/userAddress/userAddressApiSlice";
// import lodash from "lodash";
// import { OrderInfo, OrderSummary } from "../components";

// const Order = () => {
//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   const [finalAmountToBePaid, setFinalAmountToBePaid] = useState(0);

//   console.log("finalAmountToBePaid: ", finalAmountToBePaid);

//   const { data: addressInfo } = useGetCustomerAddressQuery();

//   const [createOrUpdateAddress] = useCreateOrUpdateAddressMutation();

//   const [validateOrder, { isLoading: isValidating }] =
//     useValidateOrderMutation();

//   const currencyData =
//     sessionStorage.getItem("currencyData") &&
//     JSON.parse(sessionStorage.getItem("currencyData"));

//   const userCurrency =
//     sessionStorage.getItem("userCurrency") &&
//     JSON.parse(sessionStorage.getItem("userCurrency"));

//   const { userInfo } = useSelector((state) => state?.auth);

//   const { products, totalAmount, totalProductsCount } = useSelector(
//     (state) => state?.cart
//   );

//   const shippingCharges =
//       totalAmount * currencyData?.conversion > 2000 ? totalAmount * 0.02 : 0,
//     gstCharges =
//       totalAmount * gstCalculation(totalAmount * currencyData?.conversion);

//   const filteredProducts = products?.map((product) => {
//     return {
//       product: product?.productId,
//       quantity: product?.productQty,
//       price: product?.productId,
//     };
//   });

//   const [shippingDetails, setShippingDetails] = useState({
//     fullName: userInfo?.username,
//     phoneNo: {
//       phone: "",
//       countryCode: userCurrency?.countryCode,
//     },
//     address: "",
//     country: "",
//     state: "",
//     city: "",
//     subTotalAmount: totalAmount,
//     shippingPrice: shippingCharges,
//     finalAmount: finalAmountToBePaid,
//     orderedProducts: filteredProducts,
//   });

//   console.log("shippingDetails: ", shippingDetails);

//   const previousAddressInfo = {
//     address: addressInfo?.address?.address,
//     phoneNo: addressInfo?.address?.phoneNo,
//     country: addressInfo?.address?.country,
//     state: addressInfo?.address?.state,
//     city: addressInfo?.address?.city,
//   };

//   const allCountries = Country.getAllCountries();
//   const allStates = State.getStatesOfCountry(shippingDetails?.country?.value);
//   const allCities = City.getCitiesOfState(
//     shippingDetails?.country?.value,
//     shippingDetails?.state?.value
//   );

//   const formattedCountries = allCountries.map((country) => {
//     return { label: country?.name, value: country?.isoCode };
//   });

//   const formattedStates = allStates.map((state) => {
//     return { label: state?.name, value: state?.isoCode };
//   });

//   const formattedCities = allCities.map((city) => {
//     return { label: city?.name, value: city?.name };
//   });

//   const shippingDetailsChangeHandler = (e) => {
//     setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
//   };

//   const couponHandler = (couponInfo) => {
//     const { role } = couponInfo;

//     const totalPrice = Number(
//       (totalAmount + shippingCharges + gstCharges).toFixed(2)
//     );

//     if (role === "apply") {
//       const couponDiscountPrice = Number(
//         (finalAmountToBePaid * (couponInfo.discount / 100)).toFixed(2)
//       );

//       const couponPrice = Number(
//         (finalAmountToBePaid - couponDiscountPrice).toFixed(2)
//       );

//       setFinalAmountToBePaid(couponPrice);

//       setShippingDetails({
//         ...shippingDetails,
//         coupon: {
//           couponCode: couponInfo.couponCode,
//           couponPriceInINR: Number(
//             (couponDiscountPrice * currencyData?.conversion).toFixed(2)
//           ),
//         },
//         finalAmount: couponPrice,
//       });
//     } else if (role === "remove") {
//       setFinalAmountToBePaid(totalPrice);

//       setShippingDetails({
//         ...shippingDetails,
//         coupon: null,
//         finalAmount: totalPrice,
//       });
//     }
//   };

//   const orderSubmitHandler = async () => {
//     try {
//       const addressDetails = {
//         address: shippingDetails.address,

//         country: {
//           countryName:
//             shippingDetails.country?.label ||
//             shippingDetails.country?.countryName,
//           countryCode:
//             shippingDetails.country?.value ||
//             shippingDetails.country?.countryCode,
//         },
//         state: {
//           stateName:
//             shippingDetails.state?.label || shippingDetails.state?.stateName,
//           stateCode:
//             shippingDetails.state?.value || shippingDetails.state?.stateCode,
//         },
//         city: shippingDetails.city?.label || shippingDetails?.city,
//         phoneNo: shippingDetails.phoneNo,
//       };

//       const addressObj = {
//         customer: {
//           customerId: userInfo?.id,
//           customerName: shippingDetails.fullName,
//         },
//         ...addressDetails,
//       };

//       let addressRes = "";
//       if (!lodash.isEqual(addressDetails, previousAddressInfo)) {
//         addressRes = await createOrUpdateAddress(addressObj).unwrap();
//         console.log("addressRes: ", addressRes);
//       }

//       const orderObj = {
//         user: {
//           customerId: userInfo?.id,
//           customerName: shippingDetails?.fullName,
//         },
//         products: shippingDetails?.orderedProducts,
//         shippingInfo: addressRes
//           ? addressRes?.addressId
//           : addressInfo?.address?._id,
//         subTotalAmount: Number(
//           (shippingDetails?.subTotalAmount * currencyData?.conversion).toFixed(
//             2
//           )
//         ),
//         shippingAmount: Number(
//           (shippingDetails?.shippingPrice * currencyData?.conversion).toFixed(2)
//         ),
//         gstAmount: Number((gstCharges * currencyData?.conversion).toFixed(2)),
//         finalTotalAmountInINR: Number(
//           (shippingDetails?.finalAmount * currencyData?.conversion).toFixed(2)
//         ),

//         finalTotalAmountCountrySpecific: Number(
//           shippingDetails?.finalAmount.toFixed(2)
//         ),
//         currency: userCurrency?.currency?.toLowerCase(),
//       };

//       // If coupom exists then add it to orderObj
//       if (shippingDetails?.coupon) {
//         orderObj["coupon"] = shippingDetails?.coupon;
//       }

//       console.log("orderObj: ", orderObj);

//       const validateRes = await validateOrder(orderObj).unwrap();

//       console.log("validateRes: ", validateRes);

//       sessionStorage.setItem(
//         "orderInfo",
//         JSON.stringify({
//           ...orderObj,
//           currencyConversion: currencyData?.conversion,
//         })
//       );

//       navigate("/checkout", { replace: true });
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   // Setting finalAmountToBePaid in useState, so that while applying coupon we can decrease finalAmountToBePaid
//   useEffect(() => {
//     const totalPrice = Number(
//       (totalAmount + shippingCharges + gstCharges).toFixed(2)
//     );
//     setFinalAmountToBePaid(totalPrice);
//   }, []);

//   // As finalAmountToBePaid is not reflected immediately in shippingDetails, so we are using another useEffect to set finalAmount
//   useEffect(() => {
//     setShippingDetails({
//       ...shippingDetails,
//       finalAmount: finalAmountToBePaid,
//     });
//   }, [finalAmountToBePaid]);

//   useEffect(() => {
//     if (addressInfo?.address) {
//       setShippingDetails({
//         ...shippingDetails,
//         address: addressInfo?.address?.address,
//         country: addressInfo?.address?.country,
//         state: addressInfo?.address?.state,
//         city: addressInfo?.address?.city,
//         phoneNo: {
//           phone: addressInfo?.address?.phoneNo?.phone,
//           countryCode: addressInfo?.address?.phoneNo?.countryCode,
//         },
//       });
//     }
//   }, [addressInfo?.address]);

//   // If totalProductsCount is 0 then we don't want user to access Order page
//   if (totalProductsCount === 0) {
//     toast.error("Please add some products to your cart first!");
//     return <Navigate to="/cart" replace={true} />;
//   }

//   return (
//     <div className="pt-24 pb-12 space-y-8 max-w-5xl mx-auto font-inter">
//       <MetaData title="Ecommercy | Order" />

//       <p className="font-public-sans font-semibold text-2xl text-neutral-600 drop-shadow text-center">
//         Your Order
//       </p>
//       <div className="flex items-center justify-between gap-4 font-inter">
//         <div className="flex items-center gap-3 border rounded-full pl-3">
//           <p>Wanna Modify Products?</p>
//           <Link to="/cart">
//             <motion.div
//               className="flex items-center gap-[0.4rem] bg-neutral-800/90 text-[#f1f1f1] py-[0.28rem] pl-2 pr-4 rounded-full shadow-md"
//               whileTap={{ scale: 0.97 }}
//             >
//               <BiChevronLeft className="text-[1.3rem]" />
//               <p>Go To Cart</p>
//             </motion.div>
//           </Link>
//         </div>

//         <div className="flex items-center gap-3 border rounded-full pl-3">
//           <p>Wanna Add More Products?</p>

//           <Link to="/products">
//             <motion.div
//               className="flex items-center gap-[0.4rem] bg-neutral-800/90 text-[#f1f1f1] py-[0.28rem] pl-2 pr-4 rounded-full shadow-md"
//               whileTap={{ scale: 0.97 }}
//             >
//               <BiChevronLeft className="text-[1.3rem]" />
//               <p>Continue Shopping</p>
//             </motion.div>
//           </Link>
//         </div>
//       </div>
//       <div className="grid grid-cols-3 gap-4">
//         <OrderInfo
//           shippingDetails={shippingDetails}
//           setShippingDetails={setShippingDetails}
//           shippingDetailsChangeHandler={shippingDetailsChangeHandler}
//           formattedCountries={formattedCountries}
//           formattedStates={formattedStates}
//           formattedCities={formattedCities}
//           products={products}
//         />

//         <OrderSummary
//           totalAmount={totalAmount}
//           shippingCharges={shippingCharges}
//           gstCharges={gstCharges}
//           finalAmountToBePaid={finalAmountToBePaid}
//           orderSubmitHandler={orderSubmitHandler}
//           isValidating={isValidating}
//           couponHandler={couponHandler}
//         />
//       </div>
//     </div>
//   );
// };

// export default Order;

// NEW
// const Order = () => {
//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   const [finalAmountToBePaid, setFinalAmountToBePaid] = useState("");

//   const { data: addressInfo } = useGetCustomerAddressQuery();

//   const [createOrUpdateAddress] = useCreateOrUpdateAddressMutation();

//   const [validateOrder, { isLoading: isValidating }] =
//     useValidateOrderMutation();

//   const currencyData =
//     sessionStorage.getItem("currencyData") &&
//     JSON.parse(sessionStorage.getItem("currencyData"));

//   const userCurrency =
//     sessionStorage.getItem("userCurrency") &&
//     JSON.parse(sessionStorage.getItem("userCurrency"));

//   const { userInfo } = useSelector((state) => state?.auth);

//   const { products, totalAmount, totalProductsCount } = useSelector(
//     (state) => state?.cart
//   );

//   const shippingCharges =
//       totalAmount * currencyData?.conversion > 2000 ? totalAmount * 0.02 : 0,
//     gstCharges =
//       totalAmount * gstCalculation(totalAmount * currencyData?.conversion),
//     finalTotalAmount = totalAmount + shippingCharges + gstCharges;

//   const filteredProducts = products?.map((product) => {
//     return {
//       product: product?.productId,
//       quantity: product?.productQty,
//       price: product?.productId,
//     };
//   });

//   const [shippingDetails, setShippingDetails] = useState({
//     fullName: userInfo?.username,
//     phoneNo: {
//       phone: "",
//       countryCode: userCurrency?.countryCode,
//     },
//     address: "",
//     country: "",
//     state: "",
//     city: "",
//     subTotalAmount: totalAmount,
//     shippingPrice: shippingCharges,
//     finalAmount: finalTotalAmount,
//     orderedProducts: filteredProducts,
//   });

//   const previousAddressInfo = {
//     address: addressInfo?.address?.address,
//     phoneNo: addressInfo?.address?.phoneNo,
//     country: addressInfo?.address?.country,
//     state: addressInfo?.address?.state,
//     city: addressInfo?.address?.city,
//   };

//   const allCountries = Country.getAllCountries();
//   const allStates = State.getStatesOfCountry(shippingDetails?.country?.value);
//   const allCities = City.getCitiesOfState(
//     shippingDetails?.country?.value,
//     shippingDetails?.state?.value
//   );

//   const formattedCountries = allCountries.map((country) => {
//     return { label: country?.name, value: country?.isoCode };
//   });

//   const formattedStates = allStates.map((state) => {
//     return { label: state?.name, value: state?.isoCode };
//   });

//   const formattedCities = allCities.map((city) => {
//     return { label: city?.name, value: city?.name };
//   });

//   const shippingDetailsChangeHandler = (e) => {
//     setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
//   };

//   const couponHandler = (coupon) => {};

//   const orderSubmitHandler = async () => {
//     try {
//       const addressDetails = {
//         address: shippingDetails.address,

//         country: {
//           countryName:
//             shippingDetails.country?.label ||
//             shippingDetails.country?.countryName,
//           countryCode:
//             shippingDetails.country?.value ||
//             shippingDetails.country?.countryCode,
//         },
//         state: {
//           stateName:
//             shippingDetails.state?.label || shippingDetails.state?.stateName,
//           stateCode:
//             shippingDetails.state?.value || shippingDetails.state?.stateCode,
//         },
//         city: shippingDetails.city?.label || shippingDetails?.city,
//         phoneNo: shippingDetails.phoneNo,
//       };

//       const addressObj = {
//         customer: {
//           customerId: userInfo?.id,
//           customerName: shippingDetails.fullName,
//         },
//         ...addressDetails,
//       };

//       let addressRes = "";
//       if (!lodash.isEqual(addressDetails, previousAddressInfo)) {
//         addressRes = await createOrUpdateAddress(addressObj).unwrap();
//         console.log("addressRes: ", addressRes);
//       }

//       const orderObj = {
//         user: {
//           customerId: userInfo?.id,
//           customerName: shippingDetails?.fullName,
//         },
//         products: shippingDetails?.orderedProducts,
//         shippingInfo: addressRes
//           ? addressRes?.addressId
//           : addressInfo?.address?._id,
//         subTotalAmount: Number(
//           (shippingDetails?.subTotalAmount * currencyData?.conversion).toFixed(
//             2
//           )
//         ),
//         shippingAmount: Number(
//           (shippingDetails?.shippingPrice * currencyData?.conversion).toFixed(2)
//         ),
//         gstAmount: Number((gstCharges * currencyData?.conversion).toFixed(2)),
//         finalTotalAmountInINR: Number(
//           (shippingDetails?.finalAmount * currencyData?.conversion).toFixed(2)
//         ),

//         finalTotalAmountCountrySpecific: Number(
//           shippingDetails?.finalAmount.toFixed(2)
//         ),
//         currency: userCurrency?.currency?.toLowerCase(),
//       };

//       const validateRes = await validateOrder(orderObj).unwrap();

//       console.log("validateRes: ", validateRes);

//       sessionStorage.setItem(
//         "orderInfo",
//         JSON.stringify({
//           ...orderObj,
//           currencyConversion: currencyData?.conversion,
//         })
//       );

//       navigate("/checkout", { replace: true });
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   useEffect(() => {
//     if (addressInfo?.address) {
//       setShippingDetails({
//         ...shippingDetails,
//         address: addressInfo?.address?.address,
//         country: addressInfo?.address?.country,
//         state: addressInfo?.address?.state,
//         city: addressInfo?.address?.city,
//         phoneNo: {
//           phone: addressInfo?.address?.phoneNo?.phone,
//           countryCode: addressInfo?.address?.phoneNo?.countryCode,
//         },
//       });
//     }
//   }, [addressInfo?.address]);

//   // useEffect(() => {
//   //   setFinalAmountToBePaid(totalAmount + shippingCharges + gstCharges);
//   // }, []);

//   // If totalProductsCount is 0 then we don't want user to access Order page
//   if (totalProductsCount === 0) {
//     toast.error("Please add some products to your cart first!");
//     return <Navigate to="/cart" replace={true} />;
//   }

//   return (
//     <div className="pt-24 pb-12 space-y-8 max-w-5xl mx-auto font-inter">
//       <MetaData title="Ecommercy | Order" />

//       <p className="font-public-sans font-semibold text-2xl text-neutral-600 drop-shadow text-center">
//         Your Order
//       </p>
//       <div className="flex items-center justify-between gap-4 font-inter">
//         <div className="flex items-center gap-3 border rounded-full pl-3">
//           <p>Wanna Modify Products?</p>
//           <Link to="/cart">
//             <motion.div
//               className="flex items-center gap-[0.4rem] bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 py-[0.28rem] pl-2 pr-4 rounded-full shadow-md"
//               whileTap={{ scale: 0.97 }}
//             >
//               <BiChevronLeft className="text-[1.3rem]" />
//               <p>Go To Cart</p>
//             </motion.div>
//           </Link>
//         </div>

//         <div className="flex items-center gap-3 border rounded-full pl-3">
//           <p>Wanna Add More Products?</p>

//           <Link to="/products">
//             <motion.div
//               className="flex items-center gap-[0.4rem] bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 py-[0.28rem] pl-2 pr-4 rounded-full shadow-md"
//               whileTap={{ scale: 0.97 }}
//             >
//               <BiChevronLeft className="text-[1.3rem]" />
//               <p>Continue Shopping</p>
//             </motion.div>
//           </Link>
//         </div>
//       </div>
//       <div className="grid grid-cols-3 gap-4">
//         <OrderInfo
//           shippingDetails={shippingDetails}
//           setShippingDetails={setShippingDetails}
//           shippingDetailsChangeHandler={shippingDetailsChangeHandler}
//           formattedCountries={formattedCountries}
//           formattedStates={formattedStates}
//           formattedCities={formattedCities}
//           products={products}
//         />

//         <OrderSummary
//           totalAmount={totalAmount}
//           shippingCharges={shippingCharges}
//           gstCharges={gstCharges}
//           finalTotalAmount={finalTotalAmount}
//           orderSubmitHandler={orderSubmitHandler}
//           isValidating={isValidating}
//           couponHandler={couponHandler}
//         />
//       </div>
//     </div>
//   );
// };

// export default Order;

// OLD
// const Order = () => {
//   const navigate = useNavigate();

//   const [validateOrder, { isLoading: isValidating }] =
//     useValidateOrderMutation();

//   const { data: addressInfo } = useGetCustomerAddressQuery();

//   const [createOrUpdateAddress] = useCreateOrUpdateAddressMutation();

//   const currencyData =
//     sessionStorage.getItem("currencyData") &&
//     JSON.parse(sessionStorage.getItem("currencyData"));

//   const userCurrency =
//     sessionStorage.getItem("userCurrency") &&
//     JSON.parse(sessionStorage.getItem("userCurrency"));

//   const orderInfo =
//     sessionStorage.getItem("orderInfo") &&
//     JSON.parse(sessionStorage.getItem("orderInfo"));

//   const { userInfo } = useSelector((state) => state?.auth);

//   const { products, totalAmount, totalProductsCount } = useSelector(
//     (state) => state?.cart
//   );

//   const shippingCharges =
//       totalAmount * currencyData?.conversion > 2000 ? totalAmount * 0.02 : 0,
//     gstCharges =
//       totalAmount * gstCalculation(totalAmount * currencyData?.conversion),
//     finalTotalAmount = totalAmount + shippingCharges + gstCharges;

//   const filteredProducts = products?.map((product) => {
//     return {
//       product: product.productId,
//       quantity: product.productQty,
//       price: product.productId,
//     };
//   });

//   const [shippingDetails, setShippingDetails] = useState({
//     fullName: userInfo?.username,
//     phoneNo: {
//       phone: "",
//       countryCode: userCurrency?.countryCode,
//     },
//     address: "",
//     country: "",
//     state: "",
//     city: "",
//     subTotalAmount: totalAmount,
//     shippingPrice: shippingCharges,
//     finalAmount: finalTotalAmount,
//     orderedProducts: filteredProducts,
//   });

//   const previousAddressInfo = {
//     address: addressInfo?.address?.address,
//     phoneNo: addressInfo?.address?.phoneNo,
//     country: addressInfo?.address?.country,
//     state: addressInfo?.address?.state,
//     city: addressInfo?.address?.city,
//   };

//   const allCountries = Country.getAllCountries();
//   const allStates = State.getStatesOfCountry(shippingDetails?.country?.value);
//   const allCities = City.getCitiesOfState(
//     shippingDetails?.country?.value,
//     shippingDetails?.state?.value
//   );

//   const formattedCountries = allCountries.map((country) => {
//     return { label: country?.name, value: country?.isoCode };
//   });

//   const formattedStates = allStates.map((state) => {
//     return { label: state?.name, value: state?.isoCode };
//   });

//   const formattedCities = allCities.map((city) => {
//     return { label: city?.name, value: city?.name };
//   });

//   const shippingDetailsChangeHandler = (e) => {
//     setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
//   };

//   const orderSubmitHandler = async () => {
//     try {
//       const addressDetails = {
//         address: shippingDetails.address,

//         country: {
//           countryName:
//             shippingDetails.country?.label ||
//             shippingDetails.country?.countryName,
//           countryCode:
//             shippingDetails.country?.value ||
//             shippingDetails.country?.countryCode,
//         },
//         state: {
//           stateName:
//             shippingDetails.state?.label || shippingDetails.state?.stateName,
//           stateCode:
//             shippingDetails.state?.value || shippingDetails.state?.stateCode,
//         },
//         city: shippingDetails.city?.label || shippingDetails?.city,
//         phoneNo: shippingDetails.phoneNo,
//       };

//       const addressObj = {
//         customer: {
//           customerId: userInfo?.id,
//           customerName: shippingDetails.fullName,
//         },
//         ...addressDetails,
//       };

//       let addressRes = "";
//       if (!lodash.isEqual(addressDetails, previousAddressInfo)) {
//         addressRes = await createOrUpdateAddress(addressObj).unwrap();
//         console.log("addressRes: ", addressRes);
//       }

//       const orderObj = {
//         user: {
//           customerId: userInfo?.id,
//           customerName: shippingDetails.fullName,
//         },
//         products: shippingDetails.orderedProducts,
//         shippingInfo: addressRes
//           ? addressRes?.addressId
//           : addressInfo?.address?._id,
//         subTotalAmount: Number(
//           (shippingDetails.subTotalAmount * currencyData?.conversion).toFixed(2)
//         ),
//         shippingAmount: Number(
//           (shippingDetails.shippingPrice * currencyData?.conversion).toFixed(2)
//         ),
//         gstAmount: Number((gstCharges * currencyData?.conversion).toFixed(2)),
//         finalTotalAmountInINR: Number(
//           (shippingDetails.finalAmount * currencyData?.conversion).toFixed(2)
//         ),
//         finalTotalAmount: Number(shippingDetails.finalAmount.toFixed(2)),
//         currency: userCurrency?.currency?.toLowerCase(),
//       };

//       const validateRes = await validateOrder(orderObj).unwrap();

//       console.log("validateRes: ", validateRes);

//       sessionStorage.setItem(
//         "orderInfo",
//         JSON.stringify({
//           ...orderObj,
//           currencyConversion: currencyData?.conversion,
//         })
//       );

//       navigate("/checkout", { replace: true });
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   useEffect(() => {
//     if (addressInfo?.address) {
//       setShippingDetails({
//         ...shippingDetails,
//         address: addressInfo.address.address,
//         country: addressInfo.address.country,
//         state: addressInfo.address.state,
//         city: addressInfo.address.city,
//         phoneNo: {
//           phone: addressInfo.address.phoneNo.phone,
//           countryCode: addressInfo.address.phoneNo.countryCode,
//         },
//       });
//     }
//   }, [addressInfo?.address]);

//   // If totalProductsCount is 0 then we don't want user to access Order page
//   if (totalProductsCount === 0) {
//     toast.error("Please add some products to your cart first!");
//     return <Navigate to="/cart" replace={true} />;
//   }

//   return (
//     <div className="pt-24 pb-12 space-y-8 max-w-5xl mx-auto font-inter">
//       <MetaData title="Ecommercy | Order" />

//       <p className="font-public-sans font-semibold text-2xl text-neutral-600 drop-shadow text-center">
//         Your Order
//       </p>
//       <div className="flex items-center justify-between gap-4 font-inter">
//         <div className="flex items-center gap-3 border rounded-full pl-3">
//           <p>Wanna Modify Products?</p>
//           <Link to="/cart">
//             <motion.div
//               className="flex items-center gap-[0.4rem] bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 py-[0.28rem] pl-2 pr-4 rounded-full shadow-md"
//               whileTap={{ scale: 0.97 }}
//             >
//               <BiChevronLeft className="text-[1.3rem]" />
//               <p>Go To Cart</p>
//             </motion.div>
//           </Link>
//         </div>

//         <div className="flex items-center gap-3 border rounded-full pl-3">
//           <p>Wanna Add More Products?</p>

//           <Link to="/products">
//             <motion.div
//               className="flex items-center gap-[0.4rem] bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 py-[0.28rem] pl-2 pr-4 rounded-full shadow-md"
//               whileTap={{ scale: 0.97 }}
//             >
//               <BiChevronLeft className="text-[1.3rem]" />
//               <p>Continue Shopping</p>
//             </motion.div>
//           </Link>
//         </div>
//       </div>
//       <div className="grid grid-cols-3 gap-4">
//         <OrderInfo
//           shippingDetails={shippingDetails}
//           setShippingDetails={setShippingDetails}
//           shippingDetailsChangeHandler={shippingDetailsChangeHandler}
//           formattedCountries={formattedCountries}
//           formattedStates={formattedStates}
//           formattedCities={formattedCities}
//           products={products}
//         />

//         <OrderSummary
//           totalAmount={totalAmount}
//           shippingCharges={shippingCharges}
//           gstCharges={gstCharges}
//           finalTotalAmount={finalTotalAmount}
//           orderSubmitHandler={orderSubmitHandler}
//           isValidating={isValidating}
//         />
//       </div>
//     </div>
//   );
// };

// export default Order;
