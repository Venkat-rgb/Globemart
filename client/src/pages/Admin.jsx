import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProtectedAdminRoute from "../components/admin/ProtectedAdminRoute";
import { adminRoutes } from "../utils/routes/adminRoutes";
import { Suspense, useEffect } from "react";
import { Loader } from "../components";
import Navbar from "../components/admin/Navbar";
import Sidebar from "../components/admin/Sidebar";
import { setCouponModal } from "../redux/features/slices/couponSlice";

const Admin = () => {
  const dispatch = useDispatch();
  const { isCouponModalOpen } = useSelector((state) => state?.coupon);

  // Closing coupon modal if we are on Admin route, as we don't need it here
  useEffect(() => {
    if (isCouponModalOpen) {
      dispatch(setCouponModal(false));
    }
  }, [dispatch, isCouponModalOpen]);

  return (
    <ProtectedAdminRoute>
      <Navbar />
      {/* flex items-start h-[92vh] relative flex-[6_6_0%] h-full   */}
      <div>
        <Sidebar />

        {/* onClick={() => isSidebarOpen && dispatch(setSideBar(false))} */}
        <Suspense
          fallback={
            <Loader styleProp="flex items-center justify-center h-[90vh]" />
          }
        >
          <Routes>
            {adminRoutes?.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Suspense>
      </div>
    </ProtectedAdminRoute>
  );
};

export default Admin;
