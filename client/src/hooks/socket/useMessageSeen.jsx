import { useEffect } from "react";

const useMessageSeen = (socket, getMessagesHandler) => {
  useEffect(() => {
    const getMessageSeenListener = (messageSeenInfo) => {
      const { chatId } = messageSeenInfo;

      // Fetching all the messages again with chatId to get updated messageSeen status
      getMessagesHandler(chatId);
    };

    if (socket) {
      // Listening to getMessageSeen event to fetch new updated messageSeenStatus messages
      socket.on("getMessageSeen", getMessageSeenListener);
    }

    return () => {
      // Removing the listener, when user is out of the chat (or) offline.
      socket.off("getMessageSeen", getMessageSeenListener);
    };
  }, [socket, getMessagesHandler]);
};

export default useMessageSeen;
