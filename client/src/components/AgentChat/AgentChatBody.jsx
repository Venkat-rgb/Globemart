import AgentMessage from "./AgentMessage";
import SmallLoader from "../UI/SmallLoader";
import { useRef } from "react";
import ScrollToLastMessageButton from "./ScrollToLastMessageButton";
import { IoChatbubbleSharp } from "react-icons/io5";

const AgentChatBody = ({
  isAgentChatLoading,
  isAgentResponseLoading,
  messages,
}) => {
  const messageRef = useRef();

  return (
    <div className="h-80 px-4 pt-2.5 py-4 overflow-y-scroll">
      {/* Showing Loader while the chat messages are loading */}
      {isAgentChatLoading && (
        <SmallLoader styleProp="flex items-center justify-center h-full" />
      )}

      {/* Helps in scrolling till last message in chat */}
      <ScrollToLastMessageButton messageRef={messageRef} messages={messages} />

      {/* When chat is empty, then show the placeholder */}
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full px-3 bg-neutral-100 rounded-2xl">
          <div className="space-y-5">
            <p className="font-public-sans font-semibold text-neutral-600 text-xl">
              Hi there! 👋 Welcome to Globemart!
            </p>
            <p className="text-neutral-800 flex flex-col text-[0.95rem]">
              I'm your AI support assistant. I can help with questions about:
              <span>
                1) Our Policies: returns, refunds, account and app related FAQ's
              </span>
              <span>2) Details about specific products</span>
              <span>3) Summarize customer reviews for particular product</span>
            </p>
            <p></p>
            <p className="text-neutral-800">
              Just let me know what you need! 😊
            </p>
          </div>
        </div>
      )}

      {/* Showing chat messages when chat has been loaded successfully */}
      {!isAgentChatLoading && (
        <div className="space-y-4" ref={messageRef}>
          {messages.map((message) => (
            <AgentMessage
              key={message?._id}
              role={message?.role}
              message={message?.content}
              timestamp={message?.timestamp}
            />
          ))}
        </div>
      )}

      {/* Showing Thinking animation while AI is thinking */}
      {isAgentResponseLoading && (
        <div className="flex items-center gap-2">
          <IoChatbubbleSharp fontSize={18} className="text-purple-600" />
          <p className="text-sm text-neutral-700 font-medium animate-pulse">
            Thinking...
          </p>
        </div>
      )}
    </div>
  );
};

export default AgentChatBody;
