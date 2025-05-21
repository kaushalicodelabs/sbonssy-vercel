"use client";
import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import Pagination from "./Pagination/pagination";
import { useRouter } from "next/navigation";

const TeamInvites = ({
  invites = [],
  error,
  currentPage,
  limit,
  total,
  onActionComplete,
}) => {
  const pageCount = Math.ceil(total / limit);
  const router = useRouter();
  const [loading, setLoading] = useState({});
  const [localInvites, setLocalInvites] = useState(invites); // Local state for optimistic updates

  // Sync invites prop with local state when it changes
  useEffect(() => {
    setLocalInvites(invites);
  }, [invites]);

  const handleRequestAction = async (requestId, action) => {
    try {
      setLoading((prev) => ({ ...prev, [requestId]: true }));

      // Optimistically remove the invite from the list
      setLocalInvites((prev) =>
        prev.filter((invite) => invite._id !== requestId)
      );

      const resp = await api.put(`/sports/collaboration-invite`, {
        requestId,
        action, // 'accept' or 'decline'
        status: action === "accept" ? "accepted" : "rejected",
      });

      // Call the callback to notify parent that an action was completed
      if (onActionComplete) {
        await onActionComplete(); // Ensure this is awaited
      }
    } catch (error) {
      // Revert optimistic update on error
      setLocalInvites(invites);
    } finally {
      setLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };
  const handlePageChange = (selectedPage) => {
    router.push(`/sports-ambassador/team-invites?page=${selectedPage}`, {
      scroll: false, // Optional: prevent scrolling to top
    });
  };
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="p-4 text-red-500 bg-red-50 rounded-lg">
          <h3 className="text-xl font-bold">Error loading invites</h3>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Team Invites</h3>

      {/* Pending invites */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-gray-800 mb-4">Invites</h4>
        {localInvites.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No pending invites</p>
          </div>
        ) : (
          <div className="space-y-4">
            {localInvites.map((invite) => {
              const subRole = invite?.brandId?.subRole;
              const subRoleData = invite?.brandId[subRole];
              const name = subRoleData?.name;
              const image =
                subRoleData?.images?.[0]?.url || "/效default-avatar.png";

              return (
                <div
                  key={invite._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={image}
                      alt={name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>

                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                        {subRole}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                      disabled={loading[invite._id]}
                      // class
                      // RobiTrans
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleRequestAction(invite._id, "accept")}
                    >
                      {loading[invite._id] ? "Processing..." : "Accept"}
                    </button>
                    <button
                      disabled={loading[invite._id]}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleRequestAction(invite._id, "reject")}
                    >
                      {loading[invite._id] ? "Processing..." : "Reject"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {pageCount > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default TeamInvites;
