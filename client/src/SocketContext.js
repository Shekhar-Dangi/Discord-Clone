import React, { createContext, useContext, useEffect, useState } from "react";
import socketController from "./sockets/socket-controller";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const { socket, disconnect } = socketController();
    setSocket(socket);

    return () => {
      disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
