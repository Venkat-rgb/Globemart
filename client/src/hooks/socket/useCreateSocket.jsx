import { useEffect } from "react";
import toast from "react-hot-toast";
import { socket } from "../../socket";

const useCreateSocket = () => {
  useEffect(() => {
    const socketErrorHandler = (error) => {
      toast.error(error?.message);
    };

    const socketConnectErrorHandler = () => {
      toast.error(
        "Unable to connect to the chat server. Please check your internet connection and try again!"
      );
    };

    const socketReconnectFailedHandler = () => {
      toast.error(
        "Unable to reconnect to the chat server. Please refresh the page!"
      );
    };

    if (socket) {
      socket.connect();

      // Normal socket errors are handled
      socket.on("error", socketErrorHandler);

      // Connectivity errors are handled
      socket.on("connect_error", socketConnectErrorHandler);

      // Reconnection errors are handled
      socket.on("reconnect_failed", socketReconnectFailedHandler);
    }

    return () => {
      socket.off("error", socketErrorHandler);

      socket.off("connect_error", socketConnectErrorHandler);

      socket.off("reconnect_failed", socketReconnectFailedHandler);

      socket.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // Above add the dependency as socket, if you are getting any connectivity issues.

  return { socket };
};

export default useCreateSocket;
