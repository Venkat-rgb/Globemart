import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setReviewModal } from "../../redux/features/slices/reviewModalSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress, Rating } from "@mui/material";
import toast from "react-hot-toast";
import GradeIcon from "@mui/icons-material/Grade";
import Button from "../UI/Button";
import {
  useCreateOrUpdateReviewMutation,
  useGetSingleReviewQuery,
} from "../../redux/features/reviews/reviewsApiSlice";
import SmallLoader from "../UI/SmallLoader";

const ReviewModalContent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Keeps track of customer rating
  const [rating, setRating] = useState(0);

  // Keeps track of customer review
  const [review, setReview] = useState("");

  // Fetching customer review
  const {
    data,
    isLoading: isReviewLoading,
    isError: isReviewError,
    error,
  } = useGetSingleReviewQuery(id);

  const [createOrUpdateReview, { isLoading }] =
    useCreateOrUpdateReviewMutation();

  // Handling adding and updating the product review
  const reviewSubmitHandler = async () => {
    try {
      const res = await createOrUpdateReview({
        productId: id,
        rating,
        review,
      }).unwrap();

      toast.success(res?.message);

      // Closing the modal after submitting the review
      dispatch(setReviewModal(false));
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Setting review data in state if customer has already given the review
  useEffect(() => {
    if (data?.review) {
      setRating(data?.review?.rating);
      setReview(data?.review?.review);
    }
  }, [data?.review]);

  // Handling error, if it occurs during fetching product review
  if (isReviewError) {
    console.error("ReviewModalContent error: ", error?.data?.message);
  }

  return (
    <div className="fixed w-80 top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 px-2.5 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{ opacity: 0, y: -30 }}
        className="p-4 font-public-sans space-y-3 rounded-xl shadow-2xl bg-white relative"
        key="modal"
      >
        <p className="font-semibold text-neutral-500 drop-shadow text-lg tracking-tight text-center">
          Give Review
        </p>

        {/* Showing Loader while customer review is loading*/}
        {isReviewLoading && (
          <SmallLoader styleProp="flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}

        <div className="flex flex-col gap-3">
          <Rating
            value={rating}
            precision={0.5}
            emptyIcon={
              <GradeIcon style={{ opacity: 0.5 }} fontSize="inherit" />
            }
            size="small"
            onChange={(e, newValue) => setRating(newValue)}
          />

          <textarea
            cols="30"
            rows="5"
            onChange={(e) => setReview(e.target.value)}
            value={review}
            className="outline-none border rounded py-1 px-2"
          />
        </div>

        <div className="flex items-center gap-4 justify-between">
          {/* Closing the Review modal when Cancel button is clicked */}
          <Button
            onClick={() => dispatch(setReviewModal(false))}
            moreStyles="w-20 text-sm"
          >
            Cancel
          </Button>

          {/* Submitting product review */}
          <Button
            onClick={reviewSubmitHandler}
            isLoading={isLoading}
            moreStyles="w-20 text-sm"
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewModalContent;

// import { motion } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import { setReviewModal } from "../../redux/features/slices/reviewModalSlice";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// // import { useAddOrUpdateReviewMutation } from "../../redux/features/products/productsApiSlice";
// import { CircularProgress, Rating } from "@mui/material";
// import toast from "react-hot-toast";
// import GradeIcon from "@mui/icons-material/Grade";
// import Button from "../UI/Button";
// import {
//   useCreateOrUpdateReviewMutation,
//   useGetSingleReviewQuery,
// } from "../../redux/features/reviews/reviewsApiSlice";
// import SmallLoader from "../UI/SmallLoader";

// const ReviewModalContent = ({ reviews }) => {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const { userInfo } = useSelector((state) => state?.auth);
//   const [addOrUpdateReview, { isLoading }] = useAddOrUpdateReviewMutation();

//   const [rating, setRating] = useState(0);
//   const [review, setReview] = useState("");

//   // Handling adding and updating the product review
//   const reviewSubmitHandler = async () => {
//     try {
//       const res = await addOrUpdateReview({
//         productId: id,
//         rating,
//         review,
//       }).unwrap();

//       console.log("review result: ", res);

//       toast.success(res?.message);

//       // Closing the modal after submitting the review
//       dispatch(setReviewModal(false));
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   // Storing review info if user has already gave the review (used in Updating review scenario)
//   useEffect(() => {
//     if (reviews?.length > 0) {
//       const currentUserReview = reviews?.find(
//         (review) => review?.user?.customerId === userInfo?.id
//       );

//       if (currentUserReview) {
//         setRating(currentUserReview?.rating);
//         setReview(currentUserReview?.review);
//       }
//     }
//   }, [reviews]);

//   return (
//     <div className="fixed w-80 top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{
//           opacity: 1,
//           y: 0,
//         }}
//         exit={{ opacity: 0, y: -30 }}
//         className="p-4 font-public-sans space-y-3 rounded-xl shadow-2xl bg-white"
//         key="modal"
//       >
//         <p className="font-semibold text-neutral-500 drop-shadow text-lg tracking-tight text-center">
//           Give Review
//         </p>

//         <div className="flex flex-col gap-3">
//           <Rating
//             value={rating}
//             precision={0.5}
//             emptyIcon={
//               <GradeIcon style={{ opacity: 0.5 }} fontSize="inherit" />
//             }
//             size="small"
//             onChange={(e, newValue) => setRating(newValue)}
//           />

//           <textarea
//             cols="30"
//             rows="5"
//             onChange={(e) => setReview(e.target.value)}
//             value={review}
//             className="outline-none border rounded py-1 px-2"
//           />
//         </div>

//         <div className="flex items-center gap-4 justify-between">
//           {/* Closing the Review modal when Cancel button is clicked */}
//           <Button
//             onClick={() => dispatch(setReviewModal(false))}
//             moreStyles="w-20 text-sm"
//           >
//             Cancel
//           </Button>

//           {/* Submitting product review */}
//           <Button
//             onClick={reviewSubmitHandler}
//             isLoading={isLoading}
//             moreStyles="w-20 text-sm"
//           >
//             {isLoading ? (
//               <CircularProgress color="inherit" size={20} />
//             ) : (
//               "Submit"
//             )}
//           </Button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// {
/* Submitting product review */
// }
// {
/* <motion.button
            className="flex items-center justify-center gap-2 font-inter bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 rounded-md py-1.5 px-4 w-20 font-medium shadow text-neutral-700 text-sm"
            whileTap={{ scale: 0.97 }}
            onClick={reviewSubmitHandler}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Submit"
            )}
          </motion.button> */
// }

// {
/* <motion.button
            className="flex items-center gap-2 font-inter bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 rounded-md py-1.5 px-4 font-medium shadow text-neutral-700 text-sm"
            whileTap={{ scale: 0.97 }}
            onClick={() => dispatch(setReviewModal(false))}
          >
            Cancel
          </motion.button> */
// }
