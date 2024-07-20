import { useDispatch, useSelector } from "react-redux";
import { setReviewModal } from "../../redux/features/slices/reviewModalSlice";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import ErrorBoundaryComponent from "../ErrorBoundary/ErrorBoundaryComponent";
import SmallLoader from "../UI/SmallLoader";

const ReviewModalContent = lazy(() => import("./ReviewModalContent"));

const ReviewBackdrop = ({ onClick }) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-40 w-full h-full z-50"
      onClick={onClick}
    />
  );
};

const ReviewModal = () => {
  const dispatch = useDispatch();

  const { isReviewModalOpen } = useSelector((state) => state?.reviewModal);

  return (
    <>
      {/* Creating portal for black overlay in background when modal opens */}
      {createPortal(
        isReviewModalOpen && (
          <ReviewBackdrop onClick={() => dispatch(setReviewModal(false))} />
        ),
        document.getElementById("backdrop")
      )}

      {/* Creating portal for Review modal */}
      {createPortal(
        <AnimatePresence>
          {isReviewModalOpen && (
            <ErrorBoundaryComponent errorMessage="Oops! Something went wrong while loading the Review Modal. Please try again later.">
              <Suspense
                fallback={
                  <SmallLoader styleProp="flex items-center justify-center" />
                }
              >
                <ReviewModalContent />
              </Suspense>
            </ErrorBoundaryComponent>
          )}
        </AnimatePresence>,
        document.getElementById("modal")
      )}
    </>
  );
};

export default ReviewModal;

// const ReviewModal = ({ reviews }) => {
//   const dispatch = useDispatch();

//   const { isReviewModalOpen } = useSelector((state) => state.reviewModal);

//   return (
//     <>
//       {/* Creating portal for black overlay in background when modal opens */}
//       {createPortal(
//         isReviewModalOpen && (
//           <ReviewBackdrop onClick={() => dispatch(setReviewModal(false))} />
//         ),
//         document.getElementById("backdrop")
//       )}

//       {/* Creating portal for Review modal */}
//       {createPortal(
//         <AnimatePresence>
//           {isReviewModalOpen && <ReviewModalContent reviews={reviews} />}
//         </AnimatePresence>,
//         document.getElementById("modal")
//       )}
//     </>
//   );
// };
