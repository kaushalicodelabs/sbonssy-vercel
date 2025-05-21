"use client";

import { useState } from "react";
import ConversationsList from "./ConversationsList";
import ChatWindow from "./ChatWindow";
import UserSearch from "./UserSearch";

export default function ChatLayout({ currentUser, activeChat, setActiveChat }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Messages</h2>
          <UserSearch
            currentUser={currentUser}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setActiveChat={setActiveChat}
          />
        </div>
        <ConversationsList
          currentUser={currentUser}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          searchQuery={searchQuery}
        />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <ChatWindow currentUser={currentUser} activeChat={activeChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-6 max-w-md">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery ? "Search results" : "No chat selected"}
              </h2>
              <p className="text-gray-500">
                {searchQuery
                  ? "Select a user to start chatting"
                  : "Choose a conversation or search for a user"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
