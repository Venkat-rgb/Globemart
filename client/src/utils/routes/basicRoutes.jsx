import { lazy } from "react";
import { wait } from "../general/wait";
import ErrorBoundaryComponent from "../../components/ErrorBoundary/ErrorBoundaryComponent";
import PageTransistion from "../../components/UI/PageTransistion";

const delay = 200;

const Home = lazy(() => wait(delay).then(() => import("../../pages/Home")));
const Login = lazy(() => wait(delay).then(() => import("../../pages/Login")));
const SignUp = lazy(() => wait(delay).then(() => import("../../pages/SignUp")));
const ForgotPassword = lazy(() =>
  wait(delay).then(() => import("../../pages/ForgotPassword"))
);
const SetForgotPassword = lazy(() =>
  wait(delay).then(() => import("../../pages/SetForgotPassword"))
);
const Products = lazy(() =>
  wait(delay).then(() => import("../../pages/Products"))
);
const Product = lazy(() =>
  wait(delay).then(() => import("../../pages/Product"))
);
const SearchProducts = lazy(() =>
  wait(delay).then(() => import("../../pages/SearchProducts"))
);
const Wishlist = lazy(() =>
  wait(delay).then(() => import("../../pages/Wishlist"))
);
const NearbyStores = lazy(() =>
  wait(delay).then(() => import("../../pages/NearbyStores"))
);
const Orders = lazy(() => wait(delay).then(() => import("../../pages/Orders")));
const Order = lazy(() => wait(delay).then(() => import("../../pages/Order")));
const OrderStatus = lazy(() =>
  wait(delay).then(() => import("../../pages/OrderStatus"))
);
const Cart = lazy(() => wait(delay).then(() => import("../../pages/Cart")));
const Payment = lazy(() =>
  wait(delay).then(() => import("../../pages/Payment"))
);
const Chat = lazy(() => wait(delay).then(() => import("../../pages/Chat")));
const Admin = lazy(() => wait(delay).then(() => import("../../pages/Admin")));
const NotFound = lazy(() =>
  wait(delay).then(() => import("../../pages/NotFound"))
);

