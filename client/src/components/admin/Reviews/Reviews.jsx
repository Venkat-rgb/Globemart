import { useEffect, useRef, useState } from "react";
import MetaData from "../../MetaData";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import RateReviewIcon from "@mui/icons-material/RateReview";
import Layout from "../Layout";
import InputDivStyle from "../../../components/UI/InputDivStyle";
import toast from "react-hot-toast";
import Button from "../../UI/Button";
import { getReviewColumns } from "../../../utils/dashboard/tableColumns/getReviewColumns";
import {
  useDeleteReviewMutation,
  useLazyGetReviewsQuery,
} from "../../../redux/features/reviews/reviewsApiSlice";

const Reviews = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Keeps track of input which will search reviews based on productId
  const productIdRef = useRef();

  const [
    getReviews,
    {
      data,
      isLoading: isGetReviewsLoading,
      isFetching: isGetReviewsFetching,
      isError: getReviewsError,
    },
  ] = useLazyGetReviewsQuery();

  const [deleteReview, { isLoading: isDeleteReviewLoading }] =
    useDeleteReviewMutation();

  // Making API request to delete review of product based on reviewId
  const deleteReviewHandler = async (reviewId) => {
    const trimmedProductId = productIdRef?.current?.value?.trim();

    try {
      // Deleting the review
      const res = await deleteReview({
        productId: trimmedProductId,
        reviewId,
      }).unwrap();

      // Displaying review deletion successfull message
      toast.success(res?.message);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Making API request to fetch product reviews
  const getSearchedReviewsHandler = async () => {
    try {
      const trimmedProductId = productIdRef?.current?.value?.trim();

      // Fetching reviews only when productId is present
      if (trimmedProductId?.length > 0) {
        const res = await getReviews(
          {
            id: trimmedProductId,
            page: paginationModel.page,
            pageLimit: paginationModel.pageSize,
          },
          {
            preferCacheValue: true,
          }
        ).unwrap();
      }
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Searching reviews of product when page changes
  useEffect(() => {
    getSearchedReviewsHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page]);

  return (
    <Layout>
      <motion.div
        className="h-full space-y-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          delay: 0.2,
        }}
      >
        <MetaData title="Dashboard | Reviews" />
        <div className="p-3 drop-shadow-xl bg-neutral-50 space-y-5 max-w-md mt-10 mx-auto">
          <p className="font-public-sans text-2xl max-[500px]:text-xl text-neutral-500 text-center font-semibold">
            Search Review
          </p>

          <div className="font-public-sans w-full space-y-3">
            {/* Search Reviews Input */}
            <InputDivStyle>
              <RateReviewIcon className="text-neutral-400" />

              {/* Optimizing input using ref to avoid unnecessary re-renders */}
              <input
                type="text"
                placeholder="Enter Product Id..."
                className="outline-none w-full px-4"
                required
                ref={productIdRef}
              />
            </InputDivStyle>

            {/* Search Button with loading values */}
            <Button
              onClick={getSearchedReviewsHandler}
              isLoading={isGetReviewsLoading}
              moreStyles="w-full"
            >
              {isGetReviewsLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <p className="text-neutral-300 font-inter font-medium">
                    Searching
                  </p>
                  <CircularProgress sx={{ color: "#cccccc" }} size={22} />
                </div>
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>

        {/* Showing 10 reviews per page */}
        {!getReviewsError && data?.totalReviewsCount > 0 && (
          <DataGrid
            sx={{
              "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
              fontFamily: "Inter",
            }}
            rows={data?.reviews}
            getRowId={(row) => row?._id}
            rowHeight={65}
            columns={getReviewColumns(
              isDeleteReviewLoading,
              deleteReviewHandler
            )}
            loading={isGetReviewsFetching}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10]}
            paginationMode="server"
            rowCount={data?.totalReviewsCount}
            hideFooter={data?.totalReviewsCount <= 10 ? true : false}
          />
        )}

        {/* Showing empty text when there are no reviews available in database */}
        {!getReviewsError && data?.totalReviewsCount === 0 && (
          <p className="text-center text-2xl text-neutral-500 font-public-sans font-semibold max-[500px]:text-xl">
            No Reviews found for this product!
          </p>
        )}
      </motion.div>
    </Layout>
  );
};

export default Reviews;
