import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import AgentChatHeader from "./AgentChatHeader";
import AgentChatBody from "./AgentChatBody";
import AgentChatFooter from "./AgentChatFooter";
import {
  agentChatApiSlice,
  useChatWithAIAgentMutation,
  useDeleteAgentChatMutation,
  useLazyGetAgentChatQuery,
} from "../../redux/features/agentChat/agentChatApiSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const AgentChat = ({ userId, setIsAgentChatOpen }) => {
  // Stores chat messages
  const [messages, setMessages] = useState([]);

  const dispatch = useDispatch();

  // Fetching agent chat messages
  const [getAgentChat, { isFetching: isAgentChatLoading }] =
    useLazyGetAgentChatQuery();

  const [chatWithAIAgent, { isLoading: isAgentResponseLoading }] =
    useChatWithAIAgentMutation();

  const [deleteAgentChat, { isLoading: deletingAgentChat }] =
    useDeleteAgentChatMutation();

  // Closing the chat modal
  const closeAgentChat = useCallback(() => {
    setIsAgentChatOpen(false);
  }, []);

  // Fetching chat messages
  const getMessages = async () => {
    try {
      const agentMessages = await getAgentChat(userId, {
        preferCacheValue: true,
      }).unwrap();
      setMessages(agentMessages?.messages);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Sending user message to AI
  const sendMessageToAI = useCallback(
    async (userQuery) => {
      try {
        // Push the user message to chat
        const userMessageObj = {
          _id: `userMsg-${new Date().getTime()}`,
          role: "user",
          content: userQuery,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessageObj]);

        // Getting the response from AI
        const agentRes = await chatWithAIAgent({
          userMessage: userQuery,
          userId,
        }).unwrap();

        // Pushing the AI message to chat
        setMessages((prev) => [...prev, agentRes?.message]);

        // Updating the outdated messages cache manually
        dispatch(
          agentChatApiSlice.util.updateQueryData(
            "getAgentChat",
            userId,
            (draft) => {
              if (draft?.messages) {
                // Add both user message and AI response to cache
                draft.messages.push(userMessageObj);
                draft.messages.push(agentRes?.message);
              }
            },
          ),
        );
      } catch (err) {
        toast.error(err?.message || err?.data?.message);
      }
    },
    [messages],
  );

  // Deleting the chat messages
  const deleteChatMessages = useCallback(async () => {
    try {
      if (messages.length === 0) return;

      const deleteChatRes = await deleteAgentChat(userId).unwrap();
      toast.success(deleteChatRes?.message);

      // Resetting the messages to empty
      setMessages([]);

      // Deleting all the messages from the cache manually
      dispatch(
        agentChatApiSlice.util.updateQueryData(
          "getAgentChat",
          userId,
          (draft) => {
            if (draft?.messages) {
              // delete all the chat messages in draft
              draft.messages = [];
            }
          },
        ),
      );
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  }, [messages]);

  // Fetching messages only once when component mounts
  useEffect(() => {
    getMessages();
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed z-50 bottom-9 rounded-2xl h-[27rem] w-[30rem] bg-white right-12 font-inter max-[550px]:w-[25rem] max-[480px]:right-3 max-[480px]:bottom-20 max-[440px]:w-[21rem] max-[350px]:w-[18rem] max-[360px]:bottom-9"
        style={{ boxShadow: "0px 0px 30px rgba(0,0,0,0.13)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ delay: 0.2 }}
      >
        {/* Chat Header */}
        <AgentChatHeader
          deleteChatMessages={deleteChatMessages}
          closeAgentChat={closeAgentChat}
          deletingAgentChat={deletingAgentChat}
        />

        {/* Chat Body */}
        <AgentChatBody
          isAgentChatLoading={isAgentChatLoading}
          isAgentResponseLoading={isAgentResponseLoading}
          messages={messages}
        />

        {/* Chat Footer */}
        <AgentChatFooter
          sendMessageToAI={sendMessageToAI}
          isAgentResponseLoading={isAgentResponseLoading}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default AgentChat;
