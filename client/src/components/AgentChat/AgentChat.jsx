import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import AgentChatHeader from "./AgentChatHeader";
import AgentChatBody from "./AgentChatBody";
import AgentChatFooter from "./AgentChatFooter";

const AgentChat = ({ setIsAgentChatOpen }) => {
  // AI Chat open/close State
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([
    "Hey, I want to know whether Apple Macbook Pro is waterproof? Hey, I want to know whether Apple Macbook Pro is waterproof?",
    "Yes, Apple Macbook Pro is water-resistant with IPV6 rating",
    "What are customers saying about Apple Macbook Pro?",
    "Customers really like the multitasking ability and battery life",
    "Hey, I want to know whether Apple Macbook Pro is waterproof? Hey, I want to know whether Apple Macbook Pro is waterproof?",
    "Yes, Apple Macbook Pro is water-resistant with IPV6 rating",
    "What are customers saying about Apple Macbook Pro?",
    "Customers really like the multitasking ability and battery life",
    "What is my name?",
    "",
  ]);

  const getMessages = async () => {};

  const closeAgentChat = () => {
    setIsAgentChatOpen(false);
  };

  const deleteChatMessages = async () => {
    try {
      console.log("Deleting agent chat messages...");
    } catch (err) {
      console.log("Error while deleting agent chat messages: ", err?.message);
    }
  };

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
        <AgentChatBody messages={messages} />

        {/* Chat Footer */}
        <AgentChatFooter />
      </motion.div>
    </AnimatePresence>
  );
};

export default AgentChat;
