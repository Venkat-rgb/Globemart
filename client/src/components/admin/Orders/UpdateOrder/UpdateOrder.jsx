import { useParams } from "react-router-dom";
import Layout from "../../Layout";
import ShippingInfo from "./ShippingInfo";
import Payment from "./Payment";
import OrderStatus from "./OrderStatus";
import MetaData from "../../../MetaData";
import { useGetOrderQuery } from "../../../../redux/features/order/orderApiSlice";
import Loader from "../../../UI/Loader";
import OrderedItems from "./OrderedItems";
import UpdateOrderStatus from "./UpdateOrderStatus";
import ErrorUI from "../../../UI/ErrorUI";

const UpdateOrder = () => {
  const { orderId } = useParams();

  // Fetching orderData only when orderId is present
  const {
    data: orderData,
    isLoading: isOrderDataLoading,
    isError: orderDataError,
  } = useGetOrderQuery(orderId, {
    skip: !orderId,
  });

  const orderDeliveryStatus = orderData?.order?.deliveryInfo?.deliveryStatus;

  // Displaying Loader if orderData is loading
  if (isOrderDataLoading) {
    return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
  }

  // Handling error during fetching particular order information
  if (orderDataError) {
    return (
      <ErrorUI message="Unable to fetch order information due to some error!" />
    );
  }

  return (
    <Layout>
      <MetaData title="Dashboard | Order | Update" />
      <div className="space-y-10">
        <div className="grid grid-cols-3 max-[880px]:grid-cols-2 max-[600px]:grid-cols-1 drop-shadow-xl gap-4">
          {/* Showing ShippingInfo of order */}
          <ShippingInfo
            shippingInfo={orderData?.order?.shippingInfo}
            customerName={orderData?.order?.user?.customerName}
          />

          {/* Showing PaymentInfo of order */}
          <Payment
            paymentStatus={
              orderData?.order?.paymentInfo?.paymentStatus ? "Paid" : "Not Paid"
            }
            amountPaid={orderData?.order?.finalTotalAmountInINR}
            amountPaidAt={orderData?.order?.paymentInfo?.paidAt}
            paymentMode={orderData?.order?.paymentInfo?.paymentMode}
            subTotalAmount={orderData?.order?.subTotalAmount}
            shippingAmount={orderData?.order?.shippingAmount}
            GST={orderData?.order?.gstAmount}
            coupon={orderData?.order?.coupon ? orderData.order.coupon : false}
          />

          {/* Showing OrderStatus of order */}
          <OrderStatus
            deliveryStatus={
              orderDeliveryStatus === "processing"
                ? "processing"
                : orderDeliveryStatus === "shipped"
                ? "shipped"
                : "delivered"
            }
            deliveredAt={orderData?.order?.deliveryInfo?.deliveredAt}
          />
        </div>
        <div
          className={`grid ${
            orderDeliveryStatus === "delivered"
              ? "grid-cols-1 w-full"
              : "grid-cols-6"
          } max-[880px]:grid-cols-1 gap-4`}
        >
          {/* Showing OrderedItems by customer */}
          <OrderedItems orderedProducts={orderData?.order?.products} />

          {/* Giving permission, to updateStatus of order till its not delivered */}
          {orderDeliveryStatus !== "delivered" && (
            <UpdateOrderStatus
              orderId={orderId}
              orderData={orderData?.order}
              orderDeliveryStatus={orderDeliveryStatus}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateOrder;

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Layout from "../../Layout";
// import { DataGrid } from "@mui/x-data-grid";
// import ShippingInfo from "./ShippingInfo";
// import Payment from "./Payment";
// import OrderStatus from "./OrderStatus";
// import RouteIcon from "@mui/icons-material/Route";
// import InputDivStyle from "../../InputDivStyle";
// import { motion } from "framer-motion";
// import MetaData from "../../../MetaData";
// import {
//   useGetOrderQuery,
//   useUpdateOrderMutation,
//   useUpdatePaymentStatusMutation,
// } from "../../../../redux/features/order/orderApiSlice";
// import Loader from "../../../Loader";
// import { CircularProgress } from "@mui/material";
// import toast from "react-hot-toast";
// import lodash from "lodash";
// import Button from "../../../Button";
// import OrderedItems from "./OrderedItems";

// // const columns = [
// //   {
// //     field: "_id",
// //     headerName: "Product ID",
// //     minWidth: 250,
// //     flex: 1,
// //   },
// //   {
// //     field: "product",
// //     headerName: "Product",
// //     minWidth: 300,
// //     flex: 1,
// //     renderCell: (params) => {
// //       return <p className="line-clamp-1">{params.row?.product?.title}</p>;
// //     },
// //   },
// //   {
// //     field: "quantity",
// //     headerName: "Quantity",
// //     flex: 1,
// //     renderCell: (params) => {
// //       return <p className="line-clamp-1">{params.row?.quantity}</p>;
// //     },
// //   },
// //   {
// //     field: "price",
// //     headerName: "Price",
// //     flex: 1,
// //     renderCell: (params) => {
// //       const productDiscount = Number(
// //         (params.row?.product?.discountPrice).toFixed(2)
// //       );

// //       return (
// //         <p className="line-clamp-1">{`₹${productDiscount?.toLocaleString()}`}</p>
// //       );
// //     },
// //   },
// // ];

// const UpdateOrder = () => {
//   const { orderId } = useParams();
//   const [orderStatus, setOrderStatus] = useState("");

//   const { data: orderData, isLoading: isOrderDataLoading } =
//     useGetOrderQuery(orderId);

//   const [updateOrder, { isLoading: isOrderUpdating }] =
//     useUpdateOrderMutation();

//   const [updatePaymentStatus, { isLoading: isPaymentStatusUpdating }] =
//     useUpdatePaymentStatusMutation();

//   const orderDeliveryStatus = orderData?.order?.deliveryInfo?.deliveryStatus;

//   console.log("updateOrderData: ", orderData);

//   const updateOrderStatusHandler = async (e) => {
//     e.preventDefault();

//     if (!orderStatus.trim()) return;

//     try {
//       if (!lodash.isEqual(orderDeliveryStatus, orderStatus)) {
//         const updateOrderRes = await updateOrder({
//           id: orderId,
//           deliveryStatus: orderStatus,
//         }).unwrap();

//         console.log("updateOrderRes", updateOrderRes);

//         toast.success(updateOrderRes?.message);
//       }
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   const paymentHandler = async () => {
//     try {
//       const updatePaymentRes = await updatePaymentStatus(orderId).unwrap();

//       console.log("updatePaymentRes: ", updatePaymentRes);

//       toast.success(updatePaymentRes?.message);
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   useEffect(() => {
//     if (orderDeliveryStatus) {
//       setOrderStatus(orderDeliveryStatus);
//     }
//   }, [orderData?.order]);

//   if (isOrderDataLoading) {
//     return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
//   }

//   return (
//     <Layout>
//       <MetaData title="Dashboard | Order | Update" />
//       <div className="space-y-10">
//         <div className="grid grid-cols-3 max-[880px]:grid-cols-2 max-[600px]:grid-cols-1 drop-shadow-xl gap-4">
//           <ShippingInfo
//             shippingInfo={orderData?.order?.shippingInfo}
//             customerName={orderData?.order?.user?.customerName}
//           />

//           <Payment
//             paymentStatus={
//               orderData?.order?.paymentInfo?.paymentStatus ? "Paid" : "Not Paid"
//             }
//             amountPaid={orderData?.order?.finalTotalAmountInINR}
//             amountPaidAt={orderData?.order?.paymentInfo?.paidAt}
//             paymentMode={orderData?.order?.paymentInfo?.paymentMode}
//             subTotalAmount={orderData?.order?.subTotalAmount}
//             shippingAmount={orderData?.order?.shippingAmount}
//             GST={orderData?.order?.gstAmount}
//             coupon={orderData?.order?.coupon ? orderData?.order?.coupon : false}
//           />

//           <OrderStatus
//             deliveryStatus={
//               orderDeliveryStatus === "processing"
//                 ? "processing"
//                 : orderDeliveryStatus === "shipped"
//                 ? "shipped"
//                 : "delivered"
//             }
//             deliveredAt={orderData?.order?.deliveryInfo?.deliveredAt}
//           />
//         </div>
//         <div
//           className={`grid ${
//             orderDeliveryStatus === "delivered"
//               ? "grid-cols-1 w-full"
//               : "grid-cols-6"
//           } max-[880px]:grid-cols-1 gap-4`}
//         >
//           {/* <motion.div
//             className="drop-shadow-lg rounded-xl bg-neutral-50 p-3 col-span-4 w-full space-y-4"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -50 }}
//             transition={{ delay: 2 }}
//           >
//             <p className="text-neutral-400 font-bold border-b-[1px] inline-block font-inter uppercase">
//               Ordered Items
//             </p>

//             <DataGrid
//               sx={{
//                 "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
//                   outline: "none !important",
//                 },
//                 fontFamily: "Inter",
//               }}
//               rows={orderData?.order?.products}
//               getRowId={(row) => row?._id}
//               columns={columns}
//               autoHeight
//               initialState={{
//                 pagination: {
//                   paginationModel: {
//                     page: 0,
//                     pageSize: 5,
//                   },
//                 },
//               }}
//               pageSizeOptions={[5]}
//               hideFooter={orderData?.order?.products.length <= 5 ? true : false}
//             />
//           </motion.div> */}
//           <OrderedItems
//             orderedProducts={orderData?.order?.products}
//             orderedProductsLength={orderData?.order?.products?.length}
//           />
//           {orderDeliveryStatus !== "delivered" && (
//             <motion.div
//               className="bg-neutral-50 p-3 drop-shadow-lg rounded-xl col-span-2 max-[880px]:col-span-4 space-y-5 max-h-72"
//               initial={{ opacity: 0, y: -50 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 50 }}
//               transition={{ delay: 2 }}
//             >
//               {!orderData?.order?.paymentInfo?.paymentStatus &&
//                 orderData?.order?.paymentInfo?.paymentMode === "offline" && (
//                   <div className="space-y-4">
//                     <p className="text-neutral-400 font-bold border-b-[1px] font-inter uppercase inline-block">
//                       Process Payment
//                     </p>
//                     {/* <button
//                       className="text-white py-2 bg-indigo-600 rounded w-full flex items-center justify-center font-inter"
//                       type="button"
//                       onClick={paymentHandler}
//                       disabled={isPaymentStatusUpdating}
//                     >
//                       {isPaymentStatusUpdating ? (
//                         <div className="flex items-center justify-center gap-2">
//                           <p className="text-neutral-300 font-medium font-inter">
//                             Updating
//                           </p>
//                           <CircularProgress
//                             sx={{ color: "#cccccc" }}
//                             size={22}
//                           />
//                         </div>
//                       ) : (
//                         <p>Mark Order As Paid</p>
//                       )}
//                     </button> */}

//                     <Button
//                       onClick={paymentHandler}
//                       isLoading={isPaymentStatusUpdating}
//                     >
//                       {isPaymentStatusUpdating ? (
//                         <div className="flex items-center justify-center gap-2">
//                           <p className="text-neutral-300 font-medium font-inter">
//                             Updating
//                           </p>
//                           <CircularProgress
//                             sx={{ color: "#cccccc" }}
//                             size={22}
//                           />
//                         </div>
//                       ) : (
//                         <p>Mark Order As Paid</p>
//                       )}
//                     </Button>
//                   </div>
//                 )}

//               <p className="text-neutral-400 font-bold border-b-[1px] inline-block font-inter uppercase">
//                 Process Order
//               </p>

//               <form
//                 onSubmit={updateOrderStatusHandler}
//                 className="font-public-sans w-full space-y-4"
//               >
//                 <InputDivStyle>
//                   <RouteIcon className="text-neutral-400" />
//                   <select
//                     onChange={(e) => setOrderStatus(e.target.value)}
//                     className="outline-none w-full px-3"
//                     value={orderStatus}
//                   >
//                     <option value="processing">Processing</option>
//                     <option value="shipped">Shipped</option>
//                     <option value="delivered">Delivered</option>
//                   </select>
//                 </InputDivStyle>

//                 <Button isLoading={isOrderUpdating}>
//                   {isOrderUpdating ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <p className="text-neutral-300 font-medium font-inter">
//                         Updating
//                       </p>
//                       <CircularProgress sx={{ color: "#cccccc" }} size={22} />
//                     </div>
//                   ) : (
//                     <p>Update Status</p>
//                   )}
//                 </Button>
//               </form>
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default UpdateOrder;
