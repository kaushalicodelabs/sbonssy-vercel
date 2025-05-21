"use client";

import { useState } from "react";
import ChatLayout from "@/components/chat/ChatLayout";
// import { useAuthStore } from "@/store/useAuthStore";
import { SocketProvider } from "@/context/SocketContext";
import { useAuthStore } from "@/store/authStore";

export default function ChatPage() {
  const { user } = useAuthStore();

  const [activeChat, setActiveChat] = useState(null);

  if (!user) return <div className="p-4">Loading user data...</div>;

  return (
    <SocketProvider>
      <ChatLayout
        currentUser={user}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />
    </SocketProvider>
  );
}
