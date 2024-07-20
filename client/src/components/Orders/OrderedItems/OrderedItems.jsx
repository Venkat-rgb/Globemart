import {
  Box,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import OrderedItem from "./OrderedItem";

const OrderedItems = ({ open, order, matches, currencyDataConversion }) => {
  return (
    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
      {/* Opening (or) Closing orderedItems based on 'open' state */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ margin: 1 }} className="space-y-3">
          <p className="font-inter text-xl font-medium text-neutral-600 drop-shadow underline underline-offset-4 decoration-dotted tracking-tight max-[500px]:text-lg">
            Ordered Items
          </p>
          <Table size="small" className="border">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontFamily: "Inter",
                  }}
                >
                  <p className="font-inter font-semibold text-[0.95rem] tracking-tight  text-neutral-500 whitespace-nowrap">
                    Product Name
                  </p>
                </TableCell>
                <TableCell sx={{ fontFamily: "Inter" }} align="center">
                  <p className="font-inter font-semibold text-[0.95rem] tracking-tight  text-neutral-500">
                    Quantity
                  </p>
                </TableCell>
                <TableCell sx={{ fontFamily: "Inter" }} align="center">
                  <p className="font-inter font-semibold text-[0.95rem] tracking-tight  text-neutral-500">
                    Price (single)
                  </p>
                </TableCell>
                <TableCell sx={{ fontFamily: "Inter" }} align="right">
                  <p className="font-inter font-semibold text-[0.95rem] tracking-tight  text-neutral-500 whitespace-nowrap">
                    Ordered Date
                  </p>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Showing all orderedItems of an order */}
              {order?.products?.map((item) => {
                const productDiscount = Number(
                  item?.product?.discountPrice?.toFixed(2)
                );

                return (
                  <OrderedItem
                    key={item?._id}
                    matches={matches}
                    productTitle={item?.product?.title}
                    productQty={item?.quantity}
                    productDiscount={productDiscount}
                    productsOrderedDate={order?.productsOrderedDate}
                    currencyDataConversion={currencyDataConversion}
                  />
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    </TableCell>
  );
};

export default OrderedItems;
