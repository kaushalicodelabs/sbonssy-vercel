"use client";

import Pagination from "@/components/Pagination/pagination";
import api from "@/lib/axios";
import moment from "moment";
import React, { useEffect, useState } from "react";

const Campaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const limit = 10; // Number of users per page
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/campaign", {
          params: {
            page: currentPage,
            limit,
          },
        });
        setCampaigns(response.data.campaigns);
        setPageCount(response.data?.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Campaigns</h1>

      {loading ? (
        <p>Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                  Serial No.
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                  Campaign Title
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                  Campaign Type
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                  Brand Name
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, i) => {
                const startSerial = (currentPage - 1) * limit + 1;
                const serialNumber = startSerial + i;
                return (
                  <tr key={campaign._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm text-gray-600">
                      {serialNumber}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-600">
                      {campaign?.basics?.title || "N/A"}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-600">
                      {campaign?.basics?.campaignType || "N/A"}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-600">
                      {campaign?.brandId?.brand?.companyName}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-600">
                      {campaign.status}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-600">
                      {moment(campaign.createdAt).format("LLL")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Campaign;
