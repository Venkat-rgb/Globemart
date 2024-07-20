import { memo } from "react";
import { motion } from "framer-motion";
import { Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GradeIcon from "@mui/icons-material/Grade";
import { formatCurrency } from "../../utils/general/formatCurrency";
import LazyImage from "../LazyImage";
import LikeOrDislike from "../Wishlist/LikeOrDislike";

const ProductItem = ({
  id,
  image,
  title,
  price,
  discount,
  discountPrice,
  rating,
  numOfReviews,
  skeletonWidth,
  skeletonHeight,
  wishListProducts,
  placeOfUse,
  resetPagination,
}) => {
  const navigate = useNavigate();
  // const ref = useRef(null);
  // const isInView = useInView(ref, { once: true });

  return (
    /*
     initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -40 }}
      transition={{ delay: 0.25 }}
    */
    <motion.div
      className="shadow-md rounded-xl pb-4 font-inter bg-white"
      // ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
    >
      <div className="relative overflow-hidden h-[201px] border-b-[1px] border-neutral-200 rounded-t-xl rounded-b-3xl">
        {/* Product Image */}
        {/* <div onClick={() => navigate(`/product/${id}`)}>
          <LazyImage
            imageProps={{
              src: image,
              alt: `product-image-${id}`,
              className:
                "object-cover rounded-t-xl rounded-b-3xl h-52 w-full hover:scale-110 transition-all duration-150 cursor-pointer",
            }}
            skeletonWidth={skeletonWidth}
            skeletonHeight={skeletonHeight}
          />
        </div> */}
        <div onClick={() => navigate(`/product/${id}`)}>
          <LazyImage
            imageProps={{
              src: image,
              alt: `product-image-${id}`,
            }}
            // styleProp={`rounded-t-xl rounded-b-3xl`}
            // styleProp={`w-[${skeletonWidth}px] h-[${skeletonHeight}px]`}
            styleProp={`rounded-t-xl rounded-b-3xl`}
            skeletonWidth={skeletonWidth}
            skeletonHeight={skeletonHeight}
          />
        </div>

        {/* Add (or) Remove product in wishlist */}
        <LikeOrDislike
          id={id}
          wishListProducts={wishListProducts}
          placeOfUse={placeOfUse}
          resetPagination={resetPagination}
        />
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Product title */}
        <p className="font-semibold text-[1.05rem] text-neutral-600 drop-shadow line-clamp-1">
          {title}
        </p>

        <div className="flex items-center gap-2">
          {/* Product Rating */}
          <Rating
            value={rating ? rating : 0}
            precision={0.5}
            readOnly
            emptyIcon={
              <GradeIcon style={{ opacity: 0.5 }} fontSize="inherit" />
            }
            size="small"
          />

          {/* Product Review count */}
          <p className="text-neutral-400 font-medium">({numOfReviews})</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Discount price (price considered while adding to cart) */}
          <p className="font-semibold text-neutral-600">
            {formatCurrency(discountPrice)}
          </p>
          <div className="flex items-center gap-2">
            {/* Real MRP price */}
            <span className="font-semibold text-neutral-400 text-sm">
              <del>{formatCurrency(price)}</del>
            </span>

            {/* Discount percentage */}
            <span className="font-semibold text-neutral-400 text-sm line-clamp-1">
              {`(${discount}% off)`}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProductItem);

// const ProductItem = ({
//   id,
//   image,
//   title,
//   price,
//   discount,
//   discountPrice,
//   rating,
//   numOfReviews,
//   skeletonWidth,
//   skeletonHeight,
//   wishListProducts,
// }) => {
//   const [isLiked, setIsLiked] = useState(false);
//   const navigate = useNavigate();
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true });
//   const isUserLoggedIn = localStorage.getItem("token");

//   const [addProductToWishlist, { isLoading: isProductAdding }] =
//     useAddProductToWishlistMutation();

//   const [deleteProductFromWishlist, { isLoading: isProductDeleting }] =
//     useDeleteProductFromWishlistMutation();

//   const wishlistHandler = async () => {
//     try {
//       if (!isLiked) {
//         const res = await addProductToWishlist({ productId: id }).unwrap();

//         toast.success(res?.message);

//         setIsLiked(true);
//       } else {
//         const res = await deleteProductFromWishlist({ productId: id }).unwrap();

//         toast.success(res?.message);

//         setIsLiked(false);
//       }
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   useEffect(() => {
//     if (wishListProducts?.length > 0) {
//       const isProductLiked = wishListProducts?.find(
//         (product) => product?.product?._id === id
//       );
//       if (isProductLiked) {
//         setIsLiked(true);
//       } else {
//         setIsLiked(false);
//       }
//     }
//   }, [wishListProducts]);

//   return (
//     /*
//      initial={{ opacity: 0, y: -40 }}
//       animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -40 }}
//       transition={{ delay: 0.25 }}
//     */
//     <motion.div
//       className="shadow-md rounded-xl pb-4 font-inter bg-white"
//       ref={ref}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: isInView ? 1 : 0 }}
//       transition={{ delay: 0.25 }}
//     >
//       <div className="relative overflow-hidden border-b-[1px] border-neutral-200 rounded-t-xl rounded-b-3xl">
//         <div onClick={() => navigate(`/product/${id}`)}>
//           <LazyImage
//             imageProps={{
//               src: image,
//               alt: `product-image-${id}`,
//               className:
//                 "object-cover rounded-t-xl rounded-b-3xl h-52 w-full hover:scale-110 transition-all duration-150 cursor-pointer",
//             }}
//             skeletonWidth={skeletonWidth}
//             skeletonHeight={skeletonHeight}
//           />
//         </div>

//         {isUserLoggedIn && (
//           <div className="absolute top-4 right-4 bg-white drop-shadow-lg p-2 rounded-full">
//             {!isLiked ? (
//               <FavoriteBorderIcon
//                 className={`text-neutral-500 cursor-pointer ${
//                   isProductAdding ? "pointer-events-none" : ""
//                 }`}
//                 onClick={wishlistHandler}
//               />
//             ) : (
//               <FavoriteIcon
//                 className={`text-pink-500 cursor-pointer ${
//                   isProductDeleting ? "pointer-events-none" : ""
//                 }`}
//                 onClick={wishlistHandler}
//               />
//             )}
//           </div>
//         )}
//       </div>
//       <div className="px-4 pt-4 space-y-3">
//         <p className="font-semibold text-[1.05rem] text-neutral-600 drop-shadow line-clamp-1">
//           {title}
//         </p>

//         <div className="flex items-center gap-2">
//           <Rating
//             value={rating ? rating : 0}
//             precision={0.5}
//             readOnly
//             emptyIcon={
//               <GradeIcon style={{ opacity: 0.5 }} fontSize="inherit" />
//             }
//             size="small"
//           />

//           <p className="text-neutral-400 font-medium">({numOfReviews})</p>
//         </div>

//         <div className="flex items-center gap-4">
//           <p className="font-semibold text-neutral-600">
//             {formatCurrency(discountPrice)}
//           </p>
//           <div className="flex items-center gap-2">
//             <span className="font-semibold text-neutral-400 text-sm">
//               <del>{formatCurrency(price)}</del>
//             </span>
//             <span className="font-semibold text-neutral-400 text-sm line-clamp-1">
//               {`(${discount}% off)`}
//             </span>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };
