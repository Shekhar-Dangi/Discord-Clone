import socketIO from "socket.io-client";

export default function socketController() {
  const socket = socketIO.connect("http://localhost:8000");
  console.log("Called");

  const disconnect = () => {
    socket.disconnect();
    console.log("Socket disconnected");
  };

  return { socket, disconnect };
}
