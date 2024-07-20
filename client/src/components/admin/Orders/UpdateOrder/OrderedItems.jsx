import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import { getOrderColumns } from "../../../../utils/dashboard/tableColumns/getOrderColumns";

const OrderedItems = ({ orderedProducts }) => {
  return (
    <motion.div
      className="drop-shadow-lg rounded-xl bg-neutral-50 p-3 col-span-4 w-full space-y-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ delay: 0.5 }}
    >
      <p className="text-neutral-400 font-bold border-b-[1px] inline-block font-inter uppercase">
        Ordered Items
      </p>

      {/* Showing all the orderedProducts of customer */}
      <DataGrid
        sx={{
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          fontFamily: "Inter",
        }}
        rows={orderedProducts}
        getRowId={(row) => row?._id}
        columns={getOrderColumns()}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        hideFooter={orderedProducts?.length <= 5 ? true : false}
      />
    </motion.div>
  );
};

export default OrderedItems;
