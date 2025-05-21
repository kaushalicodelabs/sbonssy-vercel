"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import moment from "moment";
import Pagination from "@/components/Pagination/pagination";

const CollaborationRequests = () => {
  const { user } = useAuthStore();
  const ambassadorId = user?.onboardedDetails?._id;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: null,
    totalPages: null,
  });

  const handlePageChange = (selectedPage) => {
    setPagination((p) => ({
      ...p,
      currentPage: selectedPage,
    }));
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/sports/collaboration?page=${pagination.currentPage}`
        );
        console.log(response, "response");
        setPagination((p) => ({
          ...p,
          currentPage: response.data?.pagination?.currentPage,
          totalItems: response.data?.pagination?.totalItems,
          totalPages: response.data?.pagination?.totalPages,
        }));

        // setTotal(response.total);
        setRequests(response.data?.data);
      } catch (err) {
        setError(err.message || "Failed to fetch collaboration requests");
      } finally {
        setLoading(false);
      }
    };

    if (ambassadorId) {
      fetchRequests();
    }
  }, [ambassadorId, pagination.currentPage]);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setLoading(true);
      const action = newStatus === "accepted" ? "accept" : "decline";
      const response = await api.put(`/brand/sports-ambassador`, {
        requestId,
        action,
      });

      if (response.data) {
        setRequests(
          requests.map((request) =>
            request._id === requestId
              ? { ...request, status: response.data.status }
              : request
          )
        );
        // Refresh accepted requests if a new one was accepted
        if (newStatus === "accepted") {
          const updatedAccepted = await api.get(
            `/sports/accepted-collaboration`
          );
          setAcceptedRequests(updatedAccepted.data);
        }
      }
    } catch (err) {
      console.error("Error updating request status:", err);
      setError(
        err.response?.data?.message || "Failed to update request status"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading requests...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto space-y-8">
      {/* Collaboration Requests Section */}
      <section>
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Collaboration Requests
        </h1>

        {requests?.length === 0 ? (
          <p className="text-gray-600">No collaboration requests found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {request.brandId?.companyName || "Unknown Brand"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          request.status === "accepted"
                            ? "text-green-600"
                            : request.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {request.status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Created: {moment(request?.createdAt).format("LLL")}
                    </p>
                  </div>
                  {request.status === "pending" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(request._id, "accepted")
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(request._id, "rejected")
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.currentPage}
            pageCount={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CollaborationRequests;
