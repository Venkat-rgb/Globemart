import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  useAddProductToWishlistMutation,
  useDeleteProductFromWishlistMutation,
} from "../../redux/features/wishlist/wishlistApiSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const LikeOrDislike = ({
  id,
  wishListProducts,
  placeOfUse,
  resetPagination,
}) => {
  // Keeps track of whether product is liked (or) disliked
  const [isLiked, setIsLiked] = useState(false);

  const { token } = useSelector((state) => state?.auth);

  const [addProductToWishlist, { isLoading: isProductAdding }] =
    useAddProductToWishlistMutation();

  const [deleteProductFromWishlist, { isLoading: isProductDeleting }] =
    useDeleteProductFromWishlistMutation();

  // Managing like (or) dislike of a product
  const wishlistHandler = async () => {
    try {
      // Adding product to wishlist and setting product is liked
      if (!isLiked) {
        const res = await addProductToWishlist({ productId: id }).unwrap();

        toast.success(res?.message);

        setIsLiked(true);
      } else {
        // Removing product from wishlist and setting product is disliked

        const res = await deleteProductFromWishlist({ productId: id }).unwrap();

        toast.success(res?.message);

        setIsLiked(false);

        if (placeOfUse === "wishlist") {
          resetPagination(id);
        }
      }
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Maintaining persistent like status of product even when page refreshes
  useEffect(() => {
    if (placeOfUse === "wishlist") {
      setIsLiked(true);
    } else if (wishListProducts?.length > 0) {
      const isProductLiked = wishListProducts?.find(
        (product) => product?.product?._id === id
      );
      if (isProductLiked) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeOfUse, wishListProducts]);

  return (
    <>
      {/* User can Like (or) Dislike only when he is logged in */}
      {token && (
        <div className="absolute top-4 right-4 bg-white drop-shadow-lg p-2 rounded-full">
          {!isLiked ? (
            <FavoriteBorderIcon
              className={`text-neutral-500 cursor-pointer ${
                isProductAdding ? "pointer-events-none" : ""
              }`}
              onClick={wishlistHandler}
            />
          ) : (
            <FavoriteIcon
              className={`text-pink-500 cursor-pointer ${
                isProductDeleting ? "pointer-events-none" : ""
              }`}
              onClick={wishlistHandler}
            />
          )}
        </div>
      )}
    </>
  );
};

export default LikeOrDislike;
