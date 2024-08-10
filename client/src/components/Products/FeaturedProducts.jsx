import ProductItem from "./ProductItem";
import { useInView } from "react-intersection-observer";
import { useGetFeaturedProductsQuery } from "../../redux/features/products/productsApiSlice";
import { useGetWishlistQuery } from "../../redux/features/wishlist/wishlistApiSlice";
import SmallLoader from "../UI/SmallLoader";
import ErrorUI from "../UI/ErrorUI";
import useSessionStorage from "../../hooks/basic/useSessionStorage";
import { useSelector } from "react-redux";

const FeaturedProducts = ({ featuredProductsRef }) => {
  // Used for fetching products only when component is inView
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const { getSessionData } = useSessionStorage();

  const { token } = useSelector((state) => state?.auth);

  const currencyData = getSessionData("currencyData");

  const {
    data: productsData,
    isLoading: isProductsDataLoading,
    isError: productsDataError,
  } = useGetFeaturedProductsQuery(undefined, {
    skip: !inView,
  });

  // Fetching wishlist data to show whether product is liked (or) not
  const { data: wishlistData, isError: wishlistDataError } =
    useGetWishlistQuery(undefined, {
      skip: !inView || !token,
    });

  console.log("Featured Products bro: ", productsData);

  return (
    <section className="space-y-10" ref={featuredProductsRef}>
      <p
        className="font-public-sans font-semibold text-2xl text-neutral-600 drop-shadow max-[550px]:text-[1.2rem]"
        ref={ref}
      >
        Featured Products With Best Deals
      </p>

      {/* Showing Loader while featured products are loading */}
      {isProductsDataLoading && (
        <SmallLoader styleProp="flex items-center justify-center" />
      )}

      {(productsDataError || wishlistDataError) && (
        <ErrorUI message="Unable to fetch Featured Products!" />
      )}

      {productsData?.products?.length === 0 && (
        <p className="font-public-sans text-xl font-medium text-neutral-500 w-full text-center pt-10">
          No Featured Products Found!
        </p>
      )}

      {/* Showing Featured products */}
      <div className="grid grid-cols-4 max-[1100px]:grid-cols-3 max-[850px]:grid-cols-2 max-[550px]:grid-cols-1 gap-y-12 gap-x-4">
        {inView &&
          !isProductsDataLoading &&
          productsData?.products?.map((product) => (
            <ProductItem
              key={product?._id}
              id={product?._id}
              image={product?.images[0]?.url}
              title={product?.title}
              price={product?.price / currencyData?.conversion}
              discountPrice={product?.discountPrice / currencyData?.conversion}
              discount={product?.discount}
              rating={product?.rating}
              numOfReviews={product?.numOfReviews}
              skeletonWidth={312}
              skeletonHeight={208}
              wishListProducts={wishlistData?.wishList}
            />
          ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
