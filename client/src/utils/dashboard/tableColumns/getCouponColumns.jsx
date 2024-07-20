import RowActions from "../../../components/UI/RowActions";

// Table columns for Managing Coupon
export const getCouponColumns = (isCouponDeleting, deleteCouponHandler) => {
  const columns = [
    {
      field: "_id",
      headerName: "Coupon ID",
      minWidth: 240,
    },
    {
      field: "couponCode",
      headerName: "Coupon Code",
      minWidth: 210,
      renderCell: (params) => {
        return (
          <p className="font-bold text-neutral-400 bg-neutral-200 rounded text-xs py-1 px-2">
            {params?.row?.couponCode}
          </p>
        );
      },
    },
    {
      field: "occasionName",
      headerName: "Occasion Name",
      minWidth: 250,
    },
    {
      field: "discount",
      headerName: "Discount (%)",
      minWidth: 150,
    },
    {
      field: "couponStatus",
      headerName: "Coupon Status",
      minWidth: 160,
      renderCell: (params) => {
        const couponStatus = params?.row?.couponStatus;
        return (
          <p
            className={`${
              couponStatus === "active"
                ? "text-green-600 bg-green-100"
                : couponStatus === "inactive"
                ? "text-orange-400 bg-orange-100"
                : "text-red-400 bg-red-100"
            } px-3 py-1 rounded-full capitalize`}
          >
            {couponStatus}
          </p>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      renderCell: (params) => {
        return (
          <RowActions
            route="/admin/coupon/update"
            deleteHandler={deleteCouponHandler}
            id={params?.row?._id}
            isLoading={isCouponDeleting}
          />
        );
      },
    },
  ];

  return columns;
};
