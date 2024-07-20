import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cartSlice",
  initialState: {
    products: localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")).products
      : [],
    totalAmount: localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")).totalAmount
      : 0,
    totalProductsCount: localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")).totalProductsCount
      : 0,
  },
  reducers: {
    addToCart(state, action) {
      const {
        productId,
        productQty,
        productPrice,
        productTitle,
        productImg,
        productStock,
      } = action.payload;

      const isProductAlreadyExists = state.products.find(
        (product) => product.productId === productId
      );

      if (isProductAlreadyExists) {
        isProductAlreadyExists.productQty += productQty;
        state.totalAmount += productQty * productPrice;
      } else {
        state.products.push({
          productId,
          productQty,
          productPrice,
          productTitle,
          productImg,
          productStock,
        });
        state.totalAmount += productQty * productPrice;
        state.totalProductsCount++;
      }

      localStorage.setItem(
        "cart",
        JSON.stringify({
          products: state.products,
          totalAmount: state.totalAmount,
          totalProductsCount: state.totalProductsCount,
        })
      );
    },

    decreaseProductFromCart(state, action) {
      const { productId } = action.payload;

      const currentProduct = state.products.find(
        (product) => product.productId === productId
      );

      if (currentProduct.productQty > 1) {
        currentProduct.productQty--;
        state.totalAmount -= currentProduct.productPrice;
      } else {
        state.products = state.products.filter(
          (product) => product.productId !== productId
        );
        state.totalAmount -= currentProduct.productPrice;
        state.totalProductsCount--;
      }
      localStorage.setItem(
        "cart",
        JSON.stringify({
          products: state.products,
          totalAmount: state.totalAmount,
          totalProductsCount: state.totalProductsCount,
        })
      );
      state.totalProductsCount === 0 && localStorage.removeItem("cart");
    },

    deleteTotalProduct(state, action) {
      const { productId } = action.payload;

      const currentProduct = state.products.find(
        (product) => product.productId === productId
      );

      state.products = state.products.filter(
        (product) => product.productId !== productId
      );

      state.totalAmount -=
        currentProduct.productQty * currentProduct.productPrice;
      state.totalProductsCount--;
      localStorage.setItem(
        "cart",
        JSON.stringify({
          products: state.products,
          totalAmount: state.totalAmount,
          totalProductsCount: state.totalProductsCount,
        })
      );
      state.totalProductsCount === 0 && localStorage.removeItem("cart");
    },

    deleteTotalCart(state) {
      state.products = [];
      state.totalAmount = 0;
      state.totalProductsCount = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  decreaseProductFromCart,
  deleteTotalProduct,
  deleteTotalCart,
} = cartSlice.actions;

export default cartSlice.reducer;
