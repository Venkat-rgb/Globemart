import { DataGrid } from "@mui/x-data-grid";
import { useGetAllOrdersQuery } from "../../../redux/features/order/orderApiSlice";
import Loader from "../../UI/Loader";
import { getOrdersColumns } from "../../../utils/dashboard/tableColumns/getOrdersColumns";
import ErrorUI from "../../UI/ErrorUI";

const LatestOrders = () => {
  // Fetching customers ordersData
  const {
    data: ordersData,
    isLoading: isOrdersDataLoading,
    isError,
  } = useGetAllOrdersQuery();

  // Displaying Loading screen while ordersData is being fetched
  if (isOrdersDataLoading) {
    return <Loader styleProp="flex items-center justify-center" />;
  }

  return (
    <div className="p-3 space-y-4">
      <p className="font-inter font-semibold text-neutral-500 text-lg drop-shadow">
        Latest Transactions
      </p>

      {/* Showing errMsg, if an error occured during fetching the Latest orders */}
      {isError && (
        <ErrorUI message="Unable to fetch Latest orders due to some error!" />
      )}

      {!isError && (
        <div className="w-full">
          {/* Displaying first 10 latest orders of customers */}
          {ordersData?.orders?.length > 0 && (
            <DataGrid
              sx={{
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                  outline: "none !important",
                },
                fontFamily: "Inter",
              }}
              rows={ordersData?.orders}
              getRowId={(row) => row?._id}
              paginationModel={{ page: 0, pageSize: 10 }}
              columns={getOrdersColumns("Latest-Orders", [350, 350, 250, 120])}
              hideFooter
            />
          )}

          {/* Showing empty text when ordersData are not available in database */}
          {ordersData?.orders?.length === 0 && (
            <p className="text-center text-2xl text-neutral-500 font-public-sans font-semibold">
              No latest transactions have been made yet!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LatestOrders;
