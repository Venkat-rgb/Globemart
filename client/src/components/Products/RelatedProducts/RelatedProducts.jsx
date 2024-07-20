import { useGetProductsQuery } from "../../../redux/features/products/productsApiSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import ProductItem from "../ProductItem";
import { useGetWishlistQuery } from "../../../redux/features/wishlist/wishlistApiSlice";
import { useInView } from "react-intersection-observer";
import ErrorUI from "../../UI/ErrorUI";
import SmallLoader from "../../UI/SmallLoader";
import useMediaQuery from "@mui/material/useMediaQuery";

const RelatedProducts = ({
  productId,
  productCategory,
  currencyDataConversion,
}) => {
  const matches1 = useMediaQuery("(min-width:800px)");
  const matches2 = useMediaQuery("(min-width:550px)");
  const matches3 = useMediaQuery("(min-width:1024px)");

  let numOfSlidesToDisplay = 1;

  // Keeps track of whether RelatedProducts component is in viewport (or) not
  const { ref: relatedProductsRef, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  // Fetching Related Products data only when productCategory and isIntersecting are present
  const {
    data: productsData,
    isFetching: isProductsDataLoading,
    isError: productsDataError,
  } = useGetProductsQuery(`?category=${productCategory}`, {
    skip: !productCategory || !inView,
  });

  // Fetching Wishlist Products data only when viewport is intersecting
  const {
    data: wishlistData,
    isLoading: isWishlistDataLoading,
    isError: wishlistDataError,
  } = useGetWishlistQuery(undefined, {
    skip: !inView,
  });

  // Filtering products to not show current selected product in related products
  const filteredRelatedProducts =
    productsData?.products &&
    productsData?.products?.filter((product) => product?._id !== productId);

  // Setting number of slides to display
  if (matches1) {
    numOfSlidesToDisplay = 3;
  } else if (matches2) {
    numOfSlidesToDisplay = 2;
  }

  return (
    // Showing related products only if they are present
    <div
      className={`${
        filteredRelatedProducts?.length > 0 ? "border-t pt-10" : ""
      } space-y-4`}
      ref={relatedProductsRef}
    >
      {filteredRelatedProducts?.length > 0 && (
        <p className="font-public-sans text-center text-2xl drop-shadow  font-semibold text-neutral-600 max-[500px]:text-xl">
          Related Products
        </p>
      )}

      {/* Showing Loader while related products are loading */}
      {(isProductsDataLoading || isWishlistDataLoading) && (
        <SmallLoader styleProp="flex items-center justify-center h-[15vh]" />
      )}

      {/* Displaying error if there is an issue during fetching products! */}
      {productsDataError && wishlistDataError && (
        <ErrorUI message="Unable to fetch the related products!" />
      )}

      {/* Showing all related products inside a swiper so that we can scroll in x-axis */}
      <Swiper
        modules={[Scrollbar]}
        spaceBetween={matches3 ? 50 : 30}
        slidesPerView={numOfSlidesToDisplay}
        style={{
          padding: "2rem 0.5rem",
        }}
        scrollbar={{ draggable: true }}
      >
        {filteredRelatedProducts &&
          filteredRelatedProducts?.map((product) => (
            <SwiperSlide key={product?._id}>
              <ProductItem
                id={product?._id}
                image={product?.images[0]?.url}
                title={product?.title}
                description={product?.description}
                price={product?.price / currencyDataConversion}
                discountPrice={product?.discountPrice / currencyDataConversion}
                discount={product?.discount}
                rating={product?.rating}
                numOfReviews={product?.numOfReviews}
                skeletonWidth={350}
                skeletonHeight={208}
                // wishListProducts={wishlistData?.wishList?.products}
                wishListProducts={wishlistData?.wishList}
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default RelatedProducts;
