import { useEffect } from "react";

const useAddUserToSocket = (
  socket,
  userId,
  role,
  eventName,
  setDataHandler
) => {
  useEffect(() => {
    if (socket) {
      socket.emit("addNewUser", { userId, role });

      socket.on(eventName, setDataHandler);
    }

    return () => {
      if (socket) {
        socket.off(eventName, setDataHandler);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
};

export default useAddUserToSocket;
