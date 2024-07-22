import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { motion } from "framer-motion";
import OrderRow from "./OrderRow";

const OrderCollapseTable = ({
  page,
  rowsPerPage,
  newPageHandler,
  rowsPerPageHandler,
  ordersData,
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ delay: 0.2 }}
      >
        <TableContainer className="border-x border-t rounded">
          <Table>
            <TableHead className="bg-gradient-to-tr from-neutral-600 to-neutral-900">
              <TableRow>
                <TableCell>
                  <p className="font-inter font-semibold text-[0.95rem] tracking-tight text-neutral-200 max-[700px]:text-sm">
                    Order ID
                  </p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-inter font-semibold text-[0.95rem] tracking-tight text-neutral-200 max-[700px]:text-sm whitespace-nowrap">
                    Ordered Items
                  </p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-inter font-semibold text-[0.95rem] tracking-tight text-neutral-200 max-[700px]:text-sm whitespace-nowrap">
                    Total Amount
                  </p>
                </TableCell>
                <TableCell align="left">
                  <p className="font-inter font-semibold text-[0.95rem] tracking-tight text-neutral-200 max-[700px]:text-sm whitespace-nowrap">
                    Payment Status
                  </p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-inter font-semibold text-[0.95rem] tracking-tight text-neutral-200 max-[700px]:text-sm whitespace-nowrap">
                    Payment Mode
                  </p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-inter font-semibold text-[0.95rem] tracking-tight text-neutral-200 max-[700px]:text-sm whitespace-nowrap">
                    Order Status
                  </p>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Showing all orders of customer */}
              {ordersData?.orders?.map((order) => (
                <OrderRow key={order?._id} order={order} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      {/* Showing only 10 orders per page */}
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={ordersData?.totalOrdersCount ? ordersData.totalOrdersCount : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        hidden={ordersData?.totalOrdersCount <= 10 ? true : false}
        onPageChange={newPageHandler}
        onRowsPerPageChange={rowsPerPageHandler}
      />
    </>
  );
};

export default OrderCollapseTable;
