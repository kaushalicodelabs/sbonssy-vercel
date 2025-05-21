"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import { toCamelCase } from "@/lib/helper";

const AllCollaborationBrand = ({
  ambassadors = [],
  initialRequests = [],
  collaborations = [],
}) => {
  const router = useRouter();

  // Extract ambassador data
  const extractData = (ambassador, fields) => {
    for (const role of fields.roles) {
      const data = ambassador[role];
      if (data) {
        return {
          name: data.name || "Unnamed",
          sport: Array.isArray(data.sports)
            ? data.sports.join(", ")
            : data.sport || "N/A",
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

  // Status badge component
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

  const [requests, setRequests] = useState(initialRequests);
  const [loadingStates, setLoadingStates] = useState({});

  // Handle adding ambassador
  const handleAdd = async (ambassadorId) => {
    const previousRequest = requests[ambassadorId];
    const wasRejected = previousRequest?.status === "rejected";

    setLoadingStates((prev) => ({ ...prev, [ambassadorId]: "adding" }));

    try {
      const response = await api.post("/brand/sports-ambassador", {
        ambassadorId,
      });

      if (response.data) {
        setRequests((prev) => ({
          ...prev,
          [ambassadorId]: {
            id: response.data._id,
            status: response.data.status,
            createdAt: response.data.createdAt,
          },
        }));

        if (wasRejected) {
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error adding ambassador:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [ambassadorId]: null }));
    }
  };

  // Handle canceling request
  const handleCancel = async (ambassadorId) => {
    const request = requests[ambassadorId];
    if (!request) return;

    setLoadingStates((prev) => ({ ...prev, [ambassadorId]: "cancelling" }));

    try {
      await api.delete(`/brand/sports-ambassador`, {
        data: { requestId: request.id },
      });

      setRequests((prev) => {
        const newState = { ...prev };
        delete newState[ambassadorId];
        return newState;
      });
      router.refresh();
    } catch (error) {
      console.error("Error canceling request:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [ambassadorId]: null }));
    }
  };

  // Format sports data
  const formatSports = (sports) => {
    if (!sports) return "Sport not specified";
    if (Array.isArray(sports)) return sports.join(", ");
    return sports;
  };

  return (
    <div className="space-y-8">
      {/* Available Sports Ambassadors Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Available Sports Ambassadors
        </h2>
        <button
          onClick={() => {
            router.push("/brand/all-collaboration");
          }}
        >
          View All
        </button>

        <div className="px-4 py-6 max-w-7xl mx-auto">
          {ambassadors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No ambassadors available</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ambassadors.map((ambassador) => {
                const { name, sport, level, image } = extractData(ambassador, {
                  roles: [
                    "athlete",
                    "team",
                    "coach",
                    "paraAthlete",
                    "exAthlete",
                    "influencer",
                  ],
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
                            onClick={() => handleCancel(ambassador._id)}
                            disabled={isLoading === "cancelling"}
                          >
                            {isLoading === "cancelling"
                              ? "Processing..."
                              : "Cancel"}
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        className="mt-4 px-3 py-1.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150 w-full text-sm"
                        onClick={() => handleAdd(ambassador._id)}
                        disabled={isLoading === "adding"}
                      >
                        {isLoading === "adding" ? "Processing..." : "Add"}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Your Collaborations Section - Card Layout */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Collaborations</h2>
        <button
          onClick={() => {
            router.push("/brand/accepted-collaboration");
          }}
        >
          View All
        </button>

        {collaborations.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaborations.map((collaboration) => {
              const subRole = toCamelCase(collaboration?.subRole || "");
              console.log(subRole, "subRole");
              const ambassador = collaboration.subRole;
              console.log(ambassador, "ambassador");
              const name = collaboration[subRole]?.name || "Unknown Ambassador";
              const sport = formatSports(
                collaboration[subRole]?.sport || collaboration[subRole]?.sports
              );
              const image = collaboration[subRole]?.images[0].url;

              return (
                <div
                  key={collaboration._id}
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
                    <p className="text-gray-600 mb-2 text-center">{sport}</p>

                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors duration-300">
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCollaborationBrand;
