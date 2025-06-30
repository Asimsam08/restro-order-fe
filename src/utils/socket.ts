
import { io } from "socket.io-client";
import { BASE_API_ENDPOINT } from "@/utils/constant";

// const socket = io("http://localhost:8000", {
//   withCredentials: true,
//   transports: ["websocket"], 
// });

const socket = io(BASE_API_ENDPOINT, {
  withCredentials: true,
  transports: ["websocket"], 
});

export default socket;


