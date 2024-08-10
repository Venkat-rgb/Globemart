import { useCallback, useEffect, useRef, useState } from "react";
import { Loader, MetaData } from "../components";
import { Pagination } from "@mui/material";
import { useGetProductsQuery } from "../redux/features/products/productsApiSlice";
import { useGetWishlistQuery } from "../redux/features/wishlist/wishlistApiSlice";
import ProductItem from "../components/Products/ProductItem";
import CategoriesSection from "../components/Products/Categories/CategoriesSection";
import ErrorUI from "../components/UI/ErrorUI";
import useSessionStorage from "../hooks/basic/useSessionStorage";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";

const Products = () => {
  const { getSessionData } = useSessionStorage();
  const matches = useMediaQuery("(max-width:600px)");
  const productsRef = useRef();

  const currencyData = getSessionData("currencyData");

  // Keeps track of product category selected
  const [selectedCategory, setSelectedCategory] = useState("");

  // Keeps track of all the filters which are selected
  const [filters, setFilters] = useState("");

  // Keeps track of current page, which is useful for pagination
  const [page, setPage] = useState(1);

  const { token } = useSelector((state) => state?.auth);

  // Here im skipping the request bcz if filters is '' then also a request is being made. so basically i only want to make request with some basic filters set. so here only one request is made.
  const {
    data: productsData,
    isFetching: areProductsLoading,
    isError: productsDataError,
  } = useGetProductsQuery(filters, {
    skip: !filters,
  });

  // Fetching wishlist data to show whether product is liked (or) not
  const {
    data: wishlistData,
    isError: wishlistDataError,
    error: wishlistError,
  } = useGetWishlistQuery(undefined, {
    skip: !token,
  });

  // Setting all the filters
  const setUrl = useCallback(
    (category, priceRange, rating, page, sort) => {
      const firstPriceRange = Number(
          (priceRange[0] * currencyData?.conversion).toFixed(2)
        ),
        secondPriceRange = Number(
          (priceRange[1] * currencyData?.conversion).toFixed(2)
        );

      const reqFields = `&fields=_id,title,price,createdAt,numOfReviews,rating,discount,discountPrice`;

      let query = `?discountPrice[gte]=${firstPriceRange}&discountPrice[lte]=${secondPriceRange}&rating[gte]=${rating}&page=${page}&sort=${sort}${reqFields}`;

      if (category) {
        query = `?category=${category}&discountPrice[gte]=${firstPriceRange}&discountPrice[lte]=${secondPriceRange}&rating[gte]=${rating}&page=${page}&sort=${sort}${reqFields}`;
      }

      setFilters(query);
    },
    [currencyData?.conversion]
  );

  // Whenever products change due to filters, we scroll to top of the page
  useEffect(() => {
    if (matches) {
      window.scrollTo({
        top: productsRef?.current?.offsetTop,
        behavior: "smooth",
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [productsData?.products, matches]);

  // Handling error, if occured during fetching wishlist
  if (wishlistDataError) {
    console.log("Products wishlist error: ", wishlistError?.data?.message);
  }

  return (
    <section className="space-y-10 max-[600px]:space-y-5 max-w-7xl mx-auto max-[600px]:pt-20 pt-24 pb-12 px-4 bg-gradient-to-br ">
      <MetaData title="Products" />

      <div className="flex items-center justify-center gap-4">
        <p className="font-public-sans font-semibold text-2xl max-[600px]:text-xl text-neutral-600 drop-shadow text-center">
          All Products
        </p>
      </div>

      <div className="flex items-start relative max-[600px]:flex-wrap gap-10">
        {/* Showing all the product categories available */}

        <CategoriesSection
          setUrl={setUrl}
          setFilters={setFilters}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          currencyDataConversion={currencyData?.conversion}
          page={page}
          setPage={setPage}
        />

        <div
          className="flex-[4_4_0%] max-[600px]:flex-auto space-y-10"
          ref={productsRef}
        >
          {/* Showing Loader while products are loading */}
          {areProductsLoading && (
            <Loader styleProp="flex items-center justify-center h-[65vh]" />
          )}

          {/* Showing errorMsg, if an error occured during fetching products */}
          {productsDataError && <ErrorUI message="Unable to fetch products!" />}

          {/* Showing all the products once they are loaded */}
          <div
            // className="grid grid-cols-3 max-[1100px]:grid-cols-2 max-[800px]:grid-cols-1 gap-4 flex-[4_4_0%]"
            className="grid grid-cols-3 max-[1100px]:grid-cols-2 max-[800px]:grid-cols-1 max-[600px]:grid-cols-2 max-[500px]:grid-cols-1 gap-4"
          >
            {!areProductsLoading &&
              productsData?.products?.map((product) => (
                <ProductItem
                  key={product?._id}
                  id={product?._id}
                  image={product?.images[0]?.url}
                  title={product?.title}
                  // description={product?.description}
                  price={product?.price / currencyData?.conversion}
                  discount={product?.discount}
                  discountPrice={
                    product?.discountPrice / currencyData?.conversion
                  }
                  rating={product?.rating}
                  numOfReviews={product?.numOfReviews}
                  skeletonWidth={312}
                  skeletonHeight={208}
                  wishListProducts={wishlistData?.wishList}
                />
              ))}

            {productsData?.products?.length === 0 && (
              <p className="font-public-sans text-2xl font-medium text-neutral-500 w-full mx-72 max-[600px]:mx-0 max-[600px]:text-xl text-center pt-10">
                No Products Found! Please change your filters
              </p>
            )}
          </div>

          {/* Showing Pagination only when products exists */}
          {!areProductsLoading && productsData?.totalProductsCount > 9 && (
            <div className="flex items-center justify-center">
              <Pagination
                count={
                  productsData?.totalProductsCount &&
                  Math.ceil(productsData.totalProductsCount / 9)
                }
                page={page}
                onChange={(e, value) => setPage(value)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
