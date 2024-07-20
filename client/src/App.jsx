import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader, ProtectedRoute } from "./components";
import { useSelector } from "react-redux";
import {
  useGetCoupon,
  useGetCurrencyOfLocation,
  useGetUserLocation,
  useSaveLoginCredentials,
  useScrollToTop,
} from "./hooks";
import { basicRoutes } from "./utils/routes/basicRoutes";
import { wait } from "./utils/general/wait";
import Navbar from "./components/Navbar";
import ErrorBoundaryComponent from "./components/ErrorBoundary/ErrorBoundaryComponent";
import CouponModal from "./components/UI/CouponModal";
import { AnimatePresence } from "framer-motion";
import PageTransistion from "./components/UI/PageTransistion";
import Sidebar from "./components/UI/Sidebar";

const Profile = lazy(() => wait(500).then(() => import("./pages/Profile")));
const EditProfile = lazy(() =>
  wait(500).then(() => import("./pages/EditProfile"))
);
const ChangePassword = lazy(() =>
  wait(500).then(() => import("./pages/ChangePassword"))
);

const App = () => {
  const location = useLocation();

  const { isCouponModalOpen } = useSelector((state) => state?.coupon);

  // Scrolling to the top of the screen when routes are changing
  const { pathname } = useScrollToTop();

  // saving logged-in user credentials to localStorage
  useSaveLoginCredentials();

  // Getting users location based on IP
  const { userCurrency } = useGetUserLocation();

  // Updating new currency every 5 days
  useGetCurrencyOfLocation(userCurrency);

  // Getting Coupon if present
  const { couponData } = useGetCoupon();

  return (
    <div className="h-screen relative">
      <div className="z-50 fixed top-0 left-0 w-full">
        {/* Showing the coupon discount modal */}
        {couponData?.coupon && isCouponModalOpen && (
          <CouponModal couponText={couponData?.coupon?.couponText} />
        )}
        {!pathname.includes("admin") && <Navbar />}
      </div>

      <Sidebar />

      <ErrorBoundaryComponent errorMessage="Sorry, there was some unexpected error in the app! Please try again later.">
        <Suspense
          fallback={
            <Loader styleProp="flex items-center justify-center h-[90vh]" />
          }
        >
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Protected Route-1 */}
              <Route path="/profile">
                {/* Protected Route-2 */}
                <Route
                  index
                  element={
                    <ErrorBoundaryComponent errorMessage="Sorry, we're unable to show your profile information at the moment. Please try again later.">
                      <ProtectedRoute>
                        <PageTransistion>
                          <Profile />
                        </PageTransistion>
                      </ProtectedRoute>
                    </ErrorBoundaryComponent>
                  }
                />
                {/* Protected Route-3 */}
                <Route
                  path="edit"
                  element={
                    <ErrorBoundaryComponent errorMessage="We're sorry, editing your profile is currently unavailable. Please try again later.">
                      <ProtectedRoute>
                        <PageTransistion>
                          <EditProfile />
                        </PageTransistion>
                      </ProtectedRoute>
                    </ErrorBoundaryComponent>
                  }
                />
                <Route
                  path="password/update"
                  element={
                    <ErrorBoundaryComponent errorMessage="Sorry, changing your password is not available right now due to some error. Please check back later.">
                      <ProtectedRoute>
                        <PageTransistion>
                          <ChangePassword />
                        </PageTransistion>
                      </ProtectedRoute>
                    </ErrorBoundaryComponent>
                  }
                />
              </Route>

              {basicRoutes?.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    route.requiresAuth ? (
                      <ProtectedRoute>{route.element}</ProtectedRoute>
                    ) : (
                      route.element
                    )
                  }
                />
              ))}
            </Routes>
          </AnimatePresence>
        </Suspense>
      </ErrorBoundaryComponent>
      <Toaster
        toastOptions={{
          className: "bg-neutral-50 font-medium text-sm font-inter",
        }}
      />
    </div>
  );
};

export default App;

// import { lazy, Suspense, useEffect, useState } from "react";
// import { Navigate, Route, Routes, useLocation } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { Loader, Navbar, ProtectedRoute } from "./components";
// import { useDispatch, useSelector } from "react-redux";
// import { setCredentials } from "./redux/features/slices/authSlice";
// import jwt_decode from "jwt-decode";
// import { useGetValidCouponQuery } from "./redux/features/coupons/couponApiSlice";
// import { setCoupon, setCouponModal } from "./redux/features/slices/couponSlice";
// import { RxCross2 } from "react-icons/rx";
// import { BsStars } from "react-icons/bs";

