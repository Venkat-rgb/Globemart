import { ecommerceApi } from "../../services/ecommerceApi";

const chatsApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllChatsOfUser: builder.query({
      query: (username) => `${username ? `/chats?name=${username}` : `/chats`}`,
    }),

    getSingleChat: builder.query({
      query: (chatId) => `/chats/${chatId}`,
    }),

    createChat: builder.mutation({
      query: () => ({
        url: `/chats`,
        method: "POST",
      }),
    }),

    // deleteChat: builder.mutation({
    //   query: (chatId) => ({
    //     url: `/chats/${chatId}`,
    //     method: "DELETE",
    //   }),
    // }),
  }),
  overrideExisting: false,
});

export const {
  useLazyGetAllChatsOfUserQuery,
  useLazyGetSingleChatQuery,
  useCreateChatMutation,
  // useDeleteChatMutation,
} = chatsApiSlice;
