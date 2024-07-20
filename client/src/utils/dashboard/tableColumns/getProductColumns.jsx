import RowActions from "../../../components/UI/RowActions";
import RowImage from "../../../components/UI/RowImage";

// Table columns for Managing Products
export const getProductColumns = (isLoading, deleteProductHandler) => {
  const columns = [
    {
      field: "_id",
      headerName: "Product ID",
      width: 240,
    },
    {
      field: "title",
      headerName: "Product Name",
      minWidth: 550,
      renderCell: (params) => {
        return (
          <RowImage
            title={params?.row?.title}
            image={params?.row?.images[0]?.url}
          />
        );
      },
    },
    {
      field: "price",
      headerName: "Price (₹)",
      // flex: 1,
      minWidth: 50,
      renderCell: (params) => {
        return <p>{params?.row?.price?.toLocaleString()}</p>;
      },
    },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 100,
      renderCell: (params) => {
        return <p>{params?.row?.stock?.toLocaleString()}</p>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      // flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <RowActions
            route="/admin/product/update"
            deleteHandler={deleteProductHandler}
            id={params?.row?._id}
            isLoading={isLoading}
          />
        );
      },
    },
  ];

  return columns;
};
