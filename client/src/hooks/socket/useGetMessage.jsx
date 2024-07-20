import { useEffect } from "react";

const useGetMessage = (socket, messages, chatInfoId, setMessages) => {
  useEffect(() => {
    const getMessageListener = (messageData) => {
      // Checking if sender is same then only add this message to messages array
      // If you dont check the below condition then this message will be added to messages array and every user can see these messages in admin dashboard
      if (chatInfoId === messageData?.sender?._id) {
        setMessages([...messages, messageData]);
      }
    };

    if (socket) {
      // Listening to getMessage event to add this message to messages array
      socket.on("getMessage", getMessageListener);
    }

    return () => {
      // Removing the listener, when user is out of the chat (or) offline.
      socket.off("getMessage", getMessageListener);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, messages]);
};

export default useGetMessage;
