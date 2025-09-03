import { io } from "socket.io-client";

let socket: any = null;

// Initialize socket if not already created
const getSocket = () => {
  if (!socket) {
    socket = io("https://server.pranimithra.in/video", {
        reconnection: true,
        transports: ['websocket']
    });
  }
  return socket;
};

// Get current socket instance (can be null)
const getSocketDetails = () => {
  return socket || null;
};

// Explicitly disconnect and reset socket instance
const resetSocket = () => {
  if (socket) {
    socket.disconnect();
  }
  socket = null;
};

export default {
  getSocket,
  getSocketDetails,
  resetSocket,
};
