import { useEffect, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Rating } from "@mui/material";
import GradeIcon from "@mui/icons-material/Grade";
import { formatCurrency } from "../../../utils/general/formatCurrency";
import toast from "react-hot-toast";
import ProductImages from "./ProductImages";
import ProductDetailButtons from "./ProductDetailButtons";
import { useSelector } from "react-redux";

const ProductDetails = ({
  id,
  images,
  price,
  discount,
  discountPrice,
  stock,
  title,
  rating,
  numOfReviews,
  description,
  category,
}) => {
  // Keeps track of product quantity selected by customer
  const [quantity, setQuantity] = useState(1);

  const { token } = useSelector((state) => state?.auth);

  // Customer can increase product quanitity till the stock of that product and not more
  const increaseQuantityHandler = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(
        `Stock left is only ${stock}, you can't add more than ${stock} products`
      );
    }
  };

  const decreaseQuantityHandler = () => {
    // Handling case when customer enters -ve number in search input.
    if (quantity < 2) {
      setQuantity(1);
    } else {
      setQuantity((prev) => prev - 1);
    }
  };

  // we are setting quantity to 1 bcz whenever we click on one of related products then quantity was being same as before so get rid of it we set it to 1.
  useEffect(() => {
    setQuantity(1);
  }, [id]);

  {
    /* <div className="grid grid-cols-2 max-[800px]:grid-cols-1 max-[800px]:mx-auto items-start gap-7 font-inter max-[800px]:px-1.5"> */
  }

  return (
    <div className="grid grid-cols-2 max-[800px]:grid-cols-1 max-[800px]:mx-auto items-start gap-7 font-inter max-[800px]:px-1.5">
      {/* Displaying all the product images */}

      <ProductImages images={images} />

      <div className="space-y-5 max-[500px]:space-y-4">
        {/* Product title */}
        <p className="text-2xl max-[500px]:text-xl font-semibold text-neutral-500 drop-shadow">
          {title}
        </p>

        <div className="flex items-start gap-2.5">
          {/* Product rating */}
          <Rating
            value={rating ? rating : 0}
            precision={0.5}
            readOnly
            emptyIcon={
              <GradeIcon style={{ opacity: 0.5 }} fontSize="inherit" />
            }
            size="small"
          />

          {/* Total Product Reviews count */}
          <p className="text-[0.95rem]">({numOfReviews} reviews)</p>

          <p className="text-neutral-400">•</p>

          {/* Product stock status */}
          <span
            className={`rounded-md text-sm font-semibold ${
              stock > 0 ? " text-green-500" : "text-red-500"
            }`}
          >
            {stock > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Discount price (price considered while adding to cart) */}
          <p className="text-2xl max-[500px]:text-lg">
            {formatCurrency(discountPrice)}
          </p>

          <div className="flex items-center gap-2">
            {/* Actual MRP price */}
            <span className="font-medium text-neutral-400 text-sm">
              <del>{formatCurrency(price)}</del>
            </span>

            {/* Discount percentage */}
            <span className="font-medium text-neutral-400 text-sm">
              {`(${discount}% off)`}
            </span>
          </div>
        </div>

        {/* Showing increase and decrease quantity buttons only when stock exists */}
        {stock > 0 && (
          <div className="flex items-center gap-4">
            <button
              className="py-1 px-2 bg-gradient-to-br from-neutral-400 to-neutral-950 rounded"
              onClick={increaseQuantityHandler}
            >
              <IoChevronUp className="text-white font-semibold" />
            </button>
            <p className="px-2 border rounded-md">{quantity}</p>
            <button
              className="py-1 px-2 bg-gradient-to-br from-neutral-400 to-neutral-950 rounded"
              onClick={decreaseQuantityHandler}
            >
              <IoChevronDown className="text-white font-semibold" />
            </button>
          </div>
        )}

        {/* Short Product description */}
        <div>
          <p
            className={`${
              token ? "line-clamp-4" : "line-clamp-6"
            } leading-relaxed font-inter text-neutral-500 font-medium`}
          >
            {description}
          </p>
        </div>

        {/* Showing Add to cart, Submit review buttons based on some conditions */}
        <ProductDetailButtons
          id={id}
          title={title}
          firstImg={images[0]?.url}
          quantity={quantity}
          discountPrice={discountPrice}
          stock={stock}
          category={category}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
