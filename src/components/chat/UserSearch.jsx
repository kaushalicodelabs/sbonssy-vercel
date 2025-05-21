"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function UserSearch({
  currentUser,
  searchQuery,
  setSearchQuery,
  setActiveChat,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const getSearchRole = () => {
    if (currentUser.role === "brand") return "sports-ambassador";
    if (currentUser.role === "sports-ambassador") return "brand";
    return "";
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timerId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const searchUsers = async (query) => {
    setIsSearching(true);
    try {
      const searchRole = getSearchRole();
      const response = await fetch(
        `/api/users/search?query=${encodeURIComponent(
          query
        )}&role=${searchRole}`
      );
      if (!response.ok) throw new Error("Failed to search users");
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const getProfileImage = (user) => {
    if (user.role === "brand" && user.companyLogo) return user.companyLogo;
    if (user.images?.length > 0) {
      const profileImage = user.images.find((img) => img.isProfile);
      return profileImage?.url || user.images[0].url;
    }
    return null;
  };

  const getSubtitle = (user) => {
    switch (user.role) {
      case "brand":
        return user.companyName || "Brand";
      case "athlete":
      case "sports-ambassador":
        return `${user.sport || "Athlete"}${
          user.level ? ` • ${user.level}` : ""
        }`;
      case "team":
        return `${user.sports?.join(", ") || "Team"}${
          user.level ? ` • ${user.level}` : ""
        }`;
      default:
        return user.role;
    }
  };

  return (
    <div className="relative mt-3">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={
          currentUser.role === "brand"
            ? "Search sports ambassadors..."
            : currentUser.role === "sports-ambassador"
            ? "Search brands..."
            : "Search users..."
        }
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {searchQuery && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="p-3 text-center text-gray-500 text-sm">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => {
              const profileImage = getProfileImage(user);
              return (
                <div
                  key={user._id}
                  className="p-3 hover:bg-gray-50 cursor-pointer flex items-center border-b border-gray-100 last:border-0"
                  onClick={() => {
                    setActiveChat({
                      id: user._id,
                      name: user.name,
                      role: user.role,
                      ...user,
                    });
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  {profileImage ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                      <Image
                        src={profileImage}
                        width={40}
                        height={40}
                        alt={user.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-gray-600 font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {getSubtitle(user)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-3 text-center text-gray-500 text-sm">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
