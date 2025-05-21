"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Pagination from "@/components/Pagination/pagination";
import api from "@/lib/axios";

const extractData = (ambassador, fields) => {
  // Check if this is a team ambassador
  if (ambassador.team) {
    return {
      name:
        ambassador.team.name || ambassador.team.teamClubName || "Unnamed Team",
      sport: Array.isArray(ambassador.team.sports)
        ? ambassador.team.sports.join(", ")
        : ambassador.team.sport || "N/A",
      level: ambassador.team.level || "N/A",
      image: ambassador.team.images?.find((img) => img.isProfile)?.url || null,
    };
  }

  // Original logic for individual ambassadors
  for (const role of fields.roles) {
    const data = ambassador[role];
    if (data) {
      return {
        name: data.name || "Unnamed",
        sport:
          data.sport ||
          (Array.isArray(data.sports) ? data.sports.join(", ") : "N/A"),
        level: data.level || "N/A",
        image: data.images?.find((img) => img.isProfile)?.url || null,
      };
    }
  }

  return {
    name: "Unnamed",
    sport: "N/A",
    level: "N/A",
    image: null,
  };
};

const getStatusBadge = (status) => {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${
        statusClasses[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

const CollaborationInviteClient = ({
  invites = [],
  total,
  currentPage,
  limit,
  initialRequests = {},
  onSend = async (ambassadorId) => {
    try {
      const response = await api.post("/sports/collaboration-invite", {
        ambassadorId,
      });
      return response.data;
    } catch (error) {
      console?.error("error", error);
      return null;
    }
  },
  onCancel = async (requestId) => {
    try {
      await api.delete(`/sports/collaboration-invite`, {
        data: { requestId },
      });
      return true;
    } catch (error) {
      console?.log("error", error);
      return false;
    }
  },
  roles = ["athlete", "coach", "paraAthlete", "exAthlete", "influencer"],
  sendButtonLabel = "Send Request",
  cancelButtonLabel = "Cancel Request",
  noInvitesMessage = "No ambassadors found to collaborate with",
}) => {
  const router = useRouter();
  const [requests, setRequests] = useState(initialRequests);
  const [loadingStates, setLoadingStates] = useState({});
  const pageCount = Math.ceil(total / limit);

  const handlePageChange = (selectedPage) => {
    router.push(`/sports-ambassador/all-invites?page=${selectedPage}`);
  };

  const handleSend = async (ambassadorId) => {
    // Check if there was a previous rejected request
    const previousRequest = requests[ambassadorId];
    const wasRejected = previousRequest?.status === "rejected";

    setLoadingStates((prev) => ({ ...prev, [ambassadorId]: "sending" }));
    const response = await onSend(ambassadorId);

    if (response) {
      setRequests((prev) => ({
        ...prev,
        [ambassadorId]: {
          id: response._id,
          status: response.status,
          createdAt: response.createdAt,
        },
      }));

      // If this was a re-attempt after rejection, refresh the page
      if (wasRejected) {
        router.refresh();
      }
    }
    setLoadingStates((prev) => ({ ...prev, [ambassadorId]: null }));
  };

  const handleCancel = async (ambassadorId) => {
    const request = requests[ambassadorId];
    if (!request) return;

    setLoadingStates((prev) => ({ ...prev, [ambassadorId]: "cancelling" }));
    const success = await onCancel(request.requestId || request.id);
    if (success) {
      setRequests((prev) => {
        const newState = { ...prev };
        delete newState[ambassadorId];
        return newState;
      });
      router.refresh();
    }
    setLoadingStates((prev) => ({ ...prev, [ambassadorId]: null }));
  };

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Collaboration Invites
      </h1>

      {invites.length === 0 ? (
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
            Try adjusting your search or check back later.
          </p>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {invites.map((invite) => {
              const { name, sport, level, image } = extractData(invite, {
                roles,
              });
              const request = requests[invite._id];
              const isLoading = loadingStates[invite._id];
              const isRejected = request?.status === "rejected";

              return (
                <li
                  key={invite._id}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
                >
                  <div className="flex items-center space-x-3">
                    {image ? (
                      <img
                        src={image}
                        alt={`${name}'s profile`}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-base font-semibold text-gray-900">
                        {name}
                      </h2>
                      <p className="text-xs text-gray-600 mt-1">
                        Sport: {sport}
                      </p>
                      <p className="text-xs text-gray-600">Level: {level}</p>
                    </div>
                  </div>

                  {request && !isRejected ? (
                    <div className="mt-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Status:</span>
                        {getStatusBadge(request.status)}
                      </div>

                      {request.status === "pending" && (
                        <button
                          className="px-3 py-1.5 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150 w-full text-sm"
                          onClick={() => handleCancel(invite._id)}
                          disabled={isLoading === "cancelling"}
                        >
                          {isLoading === "cancelling"
                            ? "Processing..."
                            : cancelButtonLabel}
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      className="mt-4 px-3 py-1.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150 w-full text-sm"
                      onClick={() => handleSend(invite._id)}
                      disabled={isLoading === "sending"}
                    >
                      {isLoading === "sending"
                        ? "Processing..."
                        : sendButtonLabel}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {pageCount > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CollaborationInviteClient;