// const Admin = lazy(() => import("./pages/Admin"));
// const Cart = lazy(() => import("./pages/Cart"));
// const Home = lazy(() => import("./pages/Home"));
// const Login = lazy(() => import("./pages/Login"));
// const NotFound = lazy(() => import("./pages/NotFound"));
// const Orders = lazy(() => import("./pages/Orders/Orders"));
// const Order = lazy(() => import("./pages/Orders/Order/Order"));
// const Products = lazy(() => import("./pages/Products"));
// const SignUp = lazy(() => import("./pages/SignUp"));
// const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
// const ChangePassword = lazy(() => import("./pages/ChangePassword"));
// const SetForgotPassword = lazy(() => import("./pages/SetForgotPassword"));
// const Wishlist = lazy(() => import("./pages/Wishlist"));
// const Profile = lazy(() => import("./pages/Profile"));
// const EditProfile = lazy(() => import("./pages/EditProfile"));
// const OrderStatus = lazy(() => import("./pages/Orders/OrderStatus"));
// const Product = lazy(() => import("./pages/Product"));
// const Payment = lazy(() => import("./pages/Payment"));
// const SearchProducts = lazy(() => import("./pages/SearchProducts"));
// const NearbyStores = lazy(() => import("./pages/NearbyStores"));
// const Chat = lazy(() => import("./pages/Chat"));

// const App = () => {
//   const { pathname } = useLocation();
//   const dispatch = useDispatch();

//   const [userCurrency, setUserCurrency] = useState(
//     sessionStorage.getItem("userCurrency") &&
//       JSON.parse(sessionStorage.getItem("userCurrency"))
//   );

//   const { userInfo } = useSelector((state) => state?.auth);
//   const { isCouponModalOpen } = useSelector((state) => state?.coupon);

//   const isUserLoggedIn = localStorage.getItem("token");

//   const currencyData =
//     sessionStorage.getItem("currencyData") &&
//     JSON.parse(sessionStorage.getItem("currencyData"));

//   const { data: couponData } = useGetValidCouponQuery();

//   const getCurrencyData = async () => {
//     try {
//       const fetchCurrencyRates = await fetch(
//         `https://api.freecurrencyapi.com/v1/latest?apikey=${
//           import.meta.env.VITE_APP_CURRENCY_API_KEY
//         }&base_currency=${userCurrency?.currency}&currencies=INR`
//       );

//       const data = await fetchCurrencyRates.json();

//       console.log("currencyRates data: ", data);

//       if (data?.message === "Validation error") {
//         sessionStorage.setItem(
//           "currencyData",
//           JSON.stringify({
//             conversion: 1,
//           })
//         );
//       } else {
//         sessionStorage.setItem(
//           "currencyData",
//           JSON.stringify({
//             conversion: Number(Object.values(data?.data)[0].toFixed(2)),
//             expirationTime: new Date().getTime() + 5 * 24 * 60 * 60 * 1000,
//           })
//         );
//       }
//     } catch (err) {
//       console.error("currency error: ", err);

//       sessionStorage.setItem(
//         "currencyData",
//         JSON.stringify({
//           conversion: 1,
//         })
//       );
//     }
//   };

//   // Scrolling to the top of the screen when routes are changing
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   // saving logged in user credentials to localStorage
//   useEffect(() => {
//     if (isUserLoggedIn) {
//       // when user refreshes the page then im setting token to redux store
//       const decodedRes = jwt_decode(isUserLoggedIn);

//       dispatch(
//         setCredentials({
//           token: isUserLoggedIn,
//           userInfo: {
//             username: decodedRes?.username,
//             role: decodedRes?.role,
//             id: decodedRes?.id,
//           },
//         })
//       );
//     }
//   }, []);

//   // Getting users location based on IP
//   useEffect(() => {
//     if (!userCurrency) {
//       const getUserCurrency = async () => {
//         try {
//           const res = await fetch(
//             `http://ip-api.com/json?fields=status,message,countryCode,currency,lat,lon`
//           );

//           const data = await res.json();

//           console.log("user location data: ", data);

//           sessionStorage.setItem(
//             "userCurrency",
//             JSON.stringify({
//               countryCode: data?.countryCode,
//               currency: data?.currency,
//             })
//           );

//           sessionStorage.setItem(
//             "userLocation",
//             JSON.stringify({ latitude: data?.lat, longitude: data?.lon })
//           );

//           setUserCurrency({
//             countryCode: data?.countryCode,
//             currency: data?.currency,
//           });
//         } catch (err) {
//           console.error(err);
//         }
//       };
//       getUserCurrency();
//     }
//   }, [userCurrency]);

