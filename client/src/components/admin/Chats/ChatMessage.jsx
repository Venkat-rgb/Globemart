import { Badge, Tooltip } from "@mui/material";
import { IoCheckmarkDone } from "react-icons/io5";
import moment from "moment";
import LazyImage from "../../LazyImage";
import { useCallback, useEffect, useState } from "react";

const ChatMessage = ({
  id,
  username,
  profileImg,
  senderId,
  lastMessage,
  lastMessageTime,
  lastMessageSeen,
  lastMessageSender,
  unreadMessagesCount,
  loggedInUserId,
  setChatIdHandler,
  isCustomerOnline,
  selectedChat,
  setSelectedChatHandler,
  updateChatLastMessage,
  socket,
}) => {
  // Keeps track of unread messages
  const [unreadCount, setUnreadCount] = useState(unreadMessagesCount);

  const getMessageNotificationHandler = useCallback(
    (messageInfo) => {
      const {
        sender: { _id: notificationSenderId },
      } = messageInfo;

      if (senderId === notificationSenderId) {
        if (selectedChat !== id) {
          setUnreadCount((prev) => prev + 1);
        }
        updateChatLastMessage(id, messageInfo);
      }
    },
    [senderId, selectedChat, id, updateChatLastMessage]
  );

  useEffect(() => {
    if (socket) {
      socket.on("getMessageNotification", getMessageNotificationHandler);
    }

    return () => {
      if (socket) {
        socket.off("getMessageNotification", getMessageNotificationHandler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, getMessageNotificationHandler]);

  useEffect(() => {
    if (selectedChat === id) {
      setUnreadCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat, id]);

  // Selecting particular chat based on id and storing that chatId into state
  return (
    <div
      className={`${
        selectedChat === id ? "border-r-4 border-neutral-800/70" : ""
      } bg-neutral-200/60 px-2 py-2.5 rounded-md cursor-pointer`}
      onClick={() => {
        setChatIdHandler(id);
        setSelectedChatHandler(id);
      }}
    >
      <div className="relative flex items-center gap-4 w-full">
        <div className="relative w-10 h-10 flex-shrink-0">
          {/* Profile Image of customer */}
          <LazyImage
            imageProps={{
              src: profileImg,
              alt: `profile-img-${id}`,
            }}
            skeletonVariant="circular"
            styleProp="border rounded-full"
            skeletonWidth={40}
            skeletonHeight={40}
          />
          {/* Checking whether customer is online (or) offline */}
          <Tooltip
            title={isCustomerOnline ? "Online" : "Offline"}
            placement="top"
          >
            <div
              className={`absolute ${
                isCustomerOnline ? "bg-green-500" : "bg-neutral-500"
              } top-0 right-0 w-3 h-3 border border-white rounded-full`}
            />
          </Tooltip>
        </div>
        <div className="space-y-0.5 flex-1">
          {/* Username of customer */}
          <p className="text-neutral-500 font-medium line-clamp-1 capitalize">
            {username}
          </p>

          {/* Showing last message by either sender (or) receiver */}
          {lastMessage && (
            <div className="flex items-center gap-1">
              {lastMessageSender === loggedInUserId && (
                <IoCheckmarkDone
                  className={`text-[1rem] ${
                    lastMessageSeen ? "text-indigo-600" : "text-neutral-500"
                  } flex-shrink-0`}
                />
              )}

              <p className="text-neutral-500/75 font-medium text-sm line-clamp-1">
                {lastMessage}
              </p>
            </div>
          )}
        </div>

        {/* Time at which last message was sent in a particular chat */}
        {lastMessage && (
          <Tooltip
            title={new Date(lastMessageTime).toLocaleDateString()}
            placement="left"
          >
            <span className="text-xs text-neutral-400 font-medium self-start">
              {moment(lastMessageTime).format("LT")}
            </span>
          </Tooltip>
        )}

        {unreadCount > 0 && (
          <Tooltip title="Unread" placement="left">
            <span className="absolute right-0 bottom-0 flex items-center justify-center text-[0.7rem] font-inter w-[1.1rem] h-[1.1rem] text-white bg-indigo-400 rounded-full">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
