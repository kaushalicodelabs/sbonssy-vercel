"use client";
import React, { useEffect, useState } from "react";
import Pagination from "./Pagination/pagination";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

const AllTeamCollaborationRequests = ({
  invites = [],
  accepted = [],
  invitesTotal = 0,
  acceptedTotal = 0,
  onActionComplete,
  noInvitesMessage = "No pending invites found",
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState({});
  const [localInvites, setLocalInvites] = useState(invites);

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
        await onActionComplete();
      }
    } catch (error) {
      console.log("Error processing invite:", error);
      // Revert optimistic update on error
      setLocalInvites(invites);
    } finally {
      setLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const formatSports = (sports) => {
    if (!sports) return "Sport not specified";
    if (Array.isArray(sports)) return sports.join(", ");
    return sports;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      {/* Pending Invites Section */}
      <section>
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Pending Invites
        </h1>
        <button
          onClick={() => {
            router.push(`/sports-ambassador/all-team-invites`);
          }}
          className="text-blue-600 hover:text-blue-800 font-medium mb-4"
        >
          View More
        </button>
        {localInvites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {noInvitesMessage}
            </h3>
            <p className="text-sm text-gray-500">
              Try checking back later for new invites.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localInvites.map((invite) => {
                const subRole = invite?.brandId?.subRole;
                const subRoleData = invite?.brandId[subRole];
                const name = subRoleData?.name || "Unnamed";
                const image =
                  subRoleData?.images?.[0]?.url || "/default-avatar.png";

                return (
                  <div
                    key={invite._id}
                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={image}
                        alt={name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <div className="flex-1">
                        <h2 className="text-base font-semibold text-gray-900">
                          {name}
                        </h2>
                        <p className="text-xs text-gray-600 mt-1 capitalize">
                          Role: {subRole || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        disabled={loading[invite._id]}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-150 w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() =>
                          handleRequestAction(invite._id, "accept")
                        }
                      >
                        {loading[invite._id] ? "Processing..." : "Accept"}
                      </button>
                      <button
                        disabled={loading[invite._id]}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150 w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() =>
                          handleRequestAction(invite._id, "reject")
                        }
                      >
                        {loading[invite._id] ? "Processing..." : "Reject"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Accepted Collaborations Section */}
      <section>
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Accepted Collaborations
        </h1>
        <button
          onClick={() => {
            router.push(`/sports-ambassador/accepted-team-invites`);
          }}
          className="text-blue-600 hover:text-blue-800 font-medium mb-4"
        >
          View More
        </button>
        {accepted.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No accepted collaborations found
            </h3>
            <p className="text-sm text-gray-500">
              You don't have any accepted collaborations yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accepted.map((req, index) => {
                const subRole = req?.subRole || "";
                const name = req[subRole]?.name || "Unknown Athlete";
                const sport = req[subRole]?.sport || req[subRole]?.sports;
                const image =
                  req[subRole]?.images?.[0]?.url || "/default-athlete.jpg";

                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/default-athlete.jpg";
                        }}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1 text-center">
                        {name}
                      </h3>
                      <p className="text-gray-600 mb-4 text-center">
                        {formatSports(sport)}
                      </p>
                      <button className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300">
                        Send Message
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AllTeamCollaborationRequests;
