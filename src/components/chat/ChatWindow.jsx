"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import Image from "next/image";

export default function ChatWindow({ currentUser, activeChat }) {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/messages?user1=${currentUser.onboardedDetails._id}&user2=${activeChat._id}`
        );
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeChat._id, currentUser.onboardedDetails._id]);

  useEffect(() => {
    if (!socket || !currentUser?.onboardedDetails?._id) return;

    // Join user's room
    socket.emit("join-user-room", currentUser.onboardedDetails._id);

    // Listen for incoming messages
    const handleReceiveMessage = (newMessage) => {
      if (
        newMessage.senderId === activeChat._id ||
        newMessage.receiverId === activeChat._id
      ) {
        setMessages((prev) => {
          // Filter out any temporary messages that might have been replaced
          const filtered = prev.filter(
            (msg) =>
              !msg._id.toString().startsWith("temp-") ||
              msg._id !== `temp-${newMessage._id}`
          );
          return [...filtered, newMessage];
        });
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, currentUser.onboardedDetails._id, activeChat._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !socket || isSending) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      senderId: currentUser.onboardedDetails._id,
      receiverId: activeChat._id,
      content: message.trim(),
      _id: tempId,
      timestamp: new Date(),
      read: false,
    };

    setIsSending(true);
    try {
      // Optimistically update UI
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");

      // Send TTL5 via socket
      socket.emit("send-message", {
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        content: newMessage.content,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the optimistic update if there was an error
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  const getProfileImage = (user) => {
    if (user.role === "brand" && user.onboardedDetails?.brand?.companyLogo)
      return user.onboardedDetails.brand.companyLogo;
    if (user.images?.length > 0) {
      const profileImage = user.images.find((img) => img.isProfile);
      return profileImage?.url || user.images[0].url;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center">
        {getProfileImage(activeChat) ? (
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <Image
              src={getProfileImage(activeChat)}
              width={40}
              height={40}
              alt={activeChat.name}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            <span className="text-gray-600 font-medium">
              {activeChat.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h2 className="font-semibold">{activeChat.name}</h2>
          <p className="text-xs text-gray-500">
            {activeChat.role === "brand"
              ? activeChat.companyName
              : activeChat.sport
              ? `${activeChat.sport}${
                  activeChat.level ? ` • ${activeChat.level}` : ""
                }`
              : activeChat.role}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length > 0 ? (
          messages
            .filter((msg) => !msg._id.toString().includes("temp"))
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .map((msg) => {
              return (
                <div
                  key={msg._id}
                  className={`mb-4 flex ${
                    msg.senderId === currentUser.onboardedDetails._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.senderId === currentUser.onboardedDetails._id
                        ? "bg-blue-500 text-white"
                        : "bg-white border border-gray-200"
                    } ${
                      msg._id.toString().startsWith("temp-") ? "opacity-80" : ""
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderId === currentUser.onboardedDetails._id
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {/* {msg._id.toString().startsWith("temp-") && " (Sending...)"} */}
                    </p>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        )}
        {/* <div ref={messagesEndRef} /> */}
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSending}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isSending}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
