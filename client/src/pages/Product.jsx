// import { Suspense, lazy, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Loader,
//   MetaData,
//   ProductDetails,
//   ProductExtraDetails,
//   ProductItem,
//   ReviewModal,
// } from "../components";
// import { useSelector, useDispatch } from "react-redux";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Scrollbar } from "swiper";
// import "swiper/css";
// import "swiper/css/scrollbar";
// import {
//   useGetProductQuery,
//   useGetProductsQuery,
// } from "../redux/features/products/productsApiSlice";
// const ReviewItem = lazy(() => import("../components/Reviews/ReviewItem"));

import { useParams } from "react-router-dom";
import { useGetProductQuery } from "../redux/features/products/productsApiSlice";
import { Loader, MetaData } from "../components";
import ReviewModal from "../components/Reviews/ReviewModal";
import ProductDetails from "../components/Products/ProductDetails/ProductDetails";
import ProductExtraDetails from "../components/Products/ProductExtraDetails/ProductExtraDetails";
import RelatedProducts from "../components/Products/RelatedProducts/RelatedProducts";
import ErrorBoundaryComponent from "../components/ErrorBoundary/ErrorBoundaryComponent";
import ErrorUI from "../components/UI/ErrorUI";
import useSessionStorage from "../hooks/basic/useSessionStorage";

