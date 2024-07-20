import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Select from "react-select";
import { sortOptions } from "../../../utils/general/productSortOptions";
import ReviewItem from "../../Reviews/ReviewItem";
import { reviewSortFilter } from "../../../utils/general/reviewSortFilter";
import { useLazyGetReviewsQuery } from "../../../redux/features/reviews/reviewsApiSlice";
import SmallLoader from "../../UI/SmallLoader";
import toast from "react-hot-toast";

const ProductReviews = ({ productId }) => {
  // Keeps track of whether to read more reviews (or) not
  const [readMore, setReadMore] = useState(false);

  // Keeps track of paginated reviews
  const [filteredReviews, setFilteredReviews] = useState([]);

  // Keeps track of sortType which can be used to sort reviews based on this type
  const [sortType, setSortType] = useState(sortOptions[0]);

  // Keeps track of page number which is useful for paginating reviews
  const [page, setPage] = useState(0);

  // Fetching Product reviews
  const [getReviews, { data, isLoading, isFetching }] =
    useLazyGetReviewsQuery();

  // Handles logic for reading more reviews (or) not
  const readMoreHandler = () => {
    if (readMore) {
      window.scrollTo({
        top: 400,
        behavior: "smooth",
      });

      // Resetting the states as we clicked on Read less button
      setPage(0);
      setReadMore(false);
      setFilteredReviews([]);
    } else {
      // Incrementing page number only when its less than total number of pages available for product reviews
      if (page < Math.ceil(data?.totalReviewsCount / 5) - 1) {
        setPage((prev) => prev + 1);
      }
    }
  };

  // Fetching product reviews
  const getReviewsHandler = async () => {
    try {
      // Caching the product reviews to avoid duplicate requests
      const reviewRes = await getReviews(
        {
          id: productId,
          page,
          pageLimit: 5,
        },
        {
          preferCacheValue: true,
        }
      ).unwrap();

      let newReviews;

      if (reviewRes?.reviews) {
        newReviews = [...filteredReviews, ...reviewRes.reviews];
      }

      // Sorting the reviews
      const sortedReviews = reviewSortFilter(sortType.value, newReviews);

      // Storing the sortedReviews in filteredReviews state array
      setFilteredReviews(sortedReviews);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Initially making API request to get totalReviewsCount
  useEffect(() => {
    if (!data?.totalReviewsCount) {
      getReviewsHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (data?.totalReviewsCount) {
      // Fetching product reviews only when current page < totalReviews pages available
      if (page <= Math.ceil(data?.totalReviewsCount / 5) - 1) {
        getReviewsHandler();
      }

      // If no more reviews are available, then setting readMore to true and rendering 'show less' button
      if (page === Math.ceil(data?.totalReviewsCount / 5) - 1) {
        setReadMore(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Sorting reviews if sort type changes
  useEffect(() => {
    const sortedReviews = reviewSortFilter(sortType.value, filteredReviews);

    setFilteredReviews(sortedReviews);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType.value]);

  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-7 relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.2 }}
    >
      {/* Review Sorting options */}
      {data?.totalReviewsCount > 1 && (
        <Select
          placeholder="Select sort type..."
          className="font-inter w-52 text-sm"
          options={sortOptions}
          onChange={(newValue) => setSortType(newValue)}
          value={sortType}
        />
      )}

      {/* Showing loader while inital reviews are loading */}
      {isLoading && (
        <SmallLoader styleProp="flex items-center justify-center" />
      )}

      {/* Showing all reviews */}
      {filteredReviews?.map((review) => (
        <ReviewItem
          key={review?._id}
          image={review?.user?.customerProfileImg?.url}
          alt={`customer-id-${review?.user?.customerId}`}
          customerName={review?.user?.customerName}
          time={review?.updatedAt}
          rating={review?.rating}
          review={review?.review}
        />
      ))}

      {/* Showing loader while paginated reviews are loading */}
      {page > 0 && isFetching && (
        <SmallLoader styleProp="flex items-center justify-center" />
      )}

      {/* Showing the below button only when there are atleast 5 products reviews */}
      {data?.totalReviewsCount > 5 && (
        <div className="flex items-center justify-center">
          <button
            className="bg-neutral-700 px-4 py-1 rounded-full shadow-lg transition-all duration-300 font-medium text-[#f1f1f1] flex items-center justify-center font-inter text-sm"
            onClick={readMoreHandler}
          >
            {readMore ? "Read less" : "Read more"}
          </button>
        </div>
      )}

      {/* If no reviews are found for this product */}
      {!isLoading && data?.totalReviewsCount === 0 && (
        <p className="font-inter text-center text-xl max-[500px]:text-lg font-medium text-neutral-500 ">
          No Reviews Given, Please add one!
        </p>
      )}
    </motion.div>
  );
};

export default ProductReviews;

// const ProductReviews = ({ productId }) => {
//   console.log("ProductReviews!");

//   // Keeps track of whether to read more reviews (or) not
//   const [readMore, setReadMore] = useState(false);

//   // Keeps track of paginated reviews
//   const [filteredReviews, setFilteredReviews] = useState([]);

//   // Keeps track of sortType which can be used to sort reviews based on this type
//   const [sortType, setSortType] = useState(sortOptions[0]);

//   // Keeps track of page number which is useful for paginating reviews
//   const [page, setPage] = useState(0);

//   // Fetching Product reviews
//   const { data, isLoading, isFetching, isError, error } = useGetReviewsQuery({
//     id: productId,
//     page,
//     pageLimit: 5,
//   });

//   console.log("productReviews: ", filteredReviews);

//   // Handles logic for reading more reviews (or) not
//   const readMoreHandler = () => {
//     if (readMore) {
//       window.scrollTo({
//         top: 400,
//         behavior: "smooth",
//       });

//       // Resetting the states as we clicked on Read less button
//       setPage(0);
//       setReadMore(false);
//       setFilteredReviews([]);
//     } else {
//       // Incrementing page number only when its less than total number of pages available for product reviews
//       if (page < Math.ceil(data?.totalReviewsCount / 5) - 1) {
//         setPage((prev) => prev + 1);
//       }
//     }
//   };

//   // If no more reviews are available, then setting readMore to true and rendering 'show less' button
//   useEffect(() => {
//     if (page === Math.ceil(data?.totalReviewsCount / 5) - 1) {
//       setReadMore(true);
//     }
//   }, [page]);

//   // Storing reviews in filteredReviews
//   useEffect(() => {
//     if (data?.reviews) {
//       const tempReviews = [...filteredReviews, ...data?.reviews];

//       const newReviews = reviewSortFilter(sortType.value, tempReviews);

//       setFilteredReviews(newReviews);
//     }
//   }, [data?.reviews]);

//   // Sorting reviews if sort type changes
//   useEffect(() => {
//     const sortedReviews = reviewSortFilter(sortType.value, filteredReviews);

//     setFilteredReviews(sortedReviews);
//   }, [sortType.value]);

//   // Handling error, if it occurs during fetching product reviews
//   if (isError) {
//     console.error("ProductReviews error: ", error?.data?.message);
//   }

//   return (
//     <motion.div
//       className="max-w-5xl mx-auto space-y-7 relative"
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 20 }}
//       transition={{ delay: 0.2 }}
//     >
//       {/* Review Sorting options */}
//       {data?.totalReviewsCount > 1 && (
//         <Select
//           placeholder="Select sort type..."
//           className="font-inter w-52 text-sm"
//           options={sortOptions}
//           onChange={(newValue) => setSortType(newValue)}
//           value={sortType}
//         />
//       )}

//       {/* Showing loader while inital reviews are loading */}
//       {isLoading && (
//         <SmallLoader styleProp="flex items-center justify-center" />
//       )}

//       {/* Showing all reviews */}
//       {filteredReviews?.map((review) => (
//         <ReviewItem
//           key={review?._id}
//           image={review?.user?.customerProfileImg?.url}
//           alt={`customer-id-${review?.user?.customerId}`}
//           customerName={review?.user?.customerName}
//           time={review?.updatedAt}
//           rating={review?.rating}
//           review={review?.review}
//         />
//       ))}

//       {/* Showing loader while paginated reviews are loading */}
//       {page > 0 && isFetching && (
//         <SmallLoader styleProp="flex items-center justify-center" />
//       )}

//       {/* Showing the below button only when there are atleast 5 products reviews */}
//       {data?.totalReviewsCount > 5 && (
//         <div className="flex items-center justify-center">
//           <button
//             className="bg-indigo-600 px-4 py-1 rounded-full shadow-lg transition-all duration-300 font-medium text-[#f1f1f1] flex items-center justify-center font-inter text-sm"
//             onClick={readMoreHandler}
//           >
//             {readMore ? "Read less" : "Read more"}
//           </button>
//         </div>
//       )}

//       {/* If no reviews are found for this product */}
//       {!isLoading && data?.totalReviewsCount === 0 && (
//         <p className="font-inter text-center text-xl font-medium text-neutral-500 ">
//           No Reviews Given, Please add one!
//         </p>
//       )}
//     </motion.div>
//   );
// };

// const ProductReviews = () => {
//   const [readMore, setReadMore] = useState(false);
//   const [filteredReviews, setFilteredReviews] = useState(reviews);
//   const [sortType, setSortType] = useState(sortOptions[0]);

//   const formattedReviews = readMore
//     ? filteredReviews
//     : filteredReviews?.slice(0, 5);

//   const readMoreHandler = () => {
//     if (readMore) {
//       setReadMore(false);
//       window.scrollTo({
//         top: 400,
//         behavior: "smooth",
//       });
//     } else {
//       setReadMore(true);
//     }
//   };

//   /*
//     const [page, setPage] = useState(1);

//     const readMoreHandler = () => {
//       const totalPages = Math.ceil(reviews?.length / 5);

//       const formattedReviews = filteredReviews.slice(0, 5 * page);

//       if(page <= totalPages) {
//         setReadMore(true);
//       }
//       else {
//         setReadMore(false);
//       }
//     };

//   */

//   // Setting reviews based on sort type
//   useEffect(() => {
//     if (reviews) {
//       const newReviews = reviewSortFilter(sortType.value, reviews);
//       setFilteredReviews(newReviews);
//     }
//   }, [reviews, sortType.value]);

//   return (
//     <motion.div
//       className="max-w-5xl mx-auto space-y-7 relative"
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 20 }}
//       transition={{ delay: 0.2 }}
//     >
//       {/* Review Sorting options */}
//       {formattedReviews?.length > 1 && (
//         <Select
//           placeholder="Select sort type..."
//           className="font-inter w-48"
//           options={sortOptions}
//           onChange={(newValue) => setSortType(newValue)}
//           value={sortType}
//         />
//       )}

//       {/* Showing all reviews */}
//       {formattedReviews?.map((review) => (
//         <ReviewItem
//           key={review?._id}
//           image={review?.user?.customerProfileImg?.url}
//           alt={`customer-id-${review?.user?.customerId}`}
//           customerName={review?.user?.customerName}
//           time={review?.reviewUpdatedAt}
//           rating={review?.rating}
//           review={review?.review}
//         />
//       ))}

//       {reviews?.length > 5 && (
//         <div className="flex items-center justify-center">
//           <button
//             className="bg-indigo-600 px-4 py-1 rounded-full shadow-lg transition-all duration-300 font-medium text-[#f1f1f1] flex items-center justify-center font-inter text-sm"
//             onClick={readMoreHandler}
//           >
//             {readMore ? "Read less" : "Read more"}
//           </button>
//         </div>
//       )}

//       {/* If no reviews are found for this product */}
//       {formattedReviews?.length === 0 && (
//         <p className="font-inter text-center text-xl font-medium text-neutral-500 ">
//           No Reviews Given, Please add one!
//         </p>
//       )}
//     </motion.div>
//   );
// };
