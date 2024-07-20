import { ecommerceApi } from "../../services/ecommerceApi";

export const productsApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (filters) => `/products${filters ? filters : ""}`,
      providesTags: ["Products", "Review"],
    }),

    getProduct: builder.query({
      query: (productId) => `/products/${productId}`,
      providesTags: ["Products", "Review"],
    }),

    getSearchedProducts: builder.query({
      query: (searchQuery) => `/products${searchQuery}`,
    }),

    getProductsByVoiceSearch: builder.query({
      query: (voiceQuery) => `/products/voice-search?text=${voiceQuery}`,
    }),

    getFeaturedProducts: builder.query({
      query: () => "/products/featured",
      providesTags: ["Products", "Review"],
    }),

    createProduct: builder.mutation({
      query: (productInfo) => ({
        url: "/products",
        method: "POST",
        body: productInfo,
      }),
      invalidatesTags: ["Products", "Stats"],
    }),

    updateProduct: builder.mutation({
      query: (productInfo) => {
        const productId = productInfo.get("productId");
        const title = productInfo.get("title");
        const description = productInfo.get("description");
        const productFeatures = productInfo.get("productFeatures");
        const price = productInfo.get("price");
        const category = productInfo.get("category");
        const stock = productInfo.get("stock");
        const discount = productInfo.get("discount");
        const images = productInfo.getAll("images");

        return {
          url: `/products/${productId}`,
          method: "PUT",
          body: {
            title,
            description,
            productFeatures,
            category,
            price,
            discount,
            stock,
            images,
          },
        };
      },
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Stats"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useLazyGetSearchedProductsQuery,
  useLazyGetProductsByVoiceSearchQuery,
  useGetFeaturedProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;
