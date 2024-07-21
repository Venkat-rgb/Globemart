import RowActions from "../../../components/UI/RowActions";
import StatusStyle from "../../../components/UI/StatusStyle";

// Table columns for Managing Orders
export const getOrdersColumns = (placeOfUse, widthSizes) => {
  const columns = [
    {
      field: "_id",
      headerName: "Order ID",
      minWidth: widthSizes[0],
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      minWidth: widthSizes[1],
      renderCell: (params) => {
        return (
          <p className="line-clamp-1">{params?.row?.user?.customerName}</p>
        );
      },
    },

    {
      field: "finalTotalAmountInINR",
      headerName: "Total Order Amount",
      minWidth: widthSizes[2],
      renderCell: (params) => {
        return (
          <p>{`₹${params?.row?.finalTotalAmountInINR?.toLocaleString()}`}</p>
        );
      },
    },
    {
      field: "status",
      headerName: "Order Status",
      minWidth: widthSizes[3],
      renderCell: (params) => {
        return (
          <StatusStyle statusName={params?.row?.deliveryInfo?.deliveryStatus} />
        );
      },
    },
  ];

  if (placeOfUse === "Orders") {
    columns.push({
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      renderCell: (params) => {
        return (
          <RowActions
            size="small"
            route="/admin/order/update"
            id={params?.row?._id}
            placeOfUse="Orders"
          />
        );
      },
    });
  }

  return columns;
};
