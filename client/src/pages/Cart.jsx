import { Link, useNavigate } from "react-router-dom";
import { Button, MetaData } from "../components";
import { BiChevronLeft } from "react-icons/bi";
import { motion } from "framer-motion";
import CartImage from "../assets/images/basic/cartImage.jpg";
import { useSelector, useDispatch } from "react-redux";
import { formatCurrency } from "../utils/general/formatCurrency";
import { deleteTotalCart } from "../redux/features/slices/cartSlice";
import CartItem from "../components/Cart/CartItem";
import LazyImage from "../components/LazyImage";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { totalAmount, totalProductsCount, products } = useSelector(
    (state) => state?.cart
  );

  return (
    <div className="pt-24 pb-12 space-y-8 max-[640px]:space-y-5 max-w-[65rem] mx-auto">
      <MetaData title="Cart" />
      <p className="font-public-sans font-semibold text-2xl max-[500px]:text-[1.35rem] text-neutral-600 drop-shadow text-center">
        Cart
      </p>
      <div className="flex items-center justify-between gap-4 font-inter px-4">
        {/* Redirects to Products page */}
        <Link to="/products">
          <motion.div
            className="flex items-center gap-[0.4rem] bg-neutral-800/90 py-[0.28rem] pl-2 pr-4 rounded-full shadow-md text-[#f1f1f1]"
            whileTap={{ scale: 0.97 }}
          >
            <BiChevronLeft className="text-[1.3rem]" />
            <p className="max-[500px]:text-sm">Continue Shopping</p>
          </motion.div>
        </Link>

        {/* Displaying total number of items in cart */}
        <p className="max-[500px]:text-sm underline underline-offset-2">
          Your Bag ({totalProductsCount})
        </p>
      </div>

      {/* Displaying an image when cart is empty */}
      {totalProductsCount === 0 && (
        <div className="flex flex-col items-center justify-center">
          <div className="flex-shrink-0 rounded-2xl max-w-[35%] h-[307px] max-[900px]:max-w-[50%] max-[550px]:max-w-full max-[900px]:h-auto">
            <LazyImage
              imageProps={{
                src: CartImage,
                alt: "cart-img",
                // className: "object-cover rounded-2xl w-full",
              }}
              styleProp="rounded-2xl"
              skeletonVariant="circular"
              skeletonWidth={307}
              skeletonHeight={307}
            />
          </div>

          <p className="text-2xl drop-shadow font-semibold text-neutral-500 font-public-sans text-center max-[550px]:text-xl px-1">
            Your Cart is Empty, add some products!
          </p>
        </div>
      )}

      {/* Showing items present in cart */}
      {totalProductsCount > 0 && (
        <div className="grid grid-cols-3 max-[1000px]:grid-cols-1 gap-4 font-inter px-4">
          <motion.div
            className="shadow-lg p-4 space-y-2 col-span-2 rounded-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-6 pb-3">
              <p className="font-public-sans font-semibold text-neutral-600 drop-shadow text-lg">
                Added Items
              </p>
              {/* Deleting all products in cart at once */}
              <motion.button
                className="font-inter bg-neutral-100 rounded-md py-1 px-3 font-semibold text-neutral-400 text-sm drop-shadow-md"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => dispatch(deleteTotalCart())}
              >
                Clear Cart
              </motion.button>
            </div>

            {/* Displaying Cart items */}
            <div className="space-y-3 max-[550px]:space-y-7 overflow-scroll max-h-[50vh] pb-5">
              {products?.map((product) => (
                <CartItem
                  key={product?.productId}
                  id={product?.productId}
                  image={product?.productImg}
                  title={product?.productTitle}
                  price={product?.productPrice}
                  quantity={product?.productQty}
                  stock={product?.productStock}
                  placeOfUse="Cart"
                />
              ))}
            </div>
          </motion.div>

          {/* Total Cost of Cart items  */}
          <motion.div
            className="w-full px-4 py-12 rounded-md shadow-lg space-y-6 h-64 col-span-1 max-[1000px]:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2 }}
          >
            <p className="font-public-sans font-semibold text-neutral-600 drop-shadow  text-center text-lg">
              Total Amount
            </p>

            <p className="text-center text-3xl text-neutral-600 line-clamp-1">
              {formatCurrency(totalAmount)}
            </p>

            {/* Redirects to Order page for making order  */}
            <Button
              onClick={() => navigate("/order")}
              moreStyles="w-full max-[500px]:text-sm"
            >
              <p>Checkout Now</p>
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Cart;
