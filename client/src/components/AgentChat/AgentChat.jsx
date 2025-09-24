import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import AgentChatHeader from "./AgentChatHeader";
import AgentChatBody from "./AgentChatBody";
import AgentChatFooter from "./AgentChatFooter";
import {
  useChatWithAIAgentMutation,
  useDeleteAgentChatMutation,
  useLazyGetAgentChatQuery,
} from "../../redux/features/agentChat/agentChatApiSlice";
import toast from "react-hot-toast";

const AgentChat = ({ userId, setIsAgentChatOpen }) => {
  // Stores chat messages
  const [messages, setMessages] = useState([]);

  // Fetching agent chat messages
  const [getAgentChat, { isFetching: isAgentChatLoading }] =
    useLazyGetAgentChatQuery();

  const [chatWithAIAgent, { isLoading: isAgentResponseLoading }] =
    useChatWithAIAgentMutation();

  const [deleteAgentChat, { isLoading: deletingAgentChat }] =
    useDeleteAgentChatMutation();

  // Closing the chat modal
  const closeAgentChat = () => {
    setIsAgentChatOpen(false);
  };

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
  const sendMessageToAI = async (userQuery) => {
    try {
      // Push the user message to chat
      setMessages((prev) => [
        ...prev,
        {
          _id: `userMsg-${new Date().getTime()}`,
          role: "user",
          content: userQuery,
          timestamp: new Date(),
        },
      ]);

      // Getting the response from AI
      const agentRes = await chatWithAIAgent({
        userMessage: userQuery,
        userId,
      }).unwrap();

      // Pushing the AI message to chat
      setMessages((prev) => [...prev, agentRes?.message]);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Deleting the chat messages
  const deleteChatMessages = async () => {
    try {
      console.log("Deleting agent chat messages...");
    } catch (err) {
      console.log("Error while deleting agent chat messages: ", err?.message);
    }
  };

  // Fetching messages only once when component mounts
  useEffect(() => {
    getMessages();
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed z-50 bottom-9 rounded-2xl h-[27rem] w-[30rem] bg-white right-12 font-inter"
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
