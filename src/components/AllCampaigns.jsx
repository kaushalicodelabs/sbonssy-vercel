// components/AllCampaigns.js
"use client";
import React, { useState } from "react";
import moment from "moment";
import Pagination from "@/components/Pagination/pagination";
import { useRouter } from "next/navigation";
import IconsLibrary from "@/util/IconsLibrary";

const getStatusColor = (status) => {
  const statusMap = {
    active: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    paused: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
    archived: "bg-purple-100 text-purple-800",
  };
  return statusMap[status] || "bg-gray-100 text-gray-800";
};

const AllCampaigns = ({
  campaigns = [],
  total,
  currentPage,
  limit,
  currentType,
  currentSort,
}) => {
  const router = useRouter();
  const [isSortOpen, setIsSortOpen] = useState(false);

  const pageCount = Math.ceil(total / limit);

  const handlePageChange = (selectedPage) => {
    router.push(
      `/marketplace?page=${selectedPage}&type=${currentType}&sort=${currentSort}`
    );
  };

  const handleSortChange = (sortValue) => {
    setIsSortOpen(false);
    router.push(`/marketplace?page=1&type=${currentType}&sort=${sortValue}`);
  };

  // Sort options with labels
  const sortOptions = [
    { value: "startDate-desc", label: "Start Date (Newest First)" },
    { value: "startDate-asc", label: "Start Date (Oldest First)" },
    { value: "endDate-desc", label: "End Date (Newest First)" },
    { value: "endDate-asc", label: "End Date (Oldest First)" },
  ];

  // Get current sort label
  const currentSortLabel =
    sortOptions.find((option) => option.value === currentSort)?.label ||
    "Start Date (Newest First)";

  return (
    <div className="container mx-auto lg:px-[50px] px-0 lg:py-12 py:0">
      <div className="text-center mb-6">
        <div>
          {/* <h1 className="text-xl md:text-3xl font-normal mb-[22px] leading-5">
            {currentType === "all"
              ? "All"
              : currentType.charAt(0).toUpperCase() + currentType.slice(1)}{" "}
            Campaigns
          </h1> */}
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-[#0C0D06] mb-11 md:mb-8 sm:mb-6">
              Sports Ambassadors<span className="font-normal"> | Deals</span>
            </h1>
            {/* <p className="mt-2 text-gray-600">
              Discover our network of talented sports ambassadors
            </p> */}
          </div>
        </div>
        {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse through all available influencer marketing campaigns
        </p> */}

        {/* Sort Dropdown */}
        <div className="relative flex items-center justify-between ">
          <button className="flex items-center gap-2 bg-[var(--bglightGray)] text-normal text-base text-[#000000] min-h-10 py-1 px-5">
            <span>Tag</span>
            <IconsLibrary name="crosIcon" />
          </button>

          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sort by: {currentSortLabel}
            <IconsLibrary name="dropdownSelect" />
          </button>

          {isSortOpen && (
            <div className="origin-top-right absolute right-0 top-12 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      currentSort === option.value
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {campaigns?.length === 0 ? (
        <div className="text-center py:0px sm:py-6 lg:py-16 bg-gray-50 rounded-xl">
          <p className="text-xl text-gray-500">
            No {currentType !== "all" ? currentType : ""} campaigns found
          </p>
          <p className="text-gray-400 mt-2">
            {currentType !== "all"
              ? "Try selecting a different campaign type"
              : "Check back later for new opportunities"}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-4 lg:gap-4 xl:gap-8">
          {campaigns?.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

const CampaignCard = ({ campaign }) => {
  const title = campaign?.basics?.title;
  const logo = campaign?.assets?.logos[0]?.url;
  const brandName = campaign?.brandId?.brand?.companyName || "Unknown Brand";
  // const description = campaign?.basics?.description;
  // const status = campaign?.status;
  // const startDate = campaign?.basics?.startDate;
  // const endDate = campaign?.basics?.endDate;

  return (
    <div className="">
      {/* <div className="absolute top-4 right-4 z-10">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
      </div> */}
      <div className="">
        <div className="">
          {logo && (
            <div className="relative">
              <img
                src={logo}
                alt={brandName}
                className="w-full h-[360px] rounded-2xl object-cover border border-gray-200"
              />
            </div>
          )}
          <div className="">
            {/* <p className="text-sm text-gray-500">Brand</p> */}
            <h3 className="text-[18px] text-center md:text-center font-normal leading-6 text-[#0C0D06] mt-4">
              {brandName}
            </h3>
          </div>
        </div>
        <h2 className="text-[14px] text-center md:text-center font-normal leading-6 text-[#0C0D06] mb-4 mt-0.5">
          {title}
        </h2>

        <button className="bg-[#F9FD99] text-[#0C0D06] rounded-full h-10 min-h-10 py-8px px-16 text-base font-bold leading-6 whitespace-nowrap  flex sm:flex items-center sm:items-center m-auto sm:m-auto">
          Select Ambassador
        </button>
        {/* <div className="mb-5">
          <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
          <p className="text-gray-600 line-clamp-3">
            {description || "No description provided"}
          </p>
        </div> */}
        {/* <div className="border-t border-gray-100 my-4"></div>
        {!campaign.basics.isOngoing && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Duration:</span>{" "}
              {moment(startDate).format("MMM D")} -{" "}
              {moment(endDate).format("MMM D, YYYY")}
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AllCampaigns;
