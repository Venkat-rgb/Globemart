import { useSelector } from "react-redux";
import ChatContent from "../components/Chat/ChatContent";
import { Navigate } from "react-router-dom";
import {
  useCreateChatMutation,
  useLazyGetSingleChatQuery,
} from "../redux/features/chats/chatsApiSlice";
import { Loader } from "../components";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import useAddUserToSocket from "../hooks/socket/useAddUserToSocket";
import useCreateSocket from "../hooks/socket/useCreateSocket";
import useMessageSeen from "../hooks/socket/useMessageSeen";
import useGetMessage from "../hooks/socket/useGetMessage";
import useTypingStatus from "../hooks/socket/useTypingStatus";
import useMarkMessagesAsSeen from "../hooks/socket/useMarkMessagesAsSeen";
import PageTransistion from "../components/UI/PageTransistion";
import MetaData from "../components/MetaData";

const Chat = () => {
  // Keeps track of the chatId of customer chat
  const [chatId, setChatId] = useState("");

  // Stores information about the customer chat
  const [chatInfo, setChatInfo] = useState(null);

  // Stores messages about the customer chat
  const [messages, setMessages] = useState([]);

  // Online status of the customer support agent (admin)
  const [agentStatus, setAgentStatus] = useState(false);

  // Typing status of the customer support agent (admin)
  const [isTyping, setIsTyping] = useState(false);

  // Socket ID of the customer support agent (admin)
  const [socketReceiverId, setSocketReceiverId] = useState("");

  const { userInfo } = useSelector((state) => state?.auth);

  const [getSingleChat, { isLoading: isChatDataLoading }] =
    useLazyGetSingleChatQuery();

  const [createChat, { isLoading: isChatCreating }] = useCreateChatMutation();

  // Intializing Socket Connection
  const { socket } = useCreateSocket();

  const setMessagesHandler = (messageInfo) => {
    setMessages(messageInfo);
  };

  // Checks if admin (a.k.a) customer support person is online (or) offline
  const isAgentOnlineListener = (data) => {
    // If online then set agentStatus as true, else false
    if (data) {
      setAgentStatus(true);
    } else {
      setAgentStatus(false);
    }
  };

  // Making API request to get create new chat
  const createChatHandler = useCallback(async () => {
    try {
      const chatRes = await createChat().unwrap();

      setChatId(chatRes?.chatId);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  }, [createChat]);

  // Making API request to get all the messages of single chat
  const getAllMessagesOfChatHandler = useCallback(
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

  // Fetching all messages of a chat
  useEffect(() => {
    if (chatId) {
      getAllMessagesOfChatHandler(chatId);
    }
  }, [chatId, getAllMessagesOfChatHandler]);

  // Adding New User to socket and getting whether customer support agent (admin) is online (or) not
  useAddUserToSocket(
    socket,
    userInfo?.id,
    userInfo?.role,
    "isAgentOnline",
    isAgentOnlineListener
  );

  // Marks unseen messages in the current chat as seen
  useMarkMessagesAsSeen(chatInfo, socket, 1, messages, toast);

  // Manages the typing status of the admin (whether typing or not)
  useTypingStatus(socket, setIsTyping, setSocketReceiverId);

  // Listens for new messages from the chat receiver's (admin) socket and adds them to the messages array
  useGetMessage(socket, messages, chatInfo?.usersInChat[1]?._id, setMessages);

  // Listens for messages that have been seen by admin and updates the chat accordingly
  useMessageSeen(socket, getAllMessagesOfChatHandler);

  // Create Chat between customer support agent and customer (or) user who is logged in
  useEffect(() => {
    if (userInfo?.id) {
      createChatHandler();
    }
  }, [userInfo?.id, createChatHandler]);

  // Admin as user can't chat with himself
  if (userInfo?.role === "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <PageTransistion styleProp="pt-[4.5rem] pb-16 space-y-4 max-w-7xl mx-auto px-4 relative h-screen">
      <MetaData title="Customer-Support-Chat" />
      <p className="text-center font-semibold text-xl font-public-sans text-neutral-500 drop-shadow max-[500px]:text-lg">
        Customer Support Assistance
      </p>

      {/* Showing Loader while creating a new chat and when chat messages are loading */}
      {(isChatCreating || isChatDataLoading) && (
        <Loader styleProp="flex items-center justify-center h-[50vh]" />
      )}

      {/* emojiPlaceOfUse="top-2 left-44" */}

      {/* Displaying chatContent like messages */}
      {!isChatDataLoading && chatInfo && (
        <ChatContent
          chatId={chatInfo?._id}
          username={`Customer Support Agent (${chatInfo?.usersInChat[1]?.username})`}
          profileImg={chatInfo?.usersInChat[1]?.profileImg?.url}
          messages={messages}
          receiverId={chatInfo?.usersInChat[1]?._id}
          socketReceiverId={socketReceiverId}
          setMessagesHandler={setMessagesHandler}
          socket={socket}
          isCustomerOnline={agentStatus}
          emojiPlaceOfUse="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          isTyping={isTyping}
        />
      )}
    </PageTransistion>
  );
};

export default Chat;

// Adding New User to socket
// useEffect(() => {
//   const isAgentOnlineListener = (data) => {
//     if (data) {
//       setAgentStatus(true);
//     } else {
//       setAgentStatus(false);
//     }
//     console.log("isAgentOnline: ", data);
//   };

//   if (socket) {
//     socket.emit("addNewUser", { userId: userInfo?.id, role: userInfo?.role });

//     socket.on("isAgentOnline", isAgentOnlineListener);
//   }

//   return () => {
//     if (socket) {
//       socket.off("isAgentOnline", isAgentOnlineListener);
//     }
//   };
// }, [socket]);
