"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import Pagination from "./Pagination/pagination";

const extractData = (ambassador, fields) => {
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

const SportsAmbassadorsClient = ({
  ambassadors = [],
  total,
  currentPage,
  limit,
  initialRequests = {},

  onAdd = async (ambassadorId) => {
    try {
      const response = await api.post("/brand/sports-ambassador", {
        ambassadorId,
      });
      return response.data; // Return full response data
    } catch (error) {
      console?.error("error", error);
      return null;
    }
  },
  onCancel = async (requestId) => {
    try {
      // Changed to DELETE since we're removing the request entirely
      await api.delete(`/brand/sports-ambassador`, {
        data: { requestId },
      });
      return true;
    } catch (error) {
      console?.log("error", error);
      return false;
    }
  },

  roles = [
    "athlete",
    "team",
    "coach",
    "paraAthlete",
    "exAthlete",
    "influencer",
  ],
  addButtonLabel = "Add",
  cancelButtonLabel = "Cancel",
}) => {
  // console.log(collaborations, "collab>");
  const router = useRouter();
  const [requests, setRequests] = useState(initialRequests);
  const [loadingStates, setLoadingStates] = useState({});
  const pageCount = Math.ceil(total / limit);

  const handlePageChange = (selectedPage) => {
    router.push(`/brand/all-collaboration?page=${selectedPage}`);
  };

  const handleAdd = async (ambassadorId) => {
    // Check if there was a previous rejected request
    const previousRequest = requests[ambassadorId];
    const wasRejected = previousRequest?.status === "rejected";

    setLoadingStates((prev) => ({ ...prev, [ambassadorId]: "adding" }));
    const response = await onAdd(ambassadorId);

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
    const success = await onCancel(request.id);
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
        Sports Ambassadors
      </h1>

      <ul className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {ambassadors.map((ambassador) => {
          const { name, sport, level, image } = extractData(ambassador, {
            roles,
          });

          const request = requests[ambassador._id];
          const isLoading = loadingStates[ambassador._id];
          const isRejected = request?.status === "rejected";

          return (
            <li
              key={ambassador._id}
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
                  <p className="text-xs text-gray-600 mt-1">Sport: {sport}</p>
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
                      onClick={() => handleCancel(ambassador._id)}
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
                  onClick={() => handleAdd(ambassador._id)}
                  disabled={isLoading === "adding"}
                >
                  {isLoading === "adding" ? "Processing..." : addButtonLabel}
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
    </div>
  );
};

export default SportsAmbassadorsClient;
