import { catchAsync } from "../utils/catchAsync.js";
import Stripe from "stripe";

export const getStripeKey = catchAsync(async (req, res) => {
  // Sending Stripe API key to client
  res.status(200).json({ stripeKey: process.env.STRIPE_API_KEY });
});

export const processPayment = catchAsync(async (req, res) => {
  // Creating stripe instance
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { finalAmount, currency, line1, city, state, country, customerName } =
    req.body;

  // Creating the paymentIntent
  // Below both JPY, KRW are zero decimal currencies so we should not multiply them by 100
  const paymentIntent = await stripe.paymentIntents.create({
    amount:
      currency === "jpy" || currency === "krw"
        ? Math.round(finalAmount)
        : Math.round(finalAmount * 100),
    currency,
    description: "Payment for products",
    shipping: {
      name: customerName,
      address: {
        line1,
        city,
        country,
        state,
      },
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  // Sending clientSecret to user
  res.status(200).json({ clientSecret: paymentIntent.client_secret });
});
