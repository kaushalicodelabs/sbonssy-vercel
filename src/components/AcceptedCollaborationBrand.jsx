"use client";

import { toCamelCase } from "@/lib/helper";
import Pagination from "./Pagination/pagination";
import { useRouter } from "next/navigation";

const AcceptedBrandCollaboration = ({
  acceptedRes,
  currentPage,
  limit,
  total,
}) => {
  const router = useRouter();
  const pageCount = Math.ceil(total / limit);

  const handlePageChange = (selectedPage) => {
    router.push(
      `/sports-ambassador/accepted-collaboration?page=${selectedPage}`
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Accepted Collaborations
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {acceptedRes.map((req, index) => {
          const name = req.brand?.companyName;
          const jobTitle = req.brand.currentJobTitle;
          const logo = req.brand.companyLogo;

          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="h-40 overflow-hidden">
                {" "}
                {/* Reduced from h-48 */}
                <img
                  src={logo || "/default-athlete.jpg"}
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
                  {jobTitle || "Job not specified"}
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
    </div>
  );
};

export default AcceptedBrandCollaboration;
