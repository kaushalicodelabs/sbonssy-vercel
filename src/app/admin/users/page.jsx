"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import Pagination from "@/components/Pagination/pagination";
import moment from "moment";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [roleFilter, setRoleFilter] = useState(null); // Role filter state
  const limit = 10; // Number of users per page

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get("admin/users", {
          params: {
            page: currentPage,
            limit,
            ...(roleFilter && { role: roleFilter }), // Include role if selected
          },
        });

        setUsers(resp.data?.users || []);
        setPageCount(resp.data?.pagination?.totalPages || 1);
      } catch (err) {
        setError("Failed to load users. Please try again later.");
      }
    })();
  }, [currentPage, roleFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRoleFilterChange = (e) => {
    const role = e.target.value || null;

    setRoleFilter(role);

    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Access</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <div className="mb-4">
        <label
          htmlFor="roleFilter"
          className="mr-2 text-sm font-medium text-gray-700"
        >
          Filter by Role:
        </label>
        <select
          id="roleFilter"
          value={roleFilter || ""}
          onChange={handleRoleFilterChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Roles</option>
          <option value="fan">Fan</option>
          <option value="sports-ambassador">Sports Ambassador</option>
          <option value="brand">Brand</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Sl. No.
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Auth Provider
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Role
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Sub Role
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Created At
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Updated At
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 ? (
              users.map((user, i) => {
                const startSerial = (currentPage - 1) * limit + 1;
                const serialNumber = startSerial + i;

                return (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-sm text-gray-900">
                      {serialNumber}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-900">
                      {user.authProvider}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-900">
                      {user.role}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-900">
                      {user.subRole || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-900">
                      {moment(user?.createdAt).format("LLL")}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-900">
                      {moment(user?.updatedAt).format("LLL")}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="py-2 px-4 text-center text-sm text-gray-500"
                >
                  {error ? "Error loading users" : "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AdminUser;
