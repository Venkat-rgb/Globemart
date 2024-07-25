import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { orderInvoiceTemplate } from "../utils/orderInvoiceTemplate.js";
import { sendInvoice } from "../utils/sendInvoice.js";

// GET ALL ORDERS (Admin)
export const getOrders = catchAsync(async (req, res) => {
  const { page } = req.query;

  // Finding total orders count
  const totalOrdersCount = await Order.find().countDocuments();

  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "customerId")
    .populate("products.product", "title")
    .populate("products.price", "price")
    .populate("shippingInfo", "address country state city phoneNo")
    .skip(+page ? +page * 10 : 0)
    .limit(10);

  res.status(200).json({
    orders,
    totalOrdersCount,
  });
});

// GET ALL ORDERS OF CUSTOMER
export const getMyOrders = catchAsync(async (req, res) => {
  const { page } = req.query;

  // Getting total orders of logged in customer
  const totalOrdersCount = await Order.find({
    "user.customerId": req.user._id,
  }).countDocuments();

  // Implementing Pagination by only sending 10 orders per page
  const orders = await Order.find({ "user.customerId": req.user._id })
    .sort({ createdAt: -1 })
    .populate("products.product", "title discount discountPrice")
    .populate("products.price", "price")
    .select(
      "_id finalTotalAmountInINR deliveryInfo.deliveryStatus products paymentInfo shippingInfo productsOrderedDate"
    )
    .skip(+page ? +page * 10 : 0)
    .limit(10);

  res.status(200).json({
    orders,
    totalOrdersCount,
  });
});

// GET SINGLE ORDER
export const getOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Getting single order by orderId
  const order = await Order.findById(id)
    ?.populate("user", "customerId customerName")
    ?.populate("products.product", "title discount discountPrice")
    ?.populate("products.price", "price")
    ?.populate("shippingInfo", "address country state city phoneNo");

  // Returning error if order doesn't exist
  if (!order) return next(new AppError(`Order does not exist!`, 400));

  // Returning single order to user
  res.status(200).json({
    order,
  });
});

// VALIDATE ORDER DETAILS
export const validateOrder = catchAsync(async (req, res) => {
  const order = new Order(req.body);

  // Validating order details before creating an order
  await order.validate();

  // Returning status, which indicates that order is validated and it can be created
  res.status(200).json({ success: true });
});

// DECREASES STOCK AND SENDS INVOICE MAIL
const decreaseStockAndSendInvoiceHelper = async (
  req,
  order,
  currencyConversion,
  paymentMode,
  productsOrderedDate
) => {
  try {
    // Collecting fields required to send invoice mail to user
    const invoiceInfo = {
      subTotalAmount: Number(
        (order?.subTotalAmount / currencyConversion).toFixed(2)
      ),
      shippingAmount: Number(
        (order?.shippingAmount / currencyConversion).toFixed(2)
      ),
      gstAmount: Number((order?.gstAmount / currencyConversion).toFixed(2)),
      finalTotalAmount: Number(order?.finalTotalAmountCountrySpecific),
      currency: order?.currency.toUpperCase(),
      invoiceProducts: [],
      couponPrice: order?.coupon?.couponPriceInINR
        ? Number(
            (order?.coupon?.couponPriceInINR / currencyConversion).toFixed(2)
          )
        : null,
      paymentMode,
    };

    // Getting all the product id's of orderedItems
    const orderedProductsIds = order?.products?.map(
      (product) => product?.product
    );

    // Decreasing the stock of product as it has been ordered, also we decrease stock for those products whose stock is > 0
    const orderedProducts = await Product.find({
      _id: { $in: orderedProductsIds },
      stock: { $gt: 0 },
    });

    // Decreasing the stock of each product as it was ordered
    orderedProducts.forEach(async (product) => {
      const findingOrderedProduct = order?.products?.find(
        (item) => item?.product.toString() === product?._id.toString()
      );

      invoiceInfo.invoiceProducts.push({
        productName: product?.title,
        quantity: findingOrderedProduct?.quantity,
        price: `${Number(
          (product?.discountPrice / currencyConversion).toFixed(2)
        )} ${invoiceInfo?.currency}`,
        orderedDate: new Date(productsOrderedDate).toLocaleString(),
      });

      product.stock -= findingOrderedProduct?.quantity;

      await product.validate();

      await product.save();
    });

    // Sending Order Invoice to the customer email
    const emailSubject = `Ecommercy - Online store`;

    // Creating the template for email message
    const emailMessage = orderInvoiceTemplate(invoiceInfo);

    // Sending the order invoice mail to user email address
    await sendInvoice({
      emailSubject,
      emailMessage,
      customerEmail: req?.user?.email,
    });
  } catch (err) {
    throw new AppError(err.message, 400);
  }
};

