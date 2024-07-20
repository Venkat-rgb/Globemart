import { useSelector } from "react-redux";
import Layout from "../Layout";
import { useCallback, useEffect, useState } from "react";
import ChatContent from "../../Chat/ChatContent";
import { useLazyGetSingleChatQuery } from "../../../redux/features/chats/chatsApiSlice";
import Loader from "../../UI/Loader";
import toast from "react-hot-toast";
import LeftSideChats from "./LeftSideChats";
import useAddUserToSocket from "../../../hooks/socket/useAddUserToSocket";
import useCreateSocket from "../../../hooks/socket/useCreateSocket";
import useGetMessage from "../../../hooks/socket/useGetMessage";
import useMarkMessagesAsSeen from "../../../hooks/socket/useMarkMessagesAsSeen";
import useMessageSeen from "../../../hooks/socket/useMessageSeen";
import useTypingStatus from "../../../hooks/socket/useTypingStatus";
import ChooseChatBanner from "./ChooseChatBanner";
import ErrorUI from "../../UI/ErrorUI";
import MetaData from "../../MetaData";

const Chats = () => {
  // Keeps track of the ID of the currently selected chat
  const [chatId, setChatId] = useState("");

  // Stores information about the currently selected chat
  const [chatInfo, setChatInfo] = useState(null);

  // Stores the messages of the currently selected chat
  const [messages, setMessages] = useState([]);

  // Keeps track of customers who are currently online
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Stores the ID of the chat selected by the admin
  const [selectedChat, setSelectedChat] = useState("");

  // Indicates whether a customer is currently typing
  const [isTyping, setIsTyping] = useState(false);

  // Stores the socket ID of the customer
  const [socketReceiverId, setSocketReceiverId] = useState("");

  const { userInfo } = useSelector((state) => state?.auth);

  const [
    getSingleChat,
    { isLoading: isChatDataLoading, isError: chatDataError },
  ] = useLazyGetSingleChatQuery();

  // Intializing Socket Connection
  const { socket } = useCreateSocket();

  const setChatIdHandler = (id) => {
    setChatId(id);
  };

  const setMessagesHandler = (messageInfo) => {
    setMessages(messageInfo);
  };

  const setSelectedChatHandler = (id) => {
    setSelectedChat(id);
  };

  const getOnlineUsersListener = (data) => {
    setOnlineUsers(data);
  };

  // Fetches data about single chat based on chatId
  const getSingleChatHandler = useCallback(
    async (chatId) => {
      try {
        const messageRes = await getSingleChat(chatId).unwrap();
        setChatInfo(messageRes?.chat);
        setMessages(messageRes?.messages);
      } catch (err) {
        toast.error(err?.message || err?.data?.message);
      }
    },
    [getSingleChat]
  );

  // Checks if customer is online (or) not
  const isCustomerOnlineCheckHandler = (userId) => {
    if (onlineUsers?.length === 0) return false;

    const isCustomerExists = onlineUsers?.find(
      (user) => user?.userId === userId
    );

    return isCustomerExists ? true : false;
  };

  // Get all messages of a particular chat
  useEffect(() => {
    if (chatId) {
      getSingleChatHandler(chatId);
    }
  }, [chatId, getSingleChatHandler]);

  // Adding admin to socket and getting users who are currently online
  useAddUserToSocket(
    socket,
    userInfo?.id,
    userInfo?.role,
    "getOnlineUsers",
    getOnlineUsersListener
  );

  // Marks unseen messages in the current chat as seen
  useMarkMessagesAsSeen(chatInfo, socket, 0, messages, toast);

  // Listens for new messages from the chat receiver's socket and adds them to the messages array
  useGetMessage(socket, messages, chatInfo?.usersInChat[0]?._id, setMessages);

  // Manages the typing status of the user (whether typing or not)
  useTypingStatus(socket, setIsTyping, setSocketReceiverId);

  // Listens for messages that have been seen by user and updates the chat accordingly
  useMessageSeen(socket, getSingleChatHandler);

  return (
    <Layout>
      <MetaData title="Dashboard | Chats" />
      <div className="max-w-full mx-auto space-y-4 max-[700px]:pb-10">
        <div
          className="grid grid-cols-10 max-[700px]:grid-cols-1 rounded-md"
          style={{
            boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
          }}
        >
          {/* Displays all the chats available for admin to chat */}
          <LeftSideChats
            userInfoId={userInfo?.id}
            setChatIdHandler={setChatIdHandler}
            selectedChat={selectedChat}
            setSelectedChatHandler={setSelectedChatHandler}
            isCustomerOnlineCheckHandler={isCustomerOnlineCheckHandler}
            messages={messages}
            socket={socket}
          />

          <div className="min-[900px]:col-span-7 max-[900px]:col-span-6 h-[87.5vh]">
            {/* Showing errMsg, if an error occured during fetching the single chat  */}
            {chatDataError && (
              <ErrorUI message="Unable to fetch the single chat due to some error!" />
            )}

            {/* emojiPlaceOfUse="top-14 left-28" */}

            {/* Showing Chat data only when chatdata is not loading */}
            {!isChatDataLoading && chatInfo?._id ? (
              <ChatContent
                placeOfUse="admin"
                chatId={chatInfo?._id}
                username={chatInfo?.usersInChat[0]?.username}
                receiverId={chatInfo?.usersInChat[0]?._id}
                socketReceiverId={socketReceiverId}
                profileImg={chatInfo?.usersInChat[0]?.profileImg?.url}
                messages={messages}
                socket={socket}
                setMessagesHandler={setMessagesHandler}
                isCustomerOnline={isCustomerOnlineCheckHandler(
                  chatInfo?.usersInChat[0]?._id
                )}
                emojiPlaceOfUse="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                isTyping={isTyping}
              />
            ) : isChatDataLoading ? (
              // Showing Loader while chatData is loading
              <Loader
                styleProp="flex items-center justify-center h-[50vh]"
                dimensions="w-16 h-16"
              />
            ) : (
              // Showing Choose a particular chat banner
              <ChooseChatBanner />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chats;

// import { useSelector } from "react-redux";
// import Layout from "../Layout";
// import { useEffect, useState } from "react";
// import ChatContent from "../../Chat/ChatContent";
// import {
//   useLazyGetAllChatsOfUserQuery,
//   useLazyGetSingleChatQuery,
// } from "../../../redux/features/chats/chatsApiSlice";
// import Loader from "../../Loader";
// import chatImg from "../../../assets/images/basic/chat.svg";
// import LazyImage from "../../LazyImage";
// import toast from "react-hot-toast";
// import LeftSideChats from "./LeftSideChats";
// import {
//   useCreateSocket,
//   useGetMessage,
//   useMarkMessagesAsSeen,
//   useMessageSeen,
//   useTypingStatus,
// } from "../../../hooks";
// import useAddUserToSocket from "../../../hooks/socket/useAddUserToSocket";

// 2nd
// const Chats = () => {
//   // When particular chat is selected, chatId keeps track of that chat
//   const [chatId, setChatId] = useState("");

//   const [chatInfo, setChatInfo] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [selectedChat, setSelectedChat] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [socketReceiverId, setSocketReceiverId] = useState("");
//   const { userInfo } = useSelector((state) => state?.auth);

//   const [getSingleChat, { isFetching: isChatDataLoading }] =
//     useLazyGetSingleChatQuery();

//   // Intializing Socket Connection
//   const { socket } = useCreateSocket();

//   const setChatIdHandler = (id) => {
//     setChatId(id);
//   };

//   const setMessagesHandler = (messageInfo) => {
//     setMessages(messageInfo);
//   };

//   const setSelectedChatHandler = (id) => {
//     setSelectedChat(id);
//   };

//   const getOnlineUsersListener = (data) => {
//     console.log("onlineUsersData: ", data);
//     setOnlineUsers(data);
//   };

//   const getSingleChatHandler = async (chatId) => {
//     try {
//       const messageRes = await getSingleChat(chatId).unwrap();
//       setChatInfo(messageRes?.chat);
//       setMessages(messageRes?.messages);
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   const isCustomerOnlineCheckHandler = (userId) => {
//     if (onlineUsers?.length === 0) return false;

//     const isCustomerExists = onlineUsers?.find(
//       (user) => user?.userId === userId
//     );

//     return isCustomerExists ? true : false;
//   };

//   // Get all messages of a particular chat
//   useEffect(() => {
//     if (chatId) {
//       getSingleChatHandler(chatId);
//     }
//   }, [chatId]);

//   // Adding New User to socket
//   useAddUserToSocket(
//     socket,
//     userInfo?.id,
//     userInfo?.role,
//     "getOnlineUsers",
//     getOnlineUsersListener
//   );

//   // Mark unseen messages as seen
//   useMarkMessagesAsSeen(chatInfo, socket, 0, messages, toast);

//   // Getting message from socket
//   useGetMessage(socket, messages, chatInfo?.usersInChat[0]?._id, setMessages);

//   // Whether user is typing (or) not feature
//   useTypingStatus(socket, setIsTyping, setSocketReceiverId);

//   // Getting Messages Seen status
//   useMessageSeen(socket, getSingleChatHandler);

//   return (
//     <Layout>
//       <div className="max-w-full mx-auto space-y-4">
//         <div
//           className="grid grid-cols-10 rounded-md"
//           style={{
//             boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
//           }}
//         >
//           <LeftSideChats
//             userInfoId={userInfo?.id}
//             setChatIdHandler={setChatIdHandler}
//             selectedChat={selectedChat}
//             setSelectedChatHandler={setSelectedChatHandler}
//             isCustomerOnlineCheckHandler={isCustomerOnlineCheckHandler}
//             messages={messages}
//           />

//           <div className="col-span-7 h-[87.5vh]">
//             {chatInfo?._id ? (
//               <ChatContent
//                 placeOfUse="admin"
//                 chatId={chatInfo?._id}
//                 username={chatInfo?.usersInChat[0]?.username}
//                 receiverId={chatInfo?.usersInChat[0]?._id}
//                 socketReceiverId={socketReceiverId}
//                 profileImg={chatInfo?.usersInChat[0]?.profileImg?.url}
//                 messages={messages}
//                 socket={socket}
//                 setMessagesHandler={setMessagesHandler}
//                 isCustomerOnline={isCustomerOnlineCheckHandler(
//                   chatInfo?.usersInChat[0]?._id
//                 )}
//                 emojiPlaceOfUse="top-14 left-28"
//                 isTyping={isTyping}
//               />
//             ) : isChatDataLoading ? (
//               <Loader styleProp="flex items-center justify-center h-[50vh]" />
//             ) : (
//               <ChooseChatBanner />
//             )}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// 1st
// const Chats = () => {
//   // When particular chat is selected, chatId keeps track of that chat
//   const [chatId, setChatId] = useState("");

//   // When particular chat is selected, chatId keeps track of that chat
//   const [searchName, setSearchName] = useState("");
//   const [chatsData, setChatsData] = useState([]);
//   const [chatInfo, setChatInfo] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [selectedChat, setSelectedChat] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [socketReceiverId, setSocketReceiverId] = useState("");
//   const { userInfo } = useSelector((state) => state?.auth);

//   const [getSingleChat, { isFetching: isChatDataLoading }] =
//     useLazyGetSingleChatQuery();

//   const [getAllChats, { isLoading: areChatsLoading }] =
//     useLazyGetAllChatsOfUserQuery();

//   // Intializing Socket Connection
//   const { socket } = useCreateSocket();

//   const setChatIdHandler = (id) => {
//     setChatId(id);
//   };

//   const setMessagesHandler = (messageInfo) => {
//     setMessages(messageInfo);
//   };

//   const setSelectedChatHandler = (id) => {
//     setSelectedChat(id);
//   };

//   // const setIsTypingHandler = (typingStatus) => {
//   //   setIsTyping(typingStatus);
//   // };

//   const getOnlineUsersListener = (data) => {
//     console.log("onlineUsersData: ", data);
//     setOnlineUsers(data);
//   };

//   const getAllChatsHandler = async (name = "") => {
//     try {
//       // fetching all chats of logged in user (or) chats by name
//       const chatRes = name
//         ? await getAllChats(name).unwrap()
//         : await getAllChats().unwrap();

//       console.log("all chats res: ", chatRes);

//       setChatsData(chatRes?.chats);
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   const getSingleChatHandler = async (chatId) => {
//     try {
//       const messageRes = await getSingleChat(chatId).unwrap();
//       setChatInfo(messageRes?.chat);
//       setMessages(messageRes?.messages);
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   const isCustomerOnlineCheckHandler = (userId) => {
//     if (onlineUsers?.length === 0) return false;

//     const isCustomerExists = onlineUsers?.find(
//       (user) => user?.userId === userId
//     );

//     return isCustomerExists ? true : false;
//   };

//   // Get all messages of a particular chat
//   useEffect(() => {
//     if (chatId) {
//       getSingleChatHandler(chatId);
//     }
//   }, [chatId]);

//   // Adding New User to socket
//   useAddUserToSocket(
//     socket,
//     userInfo?.id,
//     userInfo?.role,
//     "getOnlineUsers",
//     getOnlineUsersListener
//   );

//   // Mark unseen messages as seen
//   useMarkMessagesAsSeen(chatInfo, socket, 0, messages, toast);

//   // Getting message from socket
//   useGetMessage(socket, messages, chatInfo?.usersInChat[0]?._id, setMessages);

//   // Whether user is typing (or) not feature
//   useTypingStatus(socket, setIsTyping, setSocketReceiverId);

//   // Getting Messages Seen status
//   useMessageSeen(socket, getSingleChatHandler);

//   // Implement debouncing while searching for customers
//   useEffect(() => {
//     let timer;

//     if (searchName.trim()) {
//       timer = setTimeout(() => {
//         getAllChatsHandler(searchName.trim());
//       }, 300);
//     } else {
//       getAllChatsHandler();
//     }

//     return () => {
//       timer && clearTimeout(timer);
//     };
//   }, [searchName, messages]);

//   if (areChatsLoading) {
//     return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
//   }

//   return (
//     <Layout>
//       <div className="max-w-full mx-auto space-y-4">
//         <div
//           className="grid grid-cols-10 rounded-md"
//           style={{
//             boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
//           }}
//         >
//           <LeftSideChats
//             chatsData={chatsData}
//             setSearchName={setSearchName}
//             areChatsLoading={areChatsLoading}
//             userInfoId={userInfo?.id}
//             setChatIdHandler={setChatIdHandler}
//             selectedChat={selectedChat}
//             setSelectedChatHandler={setSelectedChatHandler}
//             isCustomerOnlineCheckHandler={isCustomerOnlineCheckHandler}
//           />

//           <div className="col-span-7 h-[87.5vh]">
//             {chatInfo?._id ? (
//               <ChatContent
//                 placeOfUse="admin"
//                 chatId={chatInfo?._id}
//                 username={chatInfo?.usersInChat[0]?.username}
//                 receiverId={chatInfo?.usersInChat[0]?._id}
//                 socketReceiverId={socketReceiverId}
//                 profileImg={chatInfo?.usersInChat[0]?.profileImg?.url}
//                 messages={messages}
//                 socket={socket}
//                 setMessagesHandler={setMessagesHandler}
//                 isCustomerOnline={isCustomerOnlineCheckHandler(
//                   chatInfo?.usersInChat[0]?._id
//                 )}
//                 emojiPlaceOfUse="top-14 left-28"
//                 isTyping={isTyping}
//                 // setIsTypingHandler={setIsTypingHandler}
//               />
//             ) : isChatDataLoading ? (
//               <Loader styleProp="flex items-center justify-center h-[50vh]" />
//             ) : (
//               <div className="flex flex-col items-center justify-center gap-7 h-full bg-gradient-to-br from-indigo-300 via-indigo-500 to-indigo-700">
//                 <LazyImage
//                   imageProps={{
//                     src: chatImg,
//                     alt: `chat-wallpaper`,
//                     className: "w-44 h-44 object-cover",
//                   }}
//                   skeletonWidth={176}
//                   skeletonHeight={176}
//                 />

//                 <p className="text-2xl font-public-sans font-medium text-white max-w-[55%] text-center">
//                   Please choose a chat to start conversation with customers!
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Chats;

// Adding New User to socket
// useEffect(() => {
//   const getOnlineUsersListener = (data) => {
//     console.log("onlineUsersData: ", data);
//     setOnlineUsers(data);
//   };

//   if (socket) {
//     socket.emit("addNewUser", { userId: userInfo?.id, role: userInfo?.role });

//     socket.on("getOnlineUsers", getOnlineUsersListener);
//   }

//   return () => {
//     if (socket) {
//       socket.off("getOnlineUsers", getOnlineUsersListener);
//     }
//   };
// }, [socket]);
