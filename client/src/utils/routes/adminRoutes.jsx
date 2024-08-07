import { lazy } from "react";
import { wait } from "../general/wait";
import ErrorBoundaryComponent from "../../components/ErrorBoundary/ErrorBoundaryComponent";

const delay = 200;

const Dashboard = lazy(() =>
  wait(delay).then(() => import("../../components/admin/Dashboard/Dashboard"))
);
const Products = lazy(() =>
  wait(delay).then(() => import("../../components/admin/Products/Products"))
);
const Coupons = lazy(() =>
  wait(delay).then(() => import("../../components/admin/Coupons/Coupons"))
);
const Orders = lazy(() =>
  wait(delay).then(() => import("../../components/admin/Orders/Orders"))
);
const Users = lazy(() =>
  wait(delay).then(() => import("../../components/admin/Users/Users"))
);
const Chats = lazy(() =>
  wait(delay).then(() => import("../../components/admin/Chats/Chats"))
);
const Reviews = lazy(() =>
  wait(delay).then(() => import("../../components/admin/Reviews/Reviews"))
);
const CreateAndUpdateProduct = lazy(() =>
  wait(delay).then(() =>
    import("../../components/admin/Products/CreateAndUpdateProduct")
  )
);
const CreateAndUpdateCoupon = lazy(() =>
  wait(delay).then(() =>
    import("../../components/admin/Coupons/CreateAndUpdateCoupon")
  )
);
const UpdateUser = lazy(() =>
  wait(delay).then(() => import("../../components/admin/Users/UpdateUser"))
);
const UpdateOrder = lazy(() =>
  wait(delay).then(() =>
    import("../../components/admin/Orders/UpdateOrder/UpdateOrder")
  )
);

export const adminRoutes = [
  {
    path: "/",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to show dashboard due to some error, please try again later!"
        styles="mt-14"
      >
        <Dashboard />
      </ErrorBoundaryComponent>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to show dashboard due to some error, please try again later!"
        styles="mt-14"
      >
        <Dashboard />
      </ErrorBoundaryComponent>
    ),
  },
  {
    path: "/products",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to show products inventory due to some error, please try again later!"
        styles="mt-14"
      >
        <Products />
      </ErrorBoundaryComponent>
    ),
  },
  {
    path: "/coupons",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to show available coupons due to some error, please try again later!"
        styles="mt-14"
      >
        <Coupons />
      </ErrorBoundaryComponent>
    ),
  },
  {
    path: "/orders",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to show customer orders due to some error, please try again later!"
        styles="mt-14"
      >
        <Orders />
      </ErrorBoundaryComponent>
    ),
  },
  {
    path: "/users",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to show all customers due to some error, please try again later!"
        styles="mt-14"
      >
        <Users />
      </ErrorBoundaryComponent>
    ),
  },
  {
    path: "/chats",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to show customer chats due to some error, please try again later!"
        styles="mt-14"
      >
        <Chats />
      </ErrorBoundaryComponent>
    ),
  },
  {
    path: "/reviews",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to show product reviews due to some error, please try again later!"
        styles="mt-14"
      >
        <Reviews />
      </ErrorBoundaryComponent>
    ),
  },
  {
    path: "/product/create",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to create new product due to some error, please try again later!"
        styles="mt-14"
      >
        <CreateAndUpdateProduct role="Create" />
      </ErrorBoundaryComponent>
    ),
  },
  {
    path: "/product/update/:productId",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to update the product due to some error, please try again later!"
        styles="mt-14"
      >
        <CreateAndUpdateProduct role="Update" />
      </ErrorBoundaryComponent>
    ),
  },
  {
    path: "/coupon/create",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to create new coupon due to some error, please try again later!"
        styles="mt-14"
      >
        <CreateAndUpdateCoupon role="Create" />
      </ErrorBoundaryComponent>
    ),
  },
  {
    path: "/coupon/update/:couponId",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to update the coupon due to some error, please try again later!"
        styles="mt-14"
      >
        <CreateAndUpdateCoupon role="Update" />
      </ErrorBoundaryComponent>
    ),
  },
  {
    path: "/user/update/:userId",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to update user's role due to some error, please try again later!"
        styles="mt-14"
      >
        <UpdateUser />
      </ErrorBoundaryComponent>
    ),
  },
  {
    path: "/order/update/:orderId",
    element: (
      <ErrorBoundaryComponent
        errorMessage="Sorry, unable to update customer's order status due to some error, please try again later!"
        styles="mt-14"
      >
        <UpdateOrder />
      </ErrorBoundaryComponent>
    ),
  },
];
