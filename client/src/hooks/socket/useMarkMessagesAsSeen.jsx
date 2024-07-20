import { useEffect } from "react";
import { useMarkMessagesAsSeenMutation } from "../../redux/features/messages/messagesApiSlice";

const useMarkMessagesAsSeen = (chatInfo, socket, index, messages, toast) => {
  const [markMessagesAsSeen] = useMarkMessagesAsSeenMutation();

  const markMessageSeenHandler = async () => {
    try {
      const objData = {
        chatId: chatInfo?._id,
        userId: chatInfo?.usersInChat[index]?._id,
      };

      // Making request to mark unseen messages as seen
      const messageRes = await markMessagesAsSeen(objData).unwrap();

      // Only emit messageSeen when unseen messages are present
      messageRes?.areMessagesUpdated && socket.emit("messageSeen", objData);
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // When we mark messages as seen when we select a particular chat (or) if messages are getting added in that chat
  useEffect(() => {
    // If chatId is present then only we are marking messages as seen
    if (chatInfo?._id) {
      markMessageSeenHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatInfo, messages]);
};

export default useMarkMessagesAsSeen;
