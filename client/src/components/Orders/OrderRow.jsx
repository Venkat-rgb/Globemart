import { useState } from "react";
import { IconButton, TableCell, TableRow, useMediaQuery } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { formatCurrency } from "../../utils/general/formatCurrency";
import OrderedItems from "./OrderedItems/OrderedItems";
import useSessionStorage from "../../hooks/basic/useSessionStorage";

const OrderRow = ({ order }) => {
  // Keeps track of whether to open orderedItems (or) not
  const [open, setOpen] = useState(false);

  // Returns true if screen is <= 700px and false if >700px
  const matches = useMediaQuery("(max-width:700px)");

  const { getSessionData } = useSessionStorage();

  const currencyData = getSessionData("currencyData");

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        {/* Order Id */}
        <TableCell sx={{ fontFamily: "Inter", fontSize: matches && "0.83rem" }}>
          {order?._id}
        </TableCell>

        {/* Opening and closing icon for viewing orderedItems */}
        <TableCell sx={{ fontFamily: "Inter" }} align="center">
          <IconButton size="small" onClick={() => setOpen((prev) => !prev)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        {/* Final amount paid for the order */}
        <TableCell
          sx={{ fontFamily: "Inter", fontSize: matches && "0.83rem" }}
          align="center"
        >
          {formatCurrency(
            order?.finalTotalAmountInINR / currencyData?.conversion
          )}
        </TableCell>

        {/* Payment status of order */}
        <TableCell
          sx={{ fontFamily: "Inter", fontSize: matches && "0.83rem" }}
          align="center"
        >
          <p
            className={`${
              order?.paymentInfo?.paymentStatus
                ? "bg-green-200 text-green-600 w-16"
                : "bg-red-100 text-red-500 w-20"
            } py-[0.15rem] rounded`}
          >
            {order?.paymentInfo?.paymentStatus ? "Paid" : "Not Paid"}
          </p>
        </TableCell>

        {/* Payment mode of order */}
        <TableCell
          sx={{ fontFamily: "Inter", fontSize: matches && "0.83rem" }}
          align="center"
        >
          <p>
            {order?.paymentInfo?.paymentMode === "online"
              ? "Stripe"
              : "Cash on Delivery"}
          </p>
        </TableCell>

        {/* Delivery status of order */}
        <TableCell
          sx={{ fontFamily: "Inter", fontSize: matches && "0.83rem" }}
          align="center"
        >
          <p
            className={`${
              order?.deliveryInfo?.deliveryStatus === "processing"
                ? "bg-red-100 text-red-500"
                : order?.deliveryInfo?.deliveryStatus === "shipped"
                ? "bg-orange-100 text-orange-500"
                : "bg-green-200 text-green-600"
            } py-[0.35rem] rounded-full capitalize max-[700px]:px-3`}
          >
            {order?.deliveryInfo?.deliveryStatus}
          </p>
        </TableCell>
      </TableRow>

      {/* Showing orderedItems */}
      <TableRow>
        <OrderedItems
          open={open}
          order={order}
          matches={matches}
          currencyDataConversion={currencyData?.conversion}
        />
      </TableRow>
    </>
  );
};

export default OrderRow;
