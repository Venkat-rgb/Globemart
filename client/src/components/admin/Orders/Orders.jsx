import MetaData from "../../MetaData";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import Layout from "../Layout";
import {
  // useDeleteOrderMutation,
  useGetAllOrdersQuery,
} from "../../../redux/features/order/orderApiSlice";
import Loader from "../../UI/Loader";
// import toast from "react-hot-toast";
import { getOrdersColumns } from "../../../utils/dashboard/tableColumns/getOrdersColumns";
import ErrorUI from "../../UI/ErrorUI";
import { useState } from "react";

const Orders = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Fetching all ordersData
  const {
    data: ordersData,
    isLoading: isOrdersDataLoading,
    isFetching: isOrdersDataFetching,
    isError: ordersDataError,
  } = useGetAllOrdersQuery(paginationModel.page);

  // const [deleteOrder, { isLoading: isOrderDeleting }] =
  //   useDeleteOrderMutation();

  // const deleteOrderHandler = async (orderId) => {
  //   try {
  //     const deleteOrderRes = await deleteOrder(orderId).unwrap();
  //     toast.success(deleteOrderRes?.message);
  //   } catch (err) {
  //     toast.error(err?.message || err?.data?.message);
  //   }
  // };

  // Displaying Loader while ordersData is loading
  if (isOrdersDataLoading) {
    return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
  }

  return (
    <Layout>
      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          delay: 0.2,
        }}
      >
        <MetaData title="Dashboard | Orders" />
        <p className="font-public-sans tracking-tight text-2xl text-neutral-500 font-semibold drop-shadow text-center max-[500px]:text-xl">
          All Orders
        </p>

        {/* Showing errMsg, if an error occured during fetching orders */}
        {ordersDataError && (
          <ErrorUI message="Unable to fetch orders due to some error!" />
        )}

        {/* Displaying 10 orders of customers per page */}
        {!ordersDataError && ordersData?.totalOrdersCount > 0 && (
          <DataGrid
            sx={{
              "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
              fontFamily: "Inter",
            }}
            rows={ordersData?.orders}
            getRowId={(row) => row?._id}
            columns={getOrdersColumns(
              "Orders",
              [280, 300, 250, 200]
              // deleteOrderHandler,
              // isOrderDeleting
            )}
            // initialState={{
            //   pagination: {
            //     paginationModel: {
            //       page: 0,
            //       pageSize: 10,
            //     },
            //   },
            // }}
            loading={isOrdersDataFetching}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10]}
            paginationMode="server"
            rowCount={ordersData?.totalOrdersCount}
            hideFooter={ordersData?.totalOrdersCount <= 10 ? true : false}
          />
        )}

        {/* Showing empty text when there are no ordersData available in database */}
        {!ordersDataError && ordersData?.totalOrdersCount === 0 && (
          <p className="text-center text-2xl max-[500px]:text-xl text-neutral-500 font-public-sans font-semibold">
            Orders are empty, no one has ordered yet!
          </p>
        )}
      </motion.div>
    </Layout>
  );
};

export default Orders;
