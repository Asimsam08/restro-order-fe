
import { io } from "socket.io-client";
import { SOCKET_URL } from "@/utils/constant";

// const socket = io("http://localhost:8000", {
//   withCredentials: true,
//   transports: ["websocket"], 
// });

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"], 
});

export default socket;