export const basicRoutes = [
  {
    path: "/",
    element: (
      <PageTransistion>
        <Home />
      </PageTransistion>
    ),
    requiresAuth: false,
  },
  {
    path: "/login",
    element: (
      <ErrorBoundaryComponent errorMessage="Sorry, we're unable to provide the Login option at the moment due to some error, Please try again later!">
        <Login />
      </ErrorBoundaryComponent>
    ),
    requiresAuth: false,
  },
  {
    path: "/register",
    element: (
      <ErrorBoundaryComponent errorMessage="Sorry, we're unable to provide the SignUp option at the moment due to some error, Please try again later!">
        <SignUp />
      </ErrorBoundaryComponent>
    ),
    requiresAuth: false,
  },
  {
    path: "/password/forgot",
    element: (
      <ErrorBoundaryComponent errorMessage="Sorry, we're unable to provide the Forgot password option at the moment due to some error, Please try again later!">
        <ForgotPassword />
      </ErrorBoundaryComponent>
    ),
    requiresAuth: false,
  },
  {
    path: "/password/reset/:token",
    element: (
      <ErrorBoundaryComponent errorMessage="Sorry, we're unable to provide the Reset Forgot password option at the moment due to some error, Please try again later!">
        <SetForgotPassword />
      </ErrorBoundaryComponent>
    ),
    requiresAuth: false,
  },
  {
    path: "/products",
    element: (
      <ErrorBoundaryComponent errorMessage="We're experiencing difficulties loading the Products. Please try again later!">
        <PageTransistion>
          <Products />
        </PageTransistion>
      </ErrorBoundaryComponent>
    ),
    requiresAuth: false,
  },
  {
    path: "/product/:id",
    element: (
      <ErrorBoundaryComponent errorMessage="Sorry, we're unable to show the Product  at the moment due to some error, Please try again later.">
        <PageTransistion>
          <Product />
        </PageTransistion>
      </ErrorBoundaryComponent>
    ),
    requiresAuth: false,
  },
  {
    path: "/search-products",
    element: (
      <ErrorBoundaryComponent errorMessage="We're sorry, you can't search for products at the moment due to some error, Please try again later.">
        <SearchProducts />
      </ErrorBoundaryComponent>
    ),
    requiresAuth: false,
  },
  {
    path: "/wishlist",
    element: (
      <ErrorBoundaryComponent errorMessage="We're sorry, your Wishlist is currently unavailable. Please try again later.">
        <PageTransistion>
          <Wishlist />
        </PageTransistion>
      </ErrorBoundaryComponent>
    ),
    requiresAuth: true,
  },
  {
    path: "/nearby-stores/:category",
    element: (
      <ErrorBoundaryComponent errorMessage="We're sorry, we're unable to show Nearby stores at the moment, Please try again later.">
        <PageTransistion styleProp="w-full pt-[3.34rem] h-full font-inter">
          <NearbyStores />
        </PageTransistion>
      </ErrorBoundaryComponent>
    ),
    requiresAuth: true,
  },
  {
    path: "/orders",
    element: (
      <ErrorBoundaryComponent errorMessage="We're sorry, your order history is currently unavailable. Please try again later.">
        <PageTransistion>
          <Orders />
        </PageTransistion>
      </ErrorBoundaryComponent>
    ),
    requiresAuth: true,
  },
  {
    path: "/order",
    element: (
      <ErrorBoundaryComponent errorMessage="We're sorry, your Order is currently unavailable. Please try again later.">
        <PageTransistion>
          <Order />
        </PageTransistion>
      </ErrorBoundaryComponent>
    ),
    requiresAuth: true,
  },
  {
    path: "/order-success",
    element: (
      <ErrorBoundaryComponent errorMessage="Apologies, we're unable to show Order Success GIF!">
        <PageTransistion>
          <OrderStatus status="success" />
        </PageTransistion>
      </ErrorBoundaryComponent>
    ),
    requiresAuth: true,
  },
  {
    path: "/order-failure",
    element: (
      <ErrorBoundaryComponent errorMessage="Apologies, we're unable to show Order Failed GIF!">
        <PageTransistion>
          <OrderStatus status="fail" />
        </PageTransistion>
      </ErrorBoundaryComponent>
    ),
    requiresAuth: true,
  },
  {
    path: "/cart",
    element: (
      <ErrorBoundaryComponent errorMessage="Apologies, we're experiencing difficulties loading your Cart. Please check back later.">
        <PageTransistion>
          <Cart />
        </PageTransistion>
      </ErrorBoundaryComponent>
    ),
    requiresAuth: true,
  },
  {
    path: "/checkout",
    element: (
      <ErrorBoundaryComponent errorMessage="We're sorry, we're unable to process your payment at the moment. Please try again later.">
        <PageTransistion>
          <Payment />
        </PageTransistion>
      </ErrorBoundaryComponent>
    ),
    requiresAuth: true,
  },
  {
    path: "/chat",
    element: (
      <ErrorBoundaryComponent errorMessage="We're sorry, you won't be able to chat with our Customer Support at the moment due to some error, Please try again later.">
        <PageTransistion>
          <Chat />
        </PageTransistion>
      </ErrorBoundaryComponent>
    ),
    requiresAuth: true,
  },
  {
    path: "/admin/*",
    element: (
      <ErrorBoundaryComponent errorMessage="Sorry, we're unable to show the Admin dashboard at the moment due to some error, Please try again later.">
        {/* <PageTransistion> */}
        <Admin />
        {/* </PageTransistion> */}
      </ErrorBoundaryComponent>
    ),
    requiresAuth: true,
  },
  {
    path: "*",
    element: (
      <PageTransistion>
        <NotFound />
      </PageTransistion>
    ),
    requiresAuth: false,
  },
];
