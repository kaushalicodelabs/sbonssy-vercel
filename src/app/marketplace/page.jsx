import React from "react";
import AllCampaigns from "@/components/AllCampaigns";
import CampaignFilters from "@/components/CampaignFilters";
import Link from "next/link";
import AllSports from "@/components/AllSports";
import SportsFilters from "@/components/SportsFilter";

const AllCampaignsList = async ({ searchParams }) => {
  // const [showMenus, setShowMenus] = useState();

  const params = await searchParams;
  const activeTab = params.tab || "campaigns";
  const showFilters = params.showFilters === "true";
  const page = parseInt(params.page || "1", 10);
  const limit = 10;

  // Common query parameters
  const commonQueryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(params.type && { type: params.type }),
    ...(params.isOngoing && { isOngoing: params.isOngoing }),
    ...(params.minFollowers && { minFollowers: params.minFollowers }),
    ...(params.maxFollowers && { maxFollowers: params.maxFollowers }),
    ...(params.platforms && { platforms: params.platforms }),
    ...(params.brandName && { brandName: params.brandName }),
    ...(params.contentType && { contentType: params.contentType }),
    ...(params.sort && { sort: params.sort }),
  });
  const commonQueryParamsSports = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sort: params.sort || "name-asc",
    ...(params.sport && { sport: params.sport }),
    ...(params.level && { level: params.level }),
    ...(params.gender && { gender: params.gender }),
    ...(params.location && { location: params.location }),
    ...(params.interests && { interests: params.interests }),
    ...(params.subRole && { subRole: params.subRole }),
  });

  // Fetch campaigns data only if on campaigns tab
  let campaignsData = { data: [], total: 0 };
  if (activeTab === "campaigns") {
    const campaignsResponse = await fetch(
      `http://localhost:3000/api/all-campaigns?${commonQueryParams.toString()}`,
      { cache: "no-store" }
    );
    campaignsData = await campaignsResponse.json();
  }

  // Fetch sports ambassadors data only if on sports tab
  let sportsData = { data: [], total: 0 };
  if (activeTab === "sports") {
    const sportsResponse = await fetch(
      `http://localhost:3000/api/all-sports?${commonQueryParamsSports.toString()}`,
      { cache: "no-store" }
    );
    sportsData = await sportsResponse.json();
  }

  // const handleFilter = () => {
  //   setShowMenus(!showMenus);
  // };
  // Create query strings for filter toggle links
  const filterQueryParams = new URLSearchParams(params);
  filterQueryParams.set("showFilters", "true");
  const openFilterQuery = `?${filterQueryParams.toString()}`;
  filterQueryParams.delete("showFilters");
  const closeFilterQuery = `?${filterQueryParams.toString()}`;

  return (
    <div className="flex flex-col">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200">
        <Link
          href={`?tab=campaigns&${commonQueryParams.toString()}`}
          className={`py-4 px-6 font-medium text-sm focus:outline-none ${
            activeTab === "campaigns"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All Campaigns
        </Link>
        <Link
          href={`?tab=sports&${commonQueryParamsSports.toString()}`}
          className={`py-4 px-6 font-medium text-sm focus:outline-none ${
            activeTab === "sports"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All Sports
        </Link>
      </div>

      <div className="lg:hidden p-4 ml-auto">
        <Link
          href={openFilterQuery}
          className="inline-flex items-center px-4 py-2 bg-white text-[#0C0D06] border border-[#0C0D0626] rounded-md text-sm font-medium hover:bg-blue-700"
          aria-label="Open filters"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1m-17 4h18m-16 4h14m-12 4h10"
            />
          </svg>
          Filters
        </Link>
      </div>

      {/* Tab Content */}

      {/* <div className="flex"> */}
      <div className={`flex relative ${showFilters ? "overflow-hidden" : ""}`}>
        <div className="hidden lg:block">
          {activeTab === "campaigns" ? (
            <CampaignFilters />
          ) : (
            <SportsFilters currentFilters={params} />
          )}
        </div>
        {/* Overlay for <1024px when showFilters=true */}
        {showFilters && (
          <div className="lg:hidden fixed top-0 left-0 h-full w-3/4 max-w-[300px] bg-white shadow-lg z-50 transform transition-transform duration-300">
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Link
                  href={closeFilterQuery}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close filters"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Link>
              </div>
              {activeTab === "campaigns" ? (
                <CampaignFilters />
              ) : (
                <SportsFilters currentFilters={params} />
              )}
            </div>
          </div>
        )}

        <div className="flex-1 p-6">
          {activeTab === "campaigns" ? (
            <AllCampaigns
              campaigns={campaignsData.data}
              total={campaignsData.total}
              currentPage={page}
              limit={limit}
              currentType={params.type || "all"}
              currentSort={params.sort || "startDate-desc"}
            />
          ) : (
            <AllSports
              ambassadors={sportsData.data}
              total={sportsData.total}
              currentPage={page}
              limit={limit}
              currentSort={params.sort || "name-asc"}
              currentFilters={params}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCampaignsList;
