import { ecommerceApi } from "../../services/ecommerceApi";

const messagesApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMessagesOfChat: builder.query({
      query: (chatId) => `/messages/${chatId}`,
    }),

    createMessage: builder.mutation({
      query: (messageInfo) => ({
        url: `/messages`,
        method: "POST",
        body: messageInfo,
      }),
    }),

    markMessagesAsSeen: builder.mutation({
      query: (messageInfo) => ({
        url: `/messages`,
        method: "PUT",
        body: messageInfo,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllMessagesOfChatQuery,
  useCreateMessageMutation,
  useMarkMessagesAsSeenMutation,
} = messagesApiSlice;
