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
