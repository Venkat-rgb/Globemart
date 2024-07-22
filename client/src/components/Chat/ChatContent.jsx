import { useRef } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import ScrollToLastMessageBtn from "./ScrollToLastMessageBtn";

const ChatContent = ({
  placeOfUse,
  chatId,
  username,
  receiverId,
  socketReceiverId,
  profileImg,
  messages,
  socket,
  setMessagesHandler,
  isCustomerOnline,
  emojiPlaceOfUse,
  isTyping,
}) => {
  // Used for scrolling to the last message in chat when user opens
  const messagesRef = useRef();

  // Accessing userInfo from the redux store to identify the sender and receiver of messages
  const { userInfo } = useSelector((state) => state?.auth);

  return (
    // Changing styles based on placeOfUse, which describes in which component 'ChatContent' component is used
    <div
      className={`${
        placeOfUse !== "admin" ? "rounded-lg" : ""
      } h-full font-inter relative`}
      style={{
        boxShadow: placeOfUse !== "admin" && "0px 10px 30px rgba(0,0,0,0.15)",
      }}
    >
      {/* ChatHeader containing profileImg and onlineStatus */}
      <ChatHeader
        profileImg={profileImg}
        isCustomerOnline={isCustomerOnline}
        username={username}
        receiverId={receiverId}
        socketReceiverId={socketReceiverId}
        isTyping={isTyping}
      />

      {/* Button onClick, it scrolls to last message of chat  */}
      <ScrollToLastMessageBtn
        ref={messagesRef}
        chatId={chatId}
        messages={messages}
      />

      {/* Displaying all the messages of a chat */}
      <div
        className="h-[calc(100%-120px)] border-b px-7 py-5 mx-auto bg-neutral-100 w-full flex items-center flex-col gap-2 overflow-y-scroll relative"
        ref={messagesRef}
      >
        {messages?.map((message) => (
          <Message
            key={message?._id}
            role={message?.sender?._id === userInfo?.id ? "receiver" : "sender"}
            message={message?.message}
            username={message?.sender?.username}
            messageTime={message?.messageSentAt}
            messageSeen={message?.messageSeen}
          />
        ))}
      </div>

      {/* Displaying Chat Footer */}
      <ChatFooter
        chatId={chatId}
        socket={socket}
        receiverId={receiverId}
        messages={messages}
        setMessagesHandler={setMessagesHandler}
        emojiPlaceOfUse={emojiPlaceOfUse}
        isTyping={isTyping}
      />
    </div>
  );
};

export default ChatContent;