// CREATE ORDER
export const createOrder = catchAsync(async (req, res) => {
  const { currencyConversion, paymentMode, ...orderDetails } = req.body;

  const order = new Order(orderDetails);

  // Validating the order, just to be sure
  await order.validate();

  // Setting paymentStatus as true if paymentMode is online, as user pay immediately
  if (paymentMode === "online") {
    // Payment is successful
    order.paymentInfo.paymentStatus = true;

    // Set Payment PaidAt
    order.paymentInfo.paidAt = new Date().toISOString();
  }

  // Saving the paymentMode used by user to pay for the order
  order.paymentInfo.paymentMode = paymentMode;

  // Ordered date of the products
  order.productsOrderedDate = new Date().toISOString();

  // Saving the created order in DB
  await order.save();

  // Decrease the stock and send order invoice to customer-mail
  await decreaseStockAndSendInvoiceHelper(
    req,
    order,
    currencyConversion,
    paymentMode,
    order.productsOrderedDate
  );

  // Returning order successfull message to user
  res.status(201).json({
    message:
      "Order created successfully! Please check your mail for your order invoice that we sent!",
  });
});

// UPDATE ORDER (Admin)
export const updateOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { deliveryStatus } = req.body;

  if (!deliveryStatus || !deliveryStatus.trim()) {
    return next(new AppError(`Please enter order delivery status!`, 400));
  }

  // Updating the delivery status provided by user
  const order = await Order.findByIdAndUpdate(
    id,
    { deliveryInfo: { deliveryStatus: deliveryStatus } },
    { new: true, runValidators: true }
  );

  if (!order) return next(new AppError(`Order does not exist!`, 400));

  // Setting paymentStatus to true
  if (req.body?.paymentSuccess) {
    order.paymentInfo.paymentStatus = true;

    order.paymentInfo.paidAt = new Date().toISOString();
  }

  // setting deliveredAt date as the if order is delivered
  if (deliveryStatus === "delivered") {
    order.deliveryInfo.deliveredAt = new Date().toISOString();
  }

  // Saving updated order model to DB
  await order.save();

  res.status(200).json({
    message: `Order updated successfully!`,
  });
});

// UPDATE ORDER PAYMENT FOR CASH ON DELIVERY MODE (Admin)
export const updateOrderPayment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  // If order doesn't exist
  if (!order) {
    return next(new AppError(`Order does not exist!`, 404));
  }

  // As the order exist, change paymentStatus and paidAt
  order.paymentInfo.paymentStatus = true;

  order.paymentInfo.paidAt = new Date().toISOString();

  await order.validate();

  await order.save();

  res.status(200).json({
    message: `Order payment status is updated successfully!`,
  });
});

// DELETE ORDER (Admin)
export const deleteOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Deleting the order based on orderId
  const order = await Order.findByIdAndDelete(id);

  // Returning error if order doesn't exist
  if (!order) return next(new AppError(`Order does not exist!`, 400));

  res.status(200).json({
    message: `Order deleted successfully!`,
  });
});
