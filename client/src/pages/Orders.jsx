import { Loader, MetaData } from "../components";
import OrderImage from "../assets/images/basic/orderImage.jpg";
import { useState } from "react";
import { useGetMyOrdersQuery } from "../redux/features/order/orderApiSlice";
import { AnimatePresence } from "framer-motion";
import LazyImage from "../components/LazyImage";
import OrderCollapseTable from "../components/Orders/OrderCollapseTable";
import ErrorUI from "../components/UI/ErrorUI";
import { useMediaQuery } from "@mui/material";

const Orders = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const matches = useMediaQuery("(max-width:500px)");

  const skeletonDimensions = matches ? 250 : 384;

  // Fetching all orders of customer
  const {
    data: ordersData,
    isFetching: areOrdersLoading,
    isError: ordersError,
  } = useGetMyOrdersQuery(page);

  const newPageHandler = (e, newPage) => {
    setPage(newPage);
  };

  const rowsPerPageHandler = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <div className="pt-24 pb-12 space-y-8 max-[600px]:space-y-5 max-w-5xl mx-auto px-4">
      <MetaData title="Orders" />
      <p className="font-public-sans font-semibold text-2xl text-neutral-600 drop-shadow text-center max-[500px]:text-xl">
        Your Orders
      </p>

      {/* Showing Loader while customer orders are loading */}
      {areOrdersLoading && (
        <Loader styleProp="flex items-center justify-center h-[50vh]" />
      )}

      {/* Showing errMsg, if an error occured during fetching orders */}
      {ordersError && (
        <ErrorUI message="Unable to fetch orders!" styles="mt-32 w-1/2" />
      )}

      {/* Showing all orders in form of table when they are loaded successfully */}
      <AnimatePresence>
        {!areOrdersLoading &&
          ordersData?.orders &&
          ordersData.orders.length > 0 && (
            <div className="shadow-lg">
              <OrderCollapseTable
                page={page}
                rowsPerPage={rowsPerPage}
                newPageHandler={newPageHandler}
                rowsPerPageHandler={rowsPerPageHandler}
                ordersData={ordersData}
              />
            </div>
          )}
      </AnimatePresence>

      {/* Showing order empty image when customer didn't order anything from website  */}
      {ordersData?.orders && ordersData.orders.length === 0 && (
        <div className="flex items-center flex-col justify-center">
          <div className="rounded-xl w-80 h-80 sm:w-96 sm:h-96">
            <LazyImage
              imageProps={{
                src: OrderImage,
                alt: "order-img",
              }}
              styleProp="rounded-xl"
              skeletonWidth={skeletonDimensions}
              skeletonHeight={skeletonDimensions}
            />

            {/* <LazyImage
              imageProps={{
                src: OrderImage,
                alt: "order-img",
                className: "object-cover w-full rounded-xl",
              }}
              
            /> */}
          </div>
          <p className="drop-shadow text-2xl max-[500px]:text-lg font-semibold text-neutral-600 font-inter">
            Your Orders are empty!
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;
