import { useEffect } from "react";

const useTypingStatus = (socket, setIsTyping, setSocketReceiverId) => {
  useEffect(() => {
    const typingStatusListener = (typingInfo) => {
      const { senderId, typingStatus } = typingInfo;
      setIsTyping(typingStatus);

      // setting socketReceiverId to make sure that typing status is shown to only this particular user and not all users in admin dashboard different chats
      setSocketReceiverId(senderId);
    };

    if (socket) {
      // Listening to getTypingStatus event to know whether user is typing (or) not
      socket.on("getTypingStatus", typingStatusListener);
    }

    return () => {
      // Removing the listener, when user is out of the chat (or) offline.
      socket.off("getTypingStatus", typingStatusListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
};

export default useTypingStatus;
