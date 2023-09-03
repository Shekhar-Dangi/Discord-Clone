import socketIO from "socket.io-client";

export default function socketController() {
  const socket = socketIO.connect(
    "https://discord-clone-shekhar-dangi.vercel.app/",
    {
      withCredentials: true,
    }
  );

  const disconnect = () => {
    socket.disconnect();
    console.log("Socket disconnected");
  };

  return { socket, disconnect };
}
