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

// import { Route, Routes } from "react-router-dom";
// import {
//   Chats,
//   Coupons,
//   CreateAndUpdateCoupon,
//   CreateAndUpdateProduct,
//   Dashboard,
//   Navbar,
//   Orders,
//   Products,
//   Reviews,
//   Sidebar,
//   UpdateOrder,
//   UpdateUser,
//   Users,
// } from "../components/admin";
// import { useDispatch, useSelector } from "react-redux";
// import { setSideBar } from "../redux/features/slices/sidebarSlice";
// import ProtectedAdminRoute from "../components/admin/ProtectedAdminRoute";

// const Admin = () => {
//   const dispatch = useDispatch();
//   const { isSidebarOpen } = useSelector((state) => state.sidebar);

//   return (
//     <ProtectedAdminRoute>
//       <Navbar />
//       {/* flex items-start h-[92vh] relative flex-[6_6_0%] h-full   */}
//       <div>
//         <Sidebar />

//         {/* onClick={() => isSidebarOpen && dispatch(setSideBar(false))} */}
//         <div>
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/products" element={<Products />} />
//             <Route path="/coupons" element={<Coupons />} />
//             <Route path="/orders" element={<Orders />} />
//             <Route path="/users" element={<Users />} />
//             <Route path="/chats" element={<Chats />} />
//             <Route path="/reviews" element={<Reviews />} />
//             <Route
//               path="/product/create"
//               element={<CreateAndUpdateProduct role="Create" />}
//             />
//             <Route
//               path="/product/update/:productId"
//               element={<CreateAndUpdateProduct role="Update" />}
//             />
//             <Route
//               path="/coupon/create"
//               element={<CreateAndUpdateCoupon role="Create" />}
//             />
//             <Route
//               path="/coupon/update/:couponId"
//               element={<CreateAndUpdateCoupon role="Update" />}
//             />

//             <Route path="/user/update/:userId" element={<UpdateUser />} />
//             <Route path="/order/update/:orderId" element={<UpdateOrder />} />
//           </Routes>
//         </div>
//       </div>
//     </ProtectedAdminRoute>
//   );
// };

// -----------------------------------------------------------------------------------------------------------------------------------------
// <Routes>
//             <Route path="/admin">
//               <Route index element={<Dashboard />} />
//               <Route path="dashboard" element={<Dashboard />} />
//               <Route path="products" element={<Products />} />
//               <Route path="orders" element={<Orders />} />
//               <Route path="users" element={<Users />} />
//               <Route path="reviews" element={<Reviews />} />
//               <Route
//                 path="product/create"
//                 element={<CreateAndUpdateProduct role="Create" />}
//               />
//               <Route
//                 path="product/update/:productId"
//                 element={<CreateAndUpdateProduct role="Update" />}
//               />
//               <Route path="user/update/:userId" element={<UpdateUser />} />
//               <Route path="order/update/:orderId" element={<UpdateOrder />} />
//             </Route>
//           </Routes>

/*

<Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Users />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route
              path="/product/create"
              element={<CreateAndUpdateProduct role="Create" />}
            />
            <Route
              path="/product/update/:productId"
              element={<CreateAndUpdateProduct role="Update" />}
            />
            <Route path="/user/update/:userId" element={<UpdateUser />} />
            <Route path="/order/update/:orderId" element={<UpdateOrder />} />

*/
