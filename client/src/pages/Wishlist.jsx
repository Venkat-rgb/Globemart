import { Link } from "react-router-dom";
import { MetaData, Loader, SmallLoader } from "../components";
import { motion } from "framer-motion";
import WishlistImage from "../assets/images/basic/wishlistImage.jpeg";
import { CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useDeleteTotalWishlistMutation,
  useLazyGetWishlistQuery,
} from "../redux/features/wishlist/wishlistApiSlice";
import toast from "react-hot-toast";
import LazyImage from "../components/LazyImage";
import ProductItem from "../components/Products/ProductItem";
import useSessionStorage from "../hooks/basic/useSessionStorage";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { BsArrowUpShort } from "react-icons/bs";

const Wishlist = () => {
  const { getSessionData } = useSessionStorage();

  const currencyData = getSessionData("currencyData");

  // Keeps track of current page which is used for pagination
  const [page, setPage] = useState(1);

  // Keeps track of paginated wishlistProducts
  const [wishListProducts, setWishListProducts] = useState([]);

  // Keeps track of lastElement of the wishlist
  const { ref: lastElementRef, inView } = useInView({
    threshold: 0.2,
  });

  const [
    getWishlist,
    {
      data: wishlistData,
      isLoading: isProductsLoading,
      isFetching: isProductsFetching,
    },
  ] = useLazyGetWishlistQuery();

  const [deleteTotalWishlist, { isLoading: isWishlistDeleting }] =
    useDeleteTotalWishlistMutation();

  // Making API request to delete all products from wishlist
  const clearWishlistHandler = async () => {
    try {
      if (wishlistData?.totalWishlistCount > 0) {
        const res = await deleteTotalWishlist().unwrap();

        toast.success(res?.message);

        // Resetting the wishlist products and page number back to initial
        setWishListProducts([]);
        setPage(1);
      }
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Fetching wishlist products
  const getWishlistProductsHandler = async (page) => {
    try {
      const wishlistRes = await getWishlist(page).unwrap();

      console.log("wishlistRes: ", wishlistRes);

      if (wishlistRes?.wishList) {
        setWishListProducts((prev) => [...prev, ...wishlistRes.wishList]);
      }
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Function used for filtering the wishlist products after deleting single product
  const resetPagination = useCallback(
    (productId) => {
      const filteredProducts = wishListProducts?.filter(
        (item) => item?.product?._id !== productId
      );

      setWishListProducts(filteredProducts);
    },
    [wishListProducts]
  );

  // Fetching wishlist products
  useEffect(() => {
    getWishlistProductsHandler(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Implementing Infinite scroll and incrementing page number when lastElement is in view
  useEffect(() => {
    // Incrementing page number only when lastElement is in view and current page number is < totalWishlistProducts count
    if (inView && page < Math.ceil(wishlistData?.totalWishlistCount / 9)) {
      setPage((prev) => prev + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Showing Loader when products in wishlist are loading
  if (isProductsLoading) {
    return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
  }

  return (
    <div className="max-w-[82rem] mx-auto pt-24 pb-10 px-4 space-y-10 relative">
      <MetaData title="Wishlist" />

      <div className="flex items-center justify-between max-[500px]:flex-col gap-4">
        <p className="font-public-sans font-semibold text-2xl max-[500px]:text-xl text-neutral-600 drop-shadow">
          Your Wishlist
        </p>
        <div className="flex items-center justify-center gap-5">
          <Link to="/products">
            <motion.button
              className="font-inter bg-neutral-100 rounded-md py-1 px-3 font-medium text-[0.9rem]"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              + Add to Wishlist
            </motion.button>
          </Link>

          {/* Deleting whole wishlist */}
          <motion.button
            className="font-inter bg-neutral-100 rounded-md py-1 px-2 font-medium text-[0.9rem] flex items-center gap-2"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={clearWishlistHandler}
            disabled={isWishlistDeleting}
          >
            {isWishlistDeleting ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <DeleteIcon fontSize="small" className="text-neutral-500" />
            )}
            <p>Clear Wishlist</p>
          </motion.button>
        </div>
      </div>

      {/* Showing an image when no products are present in wishlist */}
      {(wishlistData?.totalWishlistCount === 0 ||
        wishListProducts.length === 0) && (
        <div className="flex items-center justify-center mx-auto w-[50%] max-[900px]:w-full rounded-xl pt-5">
          <LazyImage
            imageProps={{
              src: WishlistImage,
              alt: "wishlist-img",
              // className: `object-cover rounded-xl -mt-10`,
            }}
            styleProp="rounded-xl"
            skeletonWidth={640}
            skeletonHeight={401}
          />
        </div>
      )}

      {/* Showing all products when they are fully loaded */}
      <div className="grid grid-cols-4 max-[1100px]:grid-cols-3 max-[800px]:grid-cols-2 max-[500px]:grid-cols-1 gap-y-12 gap-x-4">
        {wishListProducts?.map((product) => (
          <ProductItem
            key={product?.product?._id}
            id={product?.product?._id}
            image={product?.product?.images[0]?.url}
            title={product?.product?.title}
            price={product?.product?.price / currencyData?.conversion}
            discountPrice={
              product?.product?.discountPrice / currencyData?.conversion
            }
            discount={product?.product?.discount}
            rating={product?.product?.rating}
            numOfReviews={product?.product?.numOfReviews}
            placeOfUse="wishlist"
            skeletonWidth={312}
            skeletonHeight={208}
            resetPagination={resetPagination}
          />
        ))}

        {/* Last element which helps in infinite scroll */}
        <div ref={lastElementRef} />
      </div>

      {/* Showing Loader when products are fetching based on pagination */}
      {isProductsFetching && (
        <SmallLoader styleProp="flex items-center justify-center" />
      )}

      {/* Showing below message only when products length is more than 1 page length (which is 9 products) */}
      {wishlistData?.totalWishlistCount ? (
        <div className="font-inter flex items-center justify-center">
          {wishListProducts.length === wishlistData?.totalWishlistCount ? (
            <p className=" drop-shadow text-neutral-500">
              You have reached the end!
            </p>
          ) : (
            <></>
          )}

          {/* Showing scroll to top button only when wishlistProducts contain atleast single page products (which is > 9 per page) */}
          {wishListProducts.length > 9 && (
            <button
              className="p-1 rounded-full bg-indigo-500 text-[#f1f1f1] fixed right-10 bottom-10"
              onClick={() => window.scrollTo(0, 0)}
            >
              <BsArrowUpShort size={30} />
            </button>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Wishlist;
