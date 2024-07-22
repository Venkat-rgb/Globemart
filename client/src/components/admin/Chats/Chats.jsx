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
