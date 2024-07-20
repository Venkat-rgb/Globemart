import { Suspense, lazy, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DescriptionIcon from "@mui/icons-material/Description";
import { MdOutlineRateReview } from "react-icons/md";
import TabPanel from "../../Reviews/TabPanel";
import ProductFeatures from "./ProductFeatures";
import ErrorBoundaryComponent from "../../ErrorBoundary/ErrorBoundaryComponent";
import { wait } from "../../../utils/general/wait";
import SmallLoader from "../../UI/SmallLoader";
import useMediaQuery from "@mui/material/useMediaQuery";

// const ProductReviews = lazy(() => );
const ProductReviews = lazy(() =>
  wait(500).then(() => import("./ProductReviews"))
);

const ProductExtraDetails = ({ description, productFeatures, productId }) => {
  // Keeps track of Product detail tabs
  const [tabValue, setTabValue] = useState(0);

  const matches = useMediaQuery("(max-width:500px)");

  const tabValueChangeHandler = (e, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <div>
        <Tabs
          value={tabValue}
          onChange={tabValueChangeHandler}
          indicatorColor="secondary"
          textColor="secondary"
          variant="fullWidth"
        >
          <Tab
            icon={<DescriptionIcon />}
            iconPosition="start"
            label="Description"
            sx={{
              fontFamily: "Inter",
              letterSpacing: "0px",
              borderBottom: "1px solid #d9dedb",
              fontSize: matches ? "0.8rem" : "14px",
            }}
          />
          <Tab
            icon={<MdOutlineRateReview className="text-[1.45rem]" />}
            iconPosition="start"
            label="Reviews"
            sx={{
              fontFamily: "Inter",
              letterSpacing: "0px",
              borderBottom: "1px solid #d9dedb",
              fontSize: matches ? "0.8rem" : "14px",
            }}
          />
        </Tabs>
      </div>

      {/* Displaying details like Product description, Product features */}
      <TabPanel value={tabValue} index={0}>
        <ProductFeatures
          description={description}
          productFeatures={productFeatures}
        />
      </TabPanel>

      {/* Displaying Product Reviews */}
      <TabPanel value={tabValue} index={1}>
        {/* Handling Synchronous errors in Product Reviews */}
        <ErrorBoundaryComponent errorMessage="Sorry, the product reviews are not available right now. Please check back later.">
          <Suspense
            fallback={
              <SmallLoader styleProp="flex items-center justify-center" />
            }
          >
            <ProductReviews productId={productId} />
          </Suspense>
        </ErrorBoundaryComponent>
      </TabPanel>
    </>
  );
};

export default ProductExtraDetails;

// New
// const ProductExtraDetails = ({ description, productFeatures, reviews }) => {
//   // Keeps track of Product detail tabs
//   const [tabValue, setTabValue] = useState(0);

//   const tabValueChangeHandler = (e, newValue) => {
//     setTabValue(newValue);
//   };

//   console.log("ProductExtraDetails rendered!");

//   return (
//     <>
//       <div>
//         <Tabs
//           value={tabValue}
//           onChange={tabValueChangeHandler}
//           indicatorColor="secondary"
//           textColor="secondary"
//           variant="fullWidth"
//         >
//           <Tab
//             icon={<DescriptionIcon />}
//             iconPosition="start"
//             label="Description"
//             sx={{
//               fontFamily: "Inter",
//               letterSpacing: "0px",
//               borderBottom: "1px solid #d9dedb",
//             }}
//           />
//           <Tab
//             icon={<MdOutlineRateReview className="text-[1.45rem]" />}
//             iconPosition="start"
//             label="Reviews"
//             sx={{
//               fontFamily: "Inter",
//               letterSpacing: "0px",
//               borderBottom: "1px solid #d9dedb",
//             }}
//           />
//         </Tabs>
//       </div>

//       {/* Displaying details like Product description, Product features */}
//       <TabPanel value={tabValue} index={0}>
//         <ProductFeatures
//           description={description}
//           productFeatures={productFeatures}
//         />
//       </TabPanel>

//       {/* Displaying Product Reviews */}
//       <TabPanel value={tabValue} index={1}>
//         {/* Handling Synchronous errors in Product Reviews */}
//         <ErrorBoundaryComponent errorMessage="Sorry, the product reviews are not available right now. Please check back later.">
//           <Suspense
//             fallback={
//               <SmallLoader styleProp="flex items-center justify-center" />
//             }
//           >
//             <ProductReviews reviews={reviews} />
//           </Suspense>
//         </ErrorBoundaryComponent>
//       </TabPanel>
//     </>
//   );
// };

// const ProductExtraDetails = ({ description, productFeatures, reviews }) => {
//   const [readMore, setReadMore] = useState(false);
//   const [tabValue, setTabValue] = useState(0);
//   const [filteredReviews, setFilteredReviews] = useState(reviews);
//   const [sortType, setSortType] = useState(sortOptions[0]);

//   const formattedReviews = readMore
//     ? filteredReviews
//     : filteredReviews?.slice(0, 5);

//   const formattedFeatures = productFeatures
//     ?.split("\r\n")
//     ?.map((feature) => feature.split(":"));

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

//   const tabValueChangeHandler = (e, newValue) => {
//     setTabValue(newValue);
//   };

//   useEffect(() => {
//     if (reviews) {
//       const newReviews = reviewSortFilter(sortType.value, reviews);
//       setFilteredReviews(newReviews);
//     }
//   }, [reviews, sortType.value]);

//   return (
//     <>
//       <div>
//         <Tabs
//           value={tabValue}
//           onChange={tabValueChangeHandler}
//           indicatorColor="secondary"
//           textColor="secondary"
//           variant="fullWidth"
//         >
//           <Tab
//             icon={<DescriptionIcon />}
//             iconPosition="start"
//             label="Description"
//             sx={{
//               fontFamily: "Inter",
//               letterSpacing: "0px",
//               borderBottom: "1px solid #d9dedb",
//             }}
//           />
//           <Tab
//             icon={<MdOutlineRateReview className="text-[1.45rem]" />}
//             iconPosition="start"
//             label="Reviews"
//             sx={{
//               fontFamily: "Inter",
//               letterSpacing: "0px",
//               borderBottom: "1px solid #d9dedb",
//             }}
//           />
//         </Tabs>
//       </div>
//       <TabPanel value={tabValue} index={0}>
//         <motion.div
//           className="max-w-4xl mx-auto space-y-8 p-4"
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//         >
//           <p className="leading-loose font-inter text-neutral-500 font-medium border-b pb-10">
//             {description}
//           </p>

//           <div className="space-y-5">
//             <p className="font-public-sans text-center text-xl drop-shadow font-semibold text-neutral-600">
//               About this item
//             </p>

//             <div className="space-y-4">
//               {formattedFeatures?.map((feature, i) => (
//                 <div key={i}>
//                   <span className="leading-loose font-public-sans text-neutral-600 font-bold">
//                     {feature[0]} :
//                   </span>
//                   <span className="leading-loose font-inter text-neutral-500 font-medium">
//                     {feature[1]}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </motion.div>
//       </TabPanel>
//       <TabPanel value={tabValue} index={1}>
//         <motion.div
//           className="max-w-5xl mx-auto space-y-7 relative"
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           {formattedReviews?.length > 1 && (
//             <Select
//               placeholder="Select sort type..."
//               className="font-inter w-48"
//               options={sortOptions}
//               onChange={(newValue) => setSortType(newValue)}
//               value={sortType}
//             />
//           )}

//           {formattedReviews?.map((review) => (
//             <ReviewItem
//               key={review?._id}
//               image={review?.user?.customerProfileImg?.url}
//               alt={`customer-id-${review?.user?.customerId}`}
//               customerName={review?.user?.customerName}
//               time={review?.reviewUpdatedAt}
//               rating={review?.rating}
//               review={review?.review}
//             />
//           ))}

//           {reviews?.length > 5 && (
//             <div className="flex items-center justify-center">
//               <button
//                 className="bg-indigo-600 px-4 py-1 rounded-full shadow-lg transition-all duration-300 font-medium text-[#f1f1f1] flex items-center justify-center font-inter text-sm"
//                 onClick={readMoreHandler}
//               >
//                 {readMore ? "Read less" : "Read more"}
//               </button>
//             </div>
//           )}

//           {formattedReviews?.length === 0 && (
//             <p className="font-inter text-center text-xl font-medium text-neutral-500 ">
//               No Reviews Given, Please add one!
//             </p>
//           )}
//         </motion.div>
//       </TabPanel>
//     </>
//   );
// };
