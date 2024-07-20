import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getStats = catchAsync(async (req, res) => {
  // Users
  const usersCount = await User.find().countDocuments();

  // Products
  const productsCount = await Product.find().countDocuments();

  // Orders
  const ordersCount = await Order.find().countDocuments();

  // Getting all the customer orders
  const orders = await Order.find({ "paymentInfo.paymentStatus": true });

  // Calculating total earnings of the ecommerce
  const earnings = orders.reduce(
    (acc, item) => acc + item.finalTotalAmountInINR,
    0
  );

  const monthDate = new Date(),
    weekDate = new Date(),
    todayStartDate = new Date(),
    todayEndDate = new Date();

  // Last six months date
  const lastSixMonths = new Date(monthDate.setMonth(monthDate.getMonth() - 6));

  // Last week date
  const lastWeek = new Date(weekDate.setDate(weekDate.getDate() - 7));

  // todayStartTime, todayEndTime are used to calculate today sales
  const todayStartTime = new Date(todayStartDate.setHours(0, 0, 0, 0));
  const todayEndTime = new Date(todayEndDate.setHours(23, 59, 59, 999));

  // Calculating past six months sales
  const pastSixMonthsSales = await Order.aggregate([
    {
      $match: {
        $and: [
          { createdAt: { $gte: lastSixMonths } },
          { "paymentInfo.paymentStatus": true },
        ],
      },
    },
    { $project: { finalTotalAmountInINR: 1, month: { $month: "$createdAt" } } },
    { $group: { _id: "$month", sales: { $sum: "$finalTotalAmountInINR" } } },
    { $sort: { _id: 1 } },
  ]);

  // Calculating past week sales
  const pastWeekSales = await Order.aggregate([
    {
      $match: {
        $and: [
          { createdAt: { $gte: lastWeek } },
          { "paymentInfo.paymentStatus": true },
        ],
      },
    },
    { $project: { finalTotalAmountInINR: 1, week: { $week: "$createdAt" } } },
    { $group: { _id: "$week", sales: { $sum: "$finalTotalAmountInINR" } } },
  ]);

  // Calculating today's sales
  const todaySales = await Order.aggregate([
    {
      $match: {
        $and: [
          {
            createdAt: { $gte: todayStartTime, $lte: todayEndTime },
          },
          { "paymentInfo.paymentStatus": true },
        ],
      },
    },
    {
      $project: { finalTotalAmountInINR: 1, day: { $dayOfWeek: "$createdAt" } },
    },
    { $group: { _id: "$day", sales: { $sum: "$finalTotalAmountInINR" } } },
  ]);

  // Returning all the stats of ecommerce
  res.status(200).json({
    stats: {
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
      earnings,
      pastSixMonthsSales,
      pastWeekSales,
      todaySales,
    },
  });
});
