"use client";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import IconsLibrary from "@/util/IconsLibrary";
import SportsFilters from "./SportsFilter";
import { toCamelCase } from "@/lib/helper";

const getSportColor = (sport) => {
  const sportColors = {
    football: "bg-orange-100 text-orange-800",
    basketball: "bg-blue-100 text-blue-800",
    tennis: "bg-green-100 text-green-800",
    cricket: "bg-red-100 text-red-800",
    swimming: "bg-cyan-100 text-cyan-800",
    default: "bg-gray-100 text-gray-800",
  };
  return sportColors[sport?.toLowerCase()] || sportColors.default;
};

const AllSports = ({
  ambassadors = [],
  total = 0,
  currentPage = 1,
  limit = 10,
  currentSort = "name-asc",
  currentFilters,
}) => {
  const router = useRouter();

  // const { page, type, sort, filter } = router.query;
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const pageCount = Math.ceil(total / limit);

  const handlePageChange = (selectedPage) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", selectedPage.toString());
    router.push(`/marketplace?${params.toString()}`);
  };

  const handleSortChange = (sortValue) => {
    setIsSortOpen(false);
    const params = new URLSearchParams(window.location.search);
    params.set("sort", sortValue);
    params.set("page", "1");
    router.push(`/marketplace?${params.toString()}`);
  };

  const sortOptions = [
    { value: "", label: "Sort by" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
  ];

  // const currentSortLabel =
  //   sortOptions.find((option) => option.value === currentSort)?.label ||
  //   "Sort by";

  const currentSortLabel =
    sortOptions.find((option) => option.value === (currentSort ?? ""))?.label ||
    "Sort by";

  const handleFilters = () => {
    setIsOpen(!isOpen);
    router.push(`/marketplace?tab=sports&page=1&limit=10?&filter=${isOpen}`);
  };

  return (
    <div className="container mx-auto lg:px-[50px] px-0 lg:py-12 py:0">
      {/* Header Section */}
      <div className="mb-[72px]">
        <div className="text-center">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-[#0C0D06] mb-11 md:mb-8 sm:mb-6">
              Sports Ambassadors<span className="font-normal"> | Deals</span>
            </h1>
            {/* <p className="mt-2 text-gray-600">
              Discover our network of talented sports ambassadors
            </p> */}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 bg-[var(--bglightGray)] text-normal text-base text-[#000000] min-h-10 py-1 px-5">
              <span>Tag</span>
              <IconsLibrary name="crosIcon" />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="inline-flex items-center text-base font-normal text-[#000000] bg-white"
              >
                Sort by: {currentSortLabel}
                <IconsLibrary name="dropdownSelect" />
              </button>
              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          currentSort === option.value
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
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
        </div>
      </div>

      {/* Ambassadors Grid */}
      {ambassadors.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">
            No sports ambassadors found matching your criteria.
          </p>
          <p className="mt-2 text-gray-500">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ambassadors.map((ambassador) => (
            <SportsAmbassadorCard
              key={ambassador._id}
              ambassador={ambassador}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-12">
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

const SportsAmbassadorCard = ({ ambassador }) => {
  const subRole = toCamelCase(ambassador?.subRole || "");
  const name = ambassador?.[subRole]?.name || "Unknown Ambassador";
  const sport = ambassador?.[subRole]?.sport || "Unknown Sport";

  const avatar =
    ambassador?.[subRole]?.images?.[0]?.url || "/default-avatar.jpg";
  const socialMedia = ambassador?.[subRole]?.socialMedia || {};

  return (
    <div className="bg-white rounded-lg">
      <div className="">
        {/* Avatar and Basic Info */}
        <div className="">
          <img
            src={avatar}
            alt={name}
            className="w-full h-full rounded-2xl object-cover border border-gray-200"
          />
          <div className="flex-1 mt-4">
            <h3 className="text-lg bold text-[var(--textColor)] leading-6 truncate text-center">
              {name}
            </h3>
          </div>
        </div>

        {/* Sport and Level */}
        <div className="text-center">
          <span
            className={`inline-block text-[14px] font-normal leading-6 rounded-full${getSportColor(
              sport
            )}`}
          >
            {sport}
          </span>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(socialMedia).map(
            ([platform, handle]) =>
              handle && (
                <a
                  key={platform}
                  href={`https://${platform}.com/${handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              )
          )}
        </div>

        {/* View Profile Button */}
        <Link
          href={`/ambassador/${ambassador._id}`}
          className="block w-full text-center px-4 py-2 text-base font-normal leading-6 text-[#000000] bg-[var(--bglightGray)] rounded-full shadow-[inset_0_-2px_1px_rgba(0,0,0,0.15),_0_1px_2px_rgba(0,0,0,0.15)] min-h-10"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default AllSports;
