// Table columns for Managing Order
export const getOrderColumns = () => {
  const columns = [
    {
      field: "_id",
      headerName: "Product ID",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "product",
      headerName: "Product",
      minWidth: 300,
      flex: 1,
      renderCell: (params) => {
        return <p className="line-clamp-1">{params?.row?.product?.title}</p>;
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      renderCell: (params) => {
        return <p className="line-clamp-1">{params?.row?.quantity}</p>;
      },
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      renderCell: (params) => {
        const productDiscount = Number(
          params?.row?.product?.discountPrice?.toFixed(2)
        );

        return (
          <p className="line-clamp-1">{`₹${productDiscount?.toLocaleString()}`}</p>
        );
      },
    },
  ];

  return columns;
};
