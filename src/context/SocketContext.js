"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(
      process.env.NEXTAUTH_URL || "http://localhost:3000",
      {
        path: "/socket.io",
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setSocket(socketInstance);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocket(null);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
