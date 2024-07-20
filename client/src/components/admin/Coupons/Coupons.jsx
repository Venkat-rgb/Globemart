import { DataGrid } from "@mui/x-data-grid";
import MetaData from "../../MetaData";
import Layout from "../Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {
  useDeleteCouponMutation,
  useGetCouponsQuery,
} from "../../../redux/features/coupons/couponApiSlice";
import Loader from "../../UI/Loader";
import toast from "react-hot-toast";
import { getCouponColumns } from "../../../utils/dashboard/tableColumns/getCouponColumns";
import ErrorUI from "../../UI/ErrorUI";
import { useState } from "react";

const Coupons = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Fetching all couponsData from database
  const {
    data: couponData,
    isLoading: isCouponDataLoading,
    isFetching: isCouponDataFetching,
    isError: couponDataError,
  } = useGetCouponsQuery(paginationModel.page);

  const [deleteCoupon, { isLoading: isCouponDeleting }] =
    useDeleteCouponMutation();

  // Making API request to delete coupon from database based on couponId
  const deleteCouponHandler = async (couponId) => {
    try {
      const deleteCouponRes = await deleteCoupon(couponId).unwrap();

      // Displaying 'coupon deleted successfully' message using toast
      toast.success(deleteCouponRes?.message);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Displaying Loading screen while couponData is being fetched
  if (isCouponDataLoading) {
    return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
  }

  return (
    <Layout>
      <motion.div
        className="h-full space-y-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          delay: 0.2,
        }}
      >
        <MetaData title="Dashboard | Coupons" />

        <div className="flex items-center justify-between">
          <p
            className="font-public-sans tracking-tight text-2xl text-neutral-500 font-semibold drop-shadow"
            style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)" }}
          >
            Coupons
          </p>

          {/* Link to create new coupon */}
          <Link
            className="font-inter text-sm font-semibold bg-neutral-700 text-white py-1 px-2 rounded shadow-md"
            to="/admin/coupon/create"
          >
            <AddIcon fontSize="small" />
            Create
          </Link>
        </div>

        {/* Showing errMsg, if an error occured during fetching coupons  */}
        {couponDataError && (
          <ErrorUI message="Unable to fetch coupons due to some error!" />
        )}

        {/* Displaying 10 coupons per page */}
        {!couponDataError && couponData?.totalCouponsCount > 0 && (
          <DataGrid
            sx={{
              "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
              fontFamily: "Inter",
            }}
            getRowId={(row) => row?._id}
            rowHeight={55}
            rows={couponData?.coupons}
            columns={getCouponColumns(isCouponDeleting, deleteCouponHandler)}
            // initialState={{
            //   pagination: {
            //     paginationModel: {
            //       page: 0,
            //       pageSize: 10,
            //     },
            //   },
            // }}
            loading={isCouponDataFetching}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10]}
            paginationMode="server"
            rowCount={couponData?.totalCouponsCount}
            hideFooter={couponData?.totalCouponsCount <= 10 ? true : false}
          />
        )}

        {/* Showing empty text when there are no coupons available in database */}
        {!couponDataError && couponData?.totalCouponsCount === 0 && (
          <p className="flex items-center justify-center h-[70vh] text-center text-2xl text-neutral-500 font-public-sans font-semibold max-[500px]:text-xl">
            No Coupons Available, please add some!
          </p>
        )}
      </motion.div>
    </Layout>
  );
};

export default Coupons;

// import { DataGrid } from "@mui/x-data-grid";
// import MetaData from "../../MetaData";
// import Layout from "../Layout";
// import { motion } from "framer-motion";
// import RowActions from "../RowActions";
// import { Link } from "react-router-dom";
// import AddIcon from "@mui/icons-material/Add";
// import {
//   useDeleteCouponMutation,
//   useGetCouponsQuery,
// } from "../../../redux/features/coupons/couponApiSlice";
// import Loader from "../../Loader";
// import toast from "react-hot-toast";

