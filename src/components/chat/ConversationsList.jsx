"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ConversationsList({
  currentUser,
  activeChat,
  setActiveChat,
  searchQuery,
}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(
          `/api/conversations?userId=${currentUser.onboardedDetails._id}`
        );
        if (!response.ok) throw new Error("Failed to fetch conversations");
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.onboardedDetails?._id) {
      fetchConversations();
    }
  }, [currentUser.onboardedDetails._id]);

  const getProfileImage = (user) => {
    if (user.role === "brand" && user.companyLogo) {
      return user.companyLogo;
    }
    if (user.images?.length > 0) {
      const profileImage = user.images.find((img) => img.isProfile);
      return profileImage?.url || user.images[0].url;
    }
    return null;
  };

  if (searchQuery) return null;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.length > 0 ? (
        conversations.map((conversation) => {
          const participant = conversation.participant;
          const profileImage = getProfileImage(participant);

          return (
            <div
              key={conversation._id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 flex items-center ${
                activeChat?._id === participant.id ? "bg-blue-50" : ""
              }`}
              onClick={() => setActiveChat(participant)}
            >
              {profileImage ? (
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <Image
                    src={profileImage}
                    width={48}
                    height={48}
                    alt={participant.name || participant.email}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-gray-600 font-medium text-lg">
                    {participant.name?.charAt(0).toUpperCase() ||
                      participant.email?.charAt(0).toUpperCase() ||
                      "?"}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {participant.name || participant.email}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage?.content || "No messages yet"}
                </p>
              </div>
              {conversation.lastMessage && (
                <div className="ml-auto text-xs text-gray-400">
                  {new Date(
                    conversation.lastMessage.timestamp
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="p-4 text-center text-gray-500">
          {currentUser.role === "brand"
            ? "Start a conversation with a sports ambassador"
            : "No conversations yet"}
        </div>
      )}
    </div>
  );
}