const Product = () => {
  const { id } = useParams();

  const { getSessionData } = useSessionStorage();

  // const currencyData =
  //   sessionStorage.getItem("currencyData") &&
  //   JSON.parse(sessionStorage.getItem("currencyData"));

  const currencyData = getSessionData("currencyData");

  // Fetching the product data only when product 'id' is present
  const {
    data: productData,
    isFetching: isLoading,
    isError: productDataError,
  } = useGetProductQuery(id, {
    skip: !id,
  });

  // Showing Loader while product data is loading
  if (isLoading) {
    return <Loader styleProp="flex items-center justify-center h-[80vh]" />;
  }

  // Showing Error while products are unable to load due to some error
  if (productDataError) {
    return (
      <ErrorUI
        message="Unable to fetch details of Single Product!"
        styles="mt-32 w-1/2"
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-24 pb-12 px-3 space-y-10">
      <MetaData title="Product" />

      {/* <ReviewModal reviews={productData?.product?.reviews} /> */}

      {/* Product Review Modal */}
      <ReviewModal />

      {/* Showing Product details and handling Synchronous errors */}
      <ErrorBoundaryComponent errorMessage="Oops! Something went wrong while loading the Product Details. Please try again later.">
        <ProductDetails
          id={productData?.product?._id}
          images={productData?.product?.images}
          title={productData?.product?.title}
          price={productData?.product?.price / currencyData?.conversion}
          discountPrice={
            productData?.product?.discountPrice / currencyData?.conversion
          }
          discount={productData?.product?.discount}
          description={productData?.product?.description}
          category={productData?.product?.category}
          rating={productData?.product?.rating}
          numOfReviews={productData?.product?.numOfReviews}
          stock={productData?.product?.stock}
        />
      </ErrorBoundaryComponent>

      {/* Showing Extra product details like product features and customer reviews, also handling synchronous errors */}
      <ErrorBoundaryComponent errorMessage="Oops! Something went wrong while loading the Product Features. Please try again later.">
        {/* <ProductExtraDetails
          description={productData?.product?.description}
          productFeatures={productData?.product?.productFeatures}
          reviews={productData?.product?.reviews}
        /> */}
        <ProductExtraDetails
          description={productData?.product?.description}
          productFeatures={productData?.product?.productFeatures}
          productId={id}
        />
      </ErrorBoundaryComponent>

      {/* Showing all the Related products of the current selected product */}
      <ErrorBoundaryComponent errorMessage="Oops! Something went wrong while loading the Related Products. Please try again later.">
        <RelatedProducts
          productId={productData?.product?._id}
          productCategory={productData?.product?.category}
          currencyDataConversion={currencyData?.conversion}
        />
      </ErrorBoundaryComponent>
    </div>
  );
};

export default Product;

// New
// const Product = () => {
//   const { id } = useParams();

//   const { getSessionData } = useSessionStorage();

//   // const currencyData =
//   //   sessionStorage.getItem("currencyData") &&
//   //   JSON.parse(sessionStorage.getItem("currencyData"));

//   const currencyData = getSessionData("currencyData");

//   // Fetching the product data only when product 'id' is present
//   const {
//     data: productData,
//     isFetching: isLoading,
//     isError: productDataError,
//     isSuccess,
//   } = useGetProductQuery(id, {
//     skip: !id,
//   });

//   console.log("product data: ", productData);

//   // Showing Loader while product data is loading
//   if (isLoading) {
//     return <Loader styleProp="flex items-center justify-center h-[80vh]" />;
//   }

//   // Showing Error while products are unable to load due to some error
//   if (productDataError) {
//     return (
//       <ErrorUI
//         message="Unable to fetch details of Single Product!"
//         styles="mt-32 w-1/2"
//       />
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto pt-24 pb-12 space-y-10">
//       <MetaData title="Ecommercy | Product" />

//       {/* Product Review Modal */}
//       <ReviewModal reviews={productData?.product?.reviews} />

//       {/* Showing Product details and handling Synchronous errors */}
//       <ErrorBoundaryComponent errorMessage="Oops! Something went wrong while loading the Product Details. Please try again later.">
//         <ProductDetails
//           id={productData?.product?._id}
//           images={productData?.product?.images}
//           title={productData?.product?.title}
//           price={productData?.product?.price / currencyData?.conversion}
//           discountPrice={
//             productData?.product?.discountPrice / currencyData?.conversion
//           }
//           discount={productData?.product?.discount}
//           description={productData?.product?.description}
//           category={productData?.product?.category}
//           isLoading={isLoading}
//           isSuccess={isSuccess}
//           rating={productData?.product?.rating}
//           numOfReviews={productData?.product?.numOfReviews}
//           stock={productData?.product?.stock}
//           currencyData={currencyData}
//         />
//       </ErrorBoundaryComponent>

//       {/* Showing Extra product details like product features and customer reviews, also handling synchronous errors */}
//       <ErrorBoundaryComponent errorMessage="Oops! Something went wrong while loading the Product Features. Please try again later.">
//         <ProductExtraDetails
//           description={productData?.product?.description}
//           productFeatures={productData?.product?.productFeatures}
//           reviews={productData?.product?.reviews}
//         />
//       </ErrorBoundaryComponent>

//       {/* Showing all the Related products of the current selected product */}
//       <ErrorBoundaryComponent errorMessage="Oops! Something went wrong while loading the Related Products. Please try again later.">
//         <RelatedProducts
//           productId={productData?.product?._id}
//           productCategory={productData?.product?.category}
//           currencyDataConversion={currencyData?.conversion}
//         />
//       </ErrorBoundaryComponent>
//     </div>
//   );
// };

// const Product = () => {
//   const { id } = useParams();
//   const [tabValue, setTabValue] = useState(0);
//   const dispatch = useDispatch();

//   const currencyData =
//     sessionStorage.getItem("currencyData") &&
//     JSON.parse(sessionStorage.getItem("currencyData"));

//   const { isReviewModalOpen } = useSelector((state) => state.reviewModal);

//   const {
//     data: productData,
//     isFetching: isLoading,
//     isSuccess,
//   } = useGetProductQuery(id);

//   const { data: productsData, isFetching: isProductsDataLoading } =
//     useGetProductsQuery(
//       productData?.product?.category &&
//         `?category=${productData.product.category}`
//     );

//   const filteredRelatedProducts =
//     productsData?.products &&
//     productsData?.products?.filter(
//       (product) => product._id !== productData?.product?._id
//     );

//   // console.log("filteredRelatedProducts: ", filteredRelatedProducts);

//   console.log("product data: ", productData);

//   const tabValueChangeHandler = (e, newValue) => {
//     setTabValue(newValue);
//   };

//   if (isLoading || isProductsDataLoading) {
//     return <Loader styleProp="flex items-center justify-center h-[80vh]" />;
//   }

//   return (
//     <div className="max-w-6xl mx-auto pt-24 pb-12 space-y-10">
//       <MetaData title="Ecommercy | Product" />

//       <ReviewModal />

//       <ProductDetails
//         id={productData?.product?._id}
//         images={productData?.product?.images}
//         title={productData?.product?.title}
//         price={productData?.product?.price / currencyData?.conversion}
//         discountPrice={
//           productData?.product?.discountPrice / currencyData?.conversion
//         }
//         discount={productData?.product?.discount}
//         description={productData?.product?.description}
//         category={productData?.product?.category}
//         isLoading={isLoading}
//         isSuccess={isSuccess}
//         rating={productData?.product?.rating}
//         numOfReviews={productData?.product?.numOfReviews}
//         stock={productData?.product?.stock}
//         currencyData={currencyData}
//       />

//       <ProductExtraDetails
//         value={tabValue}
//         onChange={tabValueChangeHandler}
//         description={productData?.product?.description}
//         productFeatures={productData?.product?.productFeatures}
//         reviews={productData?.product?.reviews}
//         isLoading={isLoading}
//       />

//       {/* Show the below code when there are related products other wise dont show it! */}
//       <div className="space-y-4 border-t pt-10">
//         <p className="font-public-sans text-center text-2xl drop-shadow  font-semibold text-neutral-600">
//           Related Products
//         </p>
//         <Swiper
//           modules={[Scrollbar]}
//           spaceBetween={50}
//           slidesPerView={3}
//           style={{
//             padding: "2rem 0",
//           }}
//           scrollbar={{ draggable: true }}
//         >
//           {filteredRelatedProducts?.map((product, i) => (
//             <SwiperSlide key={product?._id}>
//               <ProductItem
//                 id={product?._id}
//                 image={product?.images[0]?.url}
//                 title={product?.title}
//                 description={product?.description}
//                 price={product?.price / currencyData?.conversion}
//                 discountPrice={
//                   product?.discountPrice / currencyData?.conversion
//                 }
//                 discount={product?.discount}
//                 rating={product?.rating}
//                 numOfReviews={product?.numOfReviews}
//                 skeletonWeight={350}
//                 skeletonHeight={208}
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default Product;