//   // Updating new currency every 5 days
//   useEffect(() => {
//     // Implementing Dynamic currencies based on user location

//     if (currencyData) {
//       // checking if currencyData is expired
//       console.log("expiration time: ", currencyData?.expirationTime);
//       console.log("current Time: ", new Date().getTime());
//       if (new Date().getTime() > currencyData?.expirationTime) {
//         sessionStorage.removeItem("currencyData");
//         console.log("Resetting the currency!");

//         // Here we are refetching the new currency rate if its changed.
//         getCurrencyData();
//       }
//     } else {
//       // If user is present in india then currency will be INR so we dont make api request as the base_currency is INR
//       console.log("userCurrency currency: ", userCurrency?.currency);

//       if (userCurrency && userCurrency?.currency !== "INR") {
//         console.log("Calling the currency API!");
//         getCurrencyData();
//       } else if (userCurrency && userCurrency?.currency === "INR") {
//         sessionStorage.setItem(
//           "currencyData",
//           JSON.stringify({
//             conversion: 1,
//           })
//         );
//       }
//     }
//   }, [userCurrency]);

//   // Getting Coupon if present
//   useEffect(() => {
//     if (couponData?.coupon) {
//       dispatch(
//         setCoupon({
//           couponId: couponData?.coupon?._id,
//           couponText: couponData?.coupon?.couponText,
//           couponCode: couponData?.coupon?.couponCode,
//           discount: couponData?.coupon?.discount,
//         })
//       );
//       dispatch(setCouponModal(true));
//     }
//   }, [couponData]);

//   return (
//     <div className="h-screen relative">
//       <div className="z-50 fixed top-0 left-0 w-full">
//         {couponData?.coupon && isCouponModalOpen && (
//           <div className="bg-indigo-600 py-1.5 relative flex items-center justify-center">
//             <div className="flex items-center gap-4">
//               <BsStars style={{ color: "#f1f1f1" }} />
//               <p className="text-white font-inter text-sm text-center">
//                 {couponData?.coupon?.couponText}
//               </p>
//               <BsStars style={{ color: "#f1f1f1" }} />
//             </div>

//             <div
//               className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
//               onClick={() => dispatch(setCouponModal(false))}
//             >
//               <RxCross2 className="text-white text-xl" />
//             </div>
//           </div>
//         )}
//         {!pathname.includes("admin") && <Navbar />}
//       </div>
//       <Suspense
//         fallback={
//           <Loader styleProp="flex items-center justify-center h-[90vh]" />
//         }
//       >
//         <Routes>
//           {/* Protected Route-1 */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<SignUp />} />
//           <Route path="/password/forgot" element={<ForgotPassword />} />
//           <Route
//             path="/password/reset/:token"
//             element={<SetForgotPassword />}
//           />
//           <Route path="/profile">
//             {/* Protected Route-2 */}
//             <Route
//               index
//               element={
//                 <ProtectedRoute>
//                   <Profile />
//                 </ProtectedRoute>
//               }
//             />
//             {/* Protected Route-3 */}
//             <Route
//               path="edit"
//               element={
//                 <ProtectedRoute>
//                   <EditProfile />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="password/update" element={<ChangePassword />} />
//           </Route>

//           {/* More Protected Routes (here i used <Route element={<ProtectedRoute />}></Route> but its not working) */}

//           <Route path="/products" element={<Products />} />
//           <Route path="/product/:id" element={<Product />} />
//           <Route path="/search-products" element={<SearchProducts />} />
//           <Route
//             path="/wishlist"
//             element={
//               <ProtectedRoute>
//                 <Wishlist />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/nearby-stores/:category"
//             element={
//               <ProtectedRoute>
//                 <NearbyStores />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/orders"
//             element={
//               <ProtectedRoute>
//                 <Orders />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/order"
//             element={
//               <ProtectedRoute>
//                 <Order />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/order-success"
//             element={
//               <ProtectedRoute>
//                 <OrderStatus status="success" />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/order-failure"
//             element={
//               <ProtectedRoute>
//                 <OrderStatus status="fail" />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/cart"
//             element={
//               <ProtectedRoute>
//                 <Cart />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/checkout"
//             element={
//               <ProtectedRoute>
//                 <Payment />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/chat"
//             element={
//               <ProtectedRoute>
//                 <Chat />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/admin/*"
//             element={
//               <ProtectedRoute>
//                 <Admin />
//               </ProtectedRoute>
//             }
//           />

//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Suspense>
//       <Toaster
//         toastOptions={{
//           className: "bg-neutral-50 font-medium font-inter",
//         }}
//       />
//     </div>
//   );
// };

// export default App;
