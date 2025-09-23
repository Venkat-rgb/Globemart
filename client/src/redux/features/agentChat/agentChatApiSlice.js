import { ecommerceApi } from "../../services/ecommerceApi";

export const agentChatApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    chatWithAIAgent: builder.mutation({
      query: (info) => ({
        url: "/ai/customer-support-agent",
        method: "POST",
        body: info,
      }),
    }),

    getAgentChat: builder.query({
      query: (userId) => `/ai/customer-support-agent/${userId}`,
    }),

    deleteAgentChat: builder.mutation({
      query: (userId) => ({
        url: `/ai/customer-support-agent/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useChatWithAIAgentMutation,
  useGetAgentChatQuery,
  useDeleteAgentChatMutation,
} = agentChatApiSlice;
