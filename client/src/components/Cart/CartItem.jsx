import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LazyImage from "../LazyImage";
import { useDispatch } from "react-redux";
import {
  addToCart,
  decreaseProductFromCart,
  deleteTotalProduct,
} from "../../redux/features/slices/cartSlice";
import { formatCurrency } from "../../utils/general/formatCurrency";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CartItem = ({ image, title, price, id, quantity, stock, placeOfUse }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // Increasing the product quantity of a cart item
  const increaseQuantityHandler = () => {
    // Can't add an item to cart with quantity more than the stock of that item
    if (quantity >= stock) {
      toast.error(
        `Stock left is only ${stock}, you can't add more than ${stock} products`
      );
      return;
    }

    // Increasing quantity of cart item
    dispatch(
      addToCart({
        productId: id,
        productImg: image,
        productTitle: title,
        productPrice: price,
        productStock: stock,
        productQty: 1,
      })
    );
  };

  // Decreasing the quantity of cart item
  const decreaseQuantityHandler = () => {
    dispatch(decreaseProductFromCart({ productId: id }));
  };

  // Removing the single cart item from cart
  const deleteProductHandler = () => {
    dispatch(deleteTotalProduct({ productId: id }));
  };

  return (
    <div className="flex items-center gap-4 justify-between w-full">
      <div className="flex items-center gap-4 w-[65%]">
        <div className="flex-shrink-0 border w-24 h-16 rounded-md overflow-hidden relative">
          {/* Product image */}
          <LazyImage
            placeOfUse="cartItem"
            imageProps={{
              src: image,
              alt: `cart-img-${id}`,
              // className: "object-cover overflow-hidden w-full h-full",
            }}
            // styleProp="h-16 overflow-hidden"
            skeletonWidth={96}
            skeletonHeight={64}
          />

          {/* Button to delete the single cart item */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {placeOfUse === "Cart" && (
              <div className="shadow-lg rounded-full">
                <IconButton
                  onClick={deleteProductHandler}
                  size="small"
                  sx={{ background: "white", opacity: 0.5 }}
                >
                  <DeleteOutlineOutlinedIcon
                    fontSize="small"
                    className="text-neutral-800 cursor-pointer"
                  />
                </IconButton>
              </div>
            )}
          </div>
        </div>

        {/* Product title */}
        <p
          className="text-[0.92rem] drop-shadow font-medium line-clamp-1 cursor-pointer"
          onClick={() => navigate(`/product/${id}`)}
        >
          {title}
        </p>
      </div>

      <div className="flex items-center justify-between max-[550px]:flex-wrap max-[550px]:justify-end gap-4 max-[550px]:gap-2 w-[35%]">
        {/* Increasing and Decreasing the cart item quantity */}
        <div
          className={`flex items-center gap-3 ${
            placeOfUse === "Cart" && "border"
          } rounded-md`}
        >
          {placeOfUse === "Cart" && (
            <div
              className="p-1 border-r cursor-pointer"
              onClick={increaseQuantityHandler}
            >
              <AddIcon sx={{ fontSize: "0.9rem", color: "green" }} />
            </div>
          )}
          <p
            className={`text-sm ${
              placeOfUse !== "Cart" && "border py-1 px-2 rounded-md"
            }`}
          >
            {quantity}
          </p>
          {placeOfUse === "Cart" && (
            <div
              className="p-1 border-l cursor-pointer"
              onClick={decreaseQuantityHandler}
            >
              <RemoveIcon sx={{ fontSize: "0.9rem", color: "red" }} />
            </div>
          )}
        </div>

        {/* Price of cart item */}
        <p className="text-sm border py-1 px-2 mr-2 max-[550px]:mr-0 max-[550px]:text-xs rounded-md text-center line-clamp-1">
          {formatCurrency(price)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
