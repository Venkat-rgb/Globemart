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

// import { Avatar, Tooltip } from "@mui/material";
// import Message from "./Message";
// import { useEffect, useRef, useState } from "react";
// // import DeleteIcon from "@mui/icons-material/Delete";
// import { useSelector } from "react-redux";
// import ChatFooter from "./ChatFooter";
// import { BsArrowDownShort } from "react-icons/bs";
// import { motion } from "framer-motion";

// const ChatContent = ({
//   placeOfUse,
//   chatId,
//   username,
//   receiverId,
//   socketReceiverId,
//   profileImg,
//   messages,
//   socket,
//   setMessagesHandler,
//   isCustomerOnline,
//   emojiPlaceOfUse,
//   isTyping,
// }) => {
//   const [showDownBtn, setShowDownBtn] = useState(false);

//   const messagesRef = useRef();
//   const { userInfo } = useSelector((state) => state?.auth);

//   const scrollToLastMessageHandler = () => {
//     if (messagesRef?.current) {
//       const lastMessage = messagesRef?.current?.lastElementChild;
//       lastMessage?.scrollIntoView({ behavior: "smooth" });
//       setShowDownBtn(false);
//     }
//   };

//   // Scroll down to last message when chat (or) messages change
//   useEffect(() => {
//     scrollToLastMessageHandler();
//   }, [chatId, messages]);

//   // When we click on showDownBtn then scroll to last message
//   useEffect(() => {
//     const handleIntersection = (entries) => {
//       const position = entries[0].isIntersecting;

//       console.log("btn entries: ", entries);

//       setShowDownBtn(!position);
//     };

//     const observer = new IntersectionObserver(handleIntersection, {
//       threshold: 0,
//     });

//     const lastMessage = messagesRef?.current?.lastElementChild;

//     if (messagesRef?.current) {
//       lastMessage && observer.observe(lastMessage);
//     }

//     return () => {
//       lastMessage && observer.disconnect();
//     };
//   }, [chatId]);

//   return (
//     <div
//       className={`${
//         placeOfUse !== "admin" ? "rounded-lg" : ""
//       } h-full font-inter relative`}
//       style={{
//         boxShadow: placeOfUse !== "admin" && "0px 10px 30px rgba(0,0,0,0.15)",
//       }}
//     >
//       <div className="border-b h-[3.5rem] px-7 py-1.5 flex items-center justify-between bg-white">
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Avatar
//               src={profileImg}
//               alt="profile-img"
//               sx={{
//                 width: 40,
//                 height: 40,
//                 cursor: "pointer",
//                 border: "1px solid #f1f1f1",
//               }}
//             />
//             <Tooltip
//               title={isCustomerOnline ? "Online" : "Offline"}
//               placement="top"
//             >
//               <div
//                 className={`absolute ${
//                   isCustomerOnline ? "bg-green-500" : "bg-neutral-400"
//                 } top-0 right-0 w-3 h-3 border border-white rounded-full`}
//               />
//             </Tooltip>
//           </div>
//           <div>
//             <p className="text-neutral-500 font-medium capitalize">
//               {username}
//             </p>
//             <p className="text-green-500 font-medium text-sm transition-all duration-200">
//               {/* Only showing typing status of user to admin and not to all other chats on admin dashboard */}
//               {receiverId === socketReceiverId && isTyping && "typing..."}
//             </p>
//           </div>
//         </div>
//         {/* {placeOfUse === "admin" && (
//           <div>
//             <Tooltip title="Delete Chat" placement="left" arrow>
//               <IconButton>
//                 <DeleteIcon />
//               </IconButton>
//             </Tooltip>
//           </div>
//         )} */}
//       </div>

//       {/* Button onClick, it scrolls to last message of chat  */}
//       {showDownBtn && (
//         <motion.div
//           className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 bg-indigo-500 rounded-full shadow cursor-pointer p-0.5"
//           onClick={scrollToLastMessageHandler}
//           initial={{
//             opacity: 0,
//             y: 50,
//           }}
//           animate={{
//             opacity: 1,
//             y: 0,
//           }}
//         >
//           <BsArrowDownShort className="text-2xl text-white" />
//         </motion.div>
//       )}

//       {/* Displaying all the messages of a chat */}
//       <div
//         className="h-[calc(100%-120px)] border-b px-7 py-5 mx-auto bg-neutral-100 w-full flex items-center flex-col gap-2 overflow-y-scroll relative"
//         ref={messagesRef}
//       >
//         {messages?.map((message) => (
//           <Message
//             key={message?._id}
//             role={message?.sender?._id === userInfo?.id ? "receiver" : "sender"}
//             message={message?.message}
//             username={message?.sender?.username}
//             messageTime={message?.messageSentAt}
//             messageSeen={message?.messageSeen}
//           />
//         ))}
//       </div>

//       {/* Displaying Chat Footer */}
//       <ChatFooter
//         chatId={chatId}
//         socket={socket}
//         receiverId={receiverId}
//         messages={messages}
//         setMessagesHandler={setMessagesHandler}
//         emojiPlaceOfUse={emojiPlaceOfUse}
//         isTyping={isTyping}
//       />
//     </div>
//   );
// };

// export default ChatContent;