// const Coupons = () => {
//   const { data: couponData, isLoading: isCouponDataLoading } =
//     useGetCouponsQuery();

//   const [deleteCoupon, { isLoading: isCouponDeleting }] =
//     useDeleteCouponMutation();

//   const deleteCouponHandler = async (couponId) => {
//     try {
//       const deleteCouponRes = await deleteCoupon(couponId).unwrap();

//       console.log("deleteCouponRes: ", deleteCouponRes);

//       toast.success(deleteCouponRes?.message);
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   const columns = [
//     {
//       field: "_id",
//       headerName: "Coupon ID",
//       minWidth: 240,
//     },
//     {
//       field: "couponCode",
//       headerName: "Coupon Code",
//       minWidth: 210,
//       renderCell: (params) => {
//         return (
//           <p className="font-bold text-neutral-400 bg-neutral-200 rounded text-xs py-1 px-2">
//             {params.row?.couponCode}
//           </p>
//         );
//       },
//     },
//     {
//       field: "occasionName",
//       headerName: "Occasion Name",
//       minWidth: 250,
//     },
//     {
//       field: "discount",
//       headerName: "Discount (%)",
//       minWidth: 150,
//     },
//     {
//       field: "couponStatus",
//       headerName: "Coupon Status",
//       minWidth: 160,
//       renderCell: (params) => {
//         const couponStatus = params.row?.couponStatus;
//         return (
//           <p
//             className={`${
//               couponStatus === "active"
//                 ? "text-green-600 bg-green-100"
//                 : couponStatus === "inactive"
//                 ? "text-orange-400 bg-orange-100"
//                 : "text-red-400 bg-red-100"
//             } px-3 py-1 rounded-full capitalize`}
//           >
//             {couponStatus}
//           </p>
//         );
//       },
//     },
//     {
//       field: "actions",
//       headerName: "Actions",
//       minWidth: 100,
//       renderCell: (params) => {
//         return (
//           <RowActions
//             route="/admin/coupon/update"
//             deleteHandler={deleteCouponHandler}
//             id={params.row?._id}
//             isLoading={isCouponDeleting}
//           />
//         );
//       },
//     },
//   ];

//   if (isCouponDataLoading) {
//     return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
//   }

//   return (
//     <Layout>
//       <motion.div
//         className="h-full space-y-3"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -50 }}
//         transition={{
//           delay: 0.2,
//         }}
//       >
//         <MetaData title="Dashboard | Coupons" />

//         <div className="flex items-center justify-between">
//           <p
//             className="font-public-sans tracking-tight text-2xl text-neutral-500 font-semibold drop-shadow"
//             style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)" }}
//           >
//             Coupons
//           </p>
//           <Link
//             className="font-inter text-sm font-semibold bg-neutral-700 text-white py-1 px-2 rounded shadow-md"
//             to="/admin/coupon/create"
//           >
//             <AddIcon fontSize="small" />
//             Create
//           </Link>
//         </div>

//         {couponData?.coupons?.length > 0 && (
//           <DataGrid
//             sx={{
//               "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
//                 outline: "none !important",
//               },
//               fontFamily: "Inter",
//             }}
//             getRowId={(row) => row?._id}
//             rowHeight={55}
//             rows={couponData?.coupons}
//             columns={columns}
//             initialState={{
//               pagination: {
//                 paginationModel: {
//                   page: 0,
//                   pageSize: 10,
//                 },
//               },
//             }}
//             pageSizeOptions={[10]}
//             hideFooter={couponData?.coupons?.length <= 10 ? true : false}
//           />
//         )}

//         {couponData?.coupons?.length === 0 && (
//           <p className="flex items-center justify-center h-[70vh] text-center text-2xl text-neutral-500 font-public-sans font-semibold">
//             No Coupons Available, please add some!
//           </p>
//         )}
//       </motion.div>
//     </Layout>
//   );
// };

// export default Coupons;
