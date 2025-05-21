"use client";

import { toCamelCase } from "@/lib/helper";
import Pagination from "./Pagination/pagination";
import { useRouter } from "next/navigation";

const AcceptedSportsCollaboration = ({
  acceptedRes,
  currentPage,
  limit,
  total,
  route,
}) => {
  const router = useRouter();
  const pageCount = Math.ceil(total / limit);

  const handlePageChange = (selectedPage) => {
    router.push(`${route}?page=${selectedPage}`);
  };

  // Helper function to format sports data
  const formatSports = (sports) => {
    if (!sports) return "Sport not specified";
    if (Array.isArray(sports)) return sports.join(", ");
    return sports;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Accepted Collaborations
      </h1>

      {acceptedRes.length === 0 ? (
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
            {acceptedRes.map((req, index) => {
              const subRole = toCamelCase(req?.subRole || "");
              const name = req[subRole]?.name;
              const sport = req[subRole]?.sport || req[subRole]?.sports;
              const image = req[subRole]?.images[0]?.url;

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={image || "/default-athlete.jpg"}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/default-athlete.jpg";
                      }}
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1 text-center">
                      {name || "Unknown Athlete"}
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

export default AcceptedSportsCollaboration;
