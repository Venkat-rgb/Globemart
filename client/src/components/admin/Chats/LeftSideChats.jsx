import { BiSearchAlt } from "react-icons/bi";
import { useCallback, useEffect, useState } from "react";
import { useLazyGetAllChatsOfUserQuery } from "../../../redux/features/chats/chatsApiSlice";
import toast from "react-hot-toast";
import ChatMessage from "./ChatMessage";
import SmallLoader from "../../UI/SmallLoader";
import ErrorUI from "../../UI/ErrorUI";
import { HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";

const LeftSideChats = ({
  userInfoId,
  setChatIdHandler,
  selectedChat,
  setSelectedChatHandler,
  isCustomerOnlineCheckHandler,
  messages,
  socket,
}) => {
  // When particular chat is selected, chatId keeps track of that chat
  const [searchName, setSearchName] = useState("");

  // Keeps track of all the chats available
  const [chatsData, setChatsData] = useState([]);

  const [getAllChats, { isLoading: areChatsLoading, isError: chatsError }] =
    useLazyGetAllChatsOfUserQuery();

  const sortChats = (chats) => {
    const validChats = [],
      invalidChats = [];

    chats?.forEach((chat) => {
      // If chat contains lastMessage sentAt time then storing them in validChats which are used below for sorting
      if (chat?.lastMessage?.messageSentAt) {
        validChats.push(chat);
      } else {
        // If chat doesn't contain lastMessage sentAt time, then storing them in invalidChats which can't be used for sorting
        invalidChats.push(chat);
      }
    });

    // Sorting valid chats in descending order
    let sortedChats = validChats?.sort((firstChat, secondChat) => {
      const firstChatTime = new Date(
        firstChat?.lastMessage?.messageSentAt
      ).getTime();
      const secondChatTime = new Date(
        secondChat?.lastMessage?.messageSentAt
      ).getTime();

      return secondChatTime - firstChatTime;
    });

    // Appending invalid chats at the end of sortedChats
    sortedChats = sortedChats.concat(invalidChats);

    return sortedChats;
  };

  const getAllChatsHandler = useCallback(
    async (name = "") => {
      try {
        // fetching all chats of logged in user (or) chats by name
        const chatRes = name
          ? await getAllChats(name).unwrap()
          : await getAllChats().unwrap();

        // Sorting chats in descending order based on lastMessage time
        const sortedChats = sortChats(chatRes?.chats);

        // Storing all the available chats in 'chats' state
        setChatsData(sortedChats);
      } catch (err) {
        toast.error(err?.message || err?.data?.message);
      }
    },
    [getAllChats]
  );

  // Implement debouncing while searching for customer chats by name
  useEffect(() => {
    let timer;

    // If admin searches chat by name, then we get all chats with that name after applying debouncing of 300 milliseconds
    if (searchName?.trim()) {
      timer = setTimeout(() => {
        getAllChatsHandler(searchName.trim());
      }, 300);
    } else {
      // If admin doesn't search any chat by name, then fetching available chats
      getAllChatsHandler();
    }

    // Making sure that each timer is cleared after it completes
    return () => {
      timer && clearTimeout(timer);
    };
  }, [searchName, messages, getAllChatsHandler]);

  return (
    <div className="min-[900px]:col-span-3 max-[900px]:col-span-4 p-2 font-inter space-y-3 bg-white">
      <div className="flex items-center justify-center gap-3">
        <p className="text-center text-xl font-semibold text-neutral-500/90 pb-2">
          Chats
        </p>

        <HiOutlineChatBubbleLeftEllipsis
          size={25}
          className="text-neutral-600 flex-shrink-0"
        />
      </div>
      <div className="border flex items-center px-3 gap-2 rounded">
        {/* Input for searching chat name */}
        <BiSearchAlt className="text-[1.3rem] text-neutral-500" />
        <input
          type="text"
          placeholder="Search customer chats..."
          className="outline-none w-full py-1.5 rounded"
          onChange={(e) => setSearchName(e.target.value)}
          value={searchName}
        />
      </div>

      <div className="space-y-2.5 h-[70vh] max-[700px]:h-[40vh] overflow-y-scroll pr-0.5 pb-2">
        {/* Showing Loader while chats are loading */}
        {areChatsLoading && (
          <div className="flex items-center justify-center h-1/2">
            <SmallLoader />
          </div>
        )}

        {/* Showing errMsg, if an error occured during fetching chats  */}
        {chatsError && (
          <ErrorUI message="Unable to fetch chats due to some error!" />
        )}

        {/* Showing chatsData when chats data is available */}
        {!areChatsLoading &&
          chatsData?.map((chat) => (
            <ChatMessage
              key={chat?._id}
              id={chat?._id}
              username={chat?.usersInChat[0]?.username}
              profileImg={chat?.usersInChat[0]?.profileImg?.url}
              senderId={chat?.usersInChat[0]?._id}
              lastMessage={chat?.lastMessage?.message}
              lastMessageTime={chat?.lastMessage?.messageSentAt}
              lastMessageSeen={chat?.lastMessage?.messageSeen}
              lastMessageSender={chat?.lastMessage?.sender?._id}
              loggedInUserId={userInfoId}
              setChatIdHandler={setChatIdHandler}
              selectedChat={selectedChat}
              setSelectedChatHandler={setSelectedChatHandler}
              isCustomerOnline={isCustomerOnlineCheckHandler(
                chat?.usersInChat[0]?._id
              )}
              socket={socket}
              getAllChatsHandler={getAllChatsHandler}
            />
          ))}

        {/* Showing message when there are no chats available for admin to chat with */}
        {!areChatsLoading && chatsData?.length === 0 && (
          <p className="text-center pt-20 text-xl font-medium text-neutral-500">
            No Chats found!
          </p>
        )}
      </div>
    </div>
  );
};

export default LeftSideChats;

// import { BiSearchAlt } from "react-icons/bi";
// import ChatMessage from "./ChatMessage";

// const LeftSideChats = ({
//   chatsData,
//   setSearchName,
//   areChatsLoading,
//   userInfoId,
//   setChatIdHandler,
//   selectedChat,
//   setSelectedChatHandler,
//   isCustomerOnlineCheckHandler,
// }) => {
//   return (
//     <div className="col-span-3 p-2 font-inter space-y-3 bg-white">
//       <p className="text-center text-xl font-semibold text-neutral-500/90 pb-2">
//         Messages
//       </p>
//       <div className="border flex items-center px-3 gap-2 rounded">
//         <BiSearchAlt className="text-[1.3rem] text-neutral-500" />
//         <input
//           type="text"
//           placeholder="Search customer chats..."
//           className="outline-none w-full py-1.5 rounded"
//           onChange={(e) => setSearchName(e.target.value)}
//         />
//       </div>

//       <div className="space-y-2.5 h-[70vh] overflow-y-scroll pr-0.5">
//         {chatsData?.map((chat) => (
//           <ChatMessage
//             key={chat?._id}
//             id={chat?._id}
//             username={chat?.usersInChat[0]?.username}
//             profileImg={chat?.usersInChat[0]?.profileImg?.url}
//             lastMessage={chat?.lastMessage?.message}
//             lastMessageTime={chat?.lastMessage?.messageSentAt}
//             lastMessageSeen={chat?.lastMessage?.messageSeen}
//             lastMessageSender={chat?.lastMessage?.sender?._id}
//             loggedInUserId={userInfoId}
//             setChatIdHandler={setChatIdHandler}
//             selectedChat={selectedChat}
//             setSelectedChatHandler={setSelectedChatHandler}
//             isCustomerOnline={isCustomerOnlineCheckHandler(
//               chat?.usersInChat[0]?._id
//             )}
//           />
//         ))}
//         {!areChatsLoading && chatsData?.length === 0 && (
//           <p className="text-center pt-20 text-xl font-medium text-neutral-500">
//             No Chats found!
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeftSideChats;
