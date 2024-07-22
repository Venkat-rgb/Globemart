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
