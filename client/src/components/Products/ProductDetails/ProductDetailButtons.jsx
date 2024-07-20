import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../../redux/features/order/orderApiSlice";
import { addToCart } from "../../../redux/features/slices/cartSlice";
import Button from "../../UI/Button";
import { BiCartAdd } from "react-icons/bi";
import { setReviewModal } from "../../../redux/features/slices/reviewModalSlice";
import { MdOutlineRateReview } from "react-icons/md";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

const ProductDetailButtons = ({
  id,
  title,
  firstImg,
  quantity,
  discountPrice,
  stock,
  category,
}) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { token } = useSelector((state) => state?.auth);

  const { products } = useSelector((state) => state?.cart);

  // Fetching customer orders only when user has logged in
  const {
    data: myOrders,
    isError,
    error,
  } = useGetMyOrdersQuery(undefined, {
    skip: !token,
  });

  // If product is already added to cart then disabling the add to cart button. now customer can increase (or) decrease quantity from cart only.
  const isProductAlreadyAddedToCart = products?.find(
    (product) => id === product?.productId
  );

  // Checking if customer has ordered this product, if yes then only he can give review for his product, otherwise he can't.
  const isProductOrdered = myOrders?.orders?.find((order) => {
    const product = order?.products?.some(
      (item) => item?.product?._id?.toString() === id?.toString()
    );
    if (product) {
      return product;
    }
  });

  const cartHandler = () => {
    // Solving the edge case when quantity is 1, but when customer clicks 'Add to cart' button many times, it increases quanitity, so we are ignoring it
    if (isProductAlreadyAddedToCart) return;

    // Adding the product to cart
    dispatch(
      addToCart({
        productId: id,
        productTitle: title,
        productImg: firstImg,
        productQty: quantity,
        productPrice: Number(discountPrice.toFixed(2)),
        productStock: stock,
      })
    );
  };

  // Handling error during fetching order details
  if (isError) {
    console.error("ProductDetailButtons error: ", error?.data?.message);
  }

  return (
    <div className="space-y-4">
      {stock === 0 && (
        <p className="text-lg text-neutral-400 font-medium max-[500px]:text-base">
          -- Oops! The product you&apos;re looking for is currently out of stock
          online. Don&apos;t worry, you can find it at nearby offline stores
        </p>
      )}

      <div className="flex items-center max-[500px]:flex-wrap gap-4">
        {/* Customer can Add product to cart only if he is logged in and if product stock exists */}
        {token && stock > 0 && (
          <Button onClick={cartHandler} moreStyles="w-full gap-3">
            <BiCartAdd className="text-2xl" />
            <span>Add To Cart</span>
          </Button>
        )}

        {/* Showing Submit Review button only when customer has ordered this item */}
        {token && isProductOrdered && (
          <Button
            onClick={() => dispatch(setReviewModal(true))}
            moreStyles="w-full gap-3"
          >
            <MdOutlineRateReview className="text-[1.45rem]" />
            <span>Submit Review</span>
          </Button>
        )}

        {/* Customer can Find Nearby stores to him, only when stock of product is 0 */}
        {stock === 0 && (
          <Button
            onClick={() => navigate(`/nearby-stores/${category}`)}
            moreStyles="w-full gap-3"
          >
            <TravelExploreIcon />
            <span>Find Nearby Stores</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductDetailButtons;
