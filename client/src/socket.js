import { io } from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_APP_SOCKET_BACKEND_URL;

export const socket = io(ENDPOINT, { autoConnect: false });
