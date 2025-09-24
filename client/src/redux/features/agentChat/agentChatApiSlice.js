import { ecommerceApi } from "../../services/ecommerceApi";

export const agentChatApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    chatWithAIAgent: builder.mutation({
      query: (info) => ({
        url: "/ai/customer-support-agent",
        method: "POST",
        body: info,
      }),
      invalidatesTags: ["AIAgent"],
    }),

    getAgentChat: builder.query({
      query: (userId) => `/ai/customer-support-agent/${userId}`,
      providesTags: ["AIAgent"],
    }),

    deleteAgentChat: builder.mutation({
      query: (userId) => ({
        url: `/ai/customer-support-agent/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AIAgent"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useChatWithAIAgentMutation,
  useLazyGetAgentChatQuery,
  useDeleteAgentChatMutation,
} = agentChatApiSlice;
