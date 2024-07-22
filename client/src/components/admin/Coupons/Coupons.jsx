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
