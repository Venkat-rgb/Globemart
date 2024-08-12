import MetaData from "../../MetaData";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import Layout from "../Layout";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../../redux/features/products/productsApiSlice";
import toast from "react-hot-toast";
import Loader from "../../UI/Loader";
import { getProductColumns } from "../../../utils/dashboard/tableColumns/getProductColumns";
import ErrorUI from "../../UI/ErrorUI";
import { useState } from "react";

const Products = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Fetching all productsData
  const {
    data: productsData,
    isFetching: isProductsDataFetching,
    isLoading: isProductsDataLoading,
    isError: productsDataError,
  } = useGetProductsQuery(
    `?fields=title,price,stock&page=${paginationModel.page + 1}`
  );

  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  // Making API request to delete product based on ID from database
  const deleteProductHandler = async (productId) => {
    try {
      const res = await deleteProduct(productId).unwrap();
      toast.success(res?.message);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Showing Loader while products are loading
  if (isProductsDataLoading) {
    return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
  }

  return (
    <Layout>
      <motion.div
        className="h-full space-y-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          delay: 0.2,
        }}
      >
        <MetaData title="Dashboard | Products" />
        {/* here when u call the api and fetch the products then use loading
          attribute in DataGrid so that loader will be rendered before the content. */}

        <div className="flex items-center justify-between">
          <p
            className="font-public-sans tracking-tight text-2xl text-neutral-500 font-semibold drop-shadow"
            style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)" }}
          >
            All Products
          </p>

          {/* Link to create new product */}
          <Link
            className="font-inter text-sm font-semibold bg-neutral-700 text-white py-1 px-2 rounded shadow-md flex items-center"
            to="/admin/product/create"
          >
            <AddIcon fontSize="small" />
            Create
          </Link>
        </div>

        {/* Showing errMsg, if an error occured during fetching products */}
        {productsDataError && (
          <ErrorUI message="Unable to fetch products due to some error!" />
        )}

        {/* Displaying 10 products per page */}
        {!productsDataError && productsData?.totalProductsCount > 0 && (
          <DataGrid
            sx={{
              "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
              fontFamily: "Inter",
            }}
            rows={productsData?.products}
            getRowId={(row) => row?._id}
            rowHeight={60}
            columns={getProductColumns(isLoading, deleteProductHandler)}
            loading={isProductsDataFetching}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10]}
            paginationMode="server"
            rowCount={productsData?.totalProductsCount}
            hideFooter={productsData?.totalProductsCount <= 10 ? true : false}
          />
        )}

        {/* Showing empty text when there are no productsData available in database */}
        {!productsDataError && productsData?.totalProductsCount === 0 && (
          <p className="text-center text-2xl text-neutral-500 font-public-sans font-semibold max-[500px]:text-xl">
            Products are empty, please add some!
          </p>
        )}
      </motion.div>
    </Layout>
  );
};

export default Products;
