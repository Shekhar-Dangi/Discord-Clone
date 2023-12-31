import socketIO from "socket.io-client";

export default function socketController() {
  const socket = socketIO.connect("https://discord-server-hu1l.onrender.com", {
    withCredentials: true,
  });

  const disconnect = () => {
    socket.disconnect();
    console.log("Socket disconnected");
  };

  return { socket, disconnect };
}
