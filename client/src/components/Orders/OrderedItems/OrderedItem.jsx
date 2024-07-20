import { TableCell, TableRow } from "@mui/material";
import { formatCurrency } from "../../../utils/general/formatCurrency";

const OrderedItem = ({
  matches,
  productTitle,
  productQty,
  productDiscount,
  productsOrderedDate,
  currencyDataConversion,
}) => {
  return (
    <TableRow>
      <TableCell
        sx={{
          fontFamily: "Inter",
          fontSize: matches && "0.83rem",
        }}
      >
        {productTitle}
      </TableCell>

      <TableCell
        sx={{
          fontFamily: "Inter",
          fontSize: matches && "0.83rem",
        }}
        align="center"
      >
        {productQty}
      </TableCell>

      {/* Dynamic(all countries currency) Price of single quantity item */}
      <TableCell
        sx={{
          fontFamily: "Inter",
          fontSize: matches && "0.83rem",
        }}
        align="center"
      >
        {formatCurrency(productDiscount / currencyDataConversion)}
      </TableCell>

      {/* Product ordered date */}
      <TableCell
        sx={{
          fontFamily: "Inter",
          fontSize: matches && "0.83rem",
        }}
        align="right"
      >
        {new Date(productsOrderedDate).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
};

export default OrderedItem;
