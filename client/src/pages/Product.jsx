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
