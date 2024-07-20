import { memo } from "react";
import CartItem from "../../Cart/CartItem";

const OrderedProducts = ({ products }) => {
  return (
    <div className="space-y-5 border-t pt-4">
      <p className="font-public-sans font-semibold text-neutral-600 drop-shadow  text-center text-lg">
        Ordered Items
      </p>

      <div className="flex items-center justify-between font-medium">
        <p className="text-center underline underline-offset-2">Product</p>
        <p className="underline underline-offset-2 pr-24 max-[550px]:pr-0">
          Qty & Price
        </p>
      </div>

      {/* Showing all the customer ordering products */}
      {products?.map((product) => (
        <CartItem
          key={product?.productId}
          id={product?.productId}
          image={product?.productImg}
          title={product?.productTitle}
          price={product?.productPrice}
          quantity={product?.productQty}
          placeOfUse="Order"
        />
      ))}
    </div>
  );
};

export default memo(OrderedProducts);
