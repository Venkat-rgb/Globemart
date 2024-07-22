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

  return (
    <motion.div
      className="shadow-md rounded-xl pb-4 font-inter bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
    >
      <div className="relative overflow-hidden h-[201px] border-b-[1px] border-neutral-200 rounded-t-xl rounded-b-3xl">
        {/* Product Image */}
        <div onClick={() => navigate(`/product/${id}`)}>
          <LazyImage
            imageProps={{
              src: image,
              alt: `product-image-${id}`,
            }}
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
