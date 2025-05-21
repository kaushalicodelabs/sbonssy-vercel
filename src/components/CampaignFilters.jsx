// components/CampaignFilters.js
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const CampaignFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [brandInput, setBrandInput] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    isOngoing: null,
    minFollowers: "",
    maxFollowers: "",
    brandName: "",
    contentType: "",
    platforms: [],
  });
  useEffect(() => {
    setBrandInput(filters.brandName); // sync input when filters change from URL
  }, [filters.brandName]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.brandName !== brandInput) {
        const newFilters = { ...filters, brandName: brandInput };
        setFilters(newFilters);
        updateUrl(newFilters);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [brandInput]); // only re-run when input changes

  // Initialize filters from URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setFilters({
      type: params.get("type") || "all",
      isOngoing: params.get("isOngoing"),
      minFollowers: params.get("minFollowers") || "",
      maxFollowers: params.get("maxFollowers") || "",
      brandName: params.get("brandName") || "",
      contentType: params.get("contentType") || "",
      platforms: params.get("platforms")?.split(",") || [],
    });
  }, [searchParams]);

  const updateUrl = (newFilters) => {
    const params = new URLSearchParams();

    // Set pagination
    params.set("page", "1");

    // Set filters
    if (newFilters.type !== "all") params.set("type", newFilters.type);
    if (newFilters.isOngoing !== null)
      params.set("isOngoing", newFilters.isOngoing);
    if (newFilters.minFollowers)
      params.set("minFollowers", newFilters.minFollowers);
    if (newFilters.maxFollowers)
      params.set("maxFollowers", newFilters.maxFollowers);
    if (newFilters.brandName) params.set("brandName", newFilters.brandName);
    if (newFilters.contentType)
      params.set("contentType", newFilters.contentType);
    if (newFilters.platforms.length > 0)
      params.set("platforms", newFilters.platforms.join(","));

    router.push(`/marketplace?${params.toString()}`);
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  // const handleBrandChange = (e) => {
  //   const value = e.target.value;
  //   const newFilters = { ...filters, brandName: value };
  //   setFilters(newFilters);
  //   // Only update URL when user stops typing (debounce would be better here)
  //   const timer = setTimeout(() => {
  //     updateUrl(newFilters);
  //   }, 500);
  //   return () => clearTimeout(timer);
  // };

  const togglePlatform = (platform) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter((p) => p !== platform)
      : [...filters.platforms, platform];
    handleFilterChange("platforms", newPlatforms);
  };
  const handleBrandChange = (e) => {
    setBrandInput(e.target.value);
  };

  const clearContentType = () => {
    handleFilterChange("contentType", "");
  };

  return (
    <div className="w-72 p-6 bg-white h-full sticky top-0">
      {/* {heading section} */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-normal text-[24px] text-[#0C0D06]">Filter</h3>
        <button className="text-base font-normal leading-6">Clear all</button>
      </div>

      {/* Campaign Type */}
      <div className="mb-6">
        <h4 className="text-[18px] font-bold leading-6 text-[#000000] mb-5">
          Campaign Type
        </h4>
        <div className="space-y-2 border-b-1 border-[#DADAD9] pb-5">
          {["all", "public", "private", "apply"].map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange("type", type)}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-normal ${
                filters.type === type
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-[#0C0D06] hover:bg-gray-50"
              }`}
            >
              {type === "all"
                ? "All Campaigns"
                : `${type.charAt(0).toUpperCase() + type.slice(1)} Campaigns`}
            </button>
          ))}
        </div>
      </div>

      {/* Ongoing Status */}
      <div className="mb-6">
        <h4 className="text-[18px] font-bold leading-6 text-[#0C0D06] mb-5">
          Status
        </h4>
        <div className="space-y-2 border-b-1 border-[#DADAD9] pb-5">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={filters.isOngoing === "true"}
              onChange={(e) =>
                handleFilterChange(
                  "isOngoing",
                  e.target.checked ? "true" : null
                )
              }
              className=" size-4.5 ml-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-base font-normal leading-6">
              Ongoing Only
            </span>
          </label>
        </div>
      </div>

      {/* Follower Range */}
      <div className="mb-6">
        <h4 className="text-[18px] font-bold leading-6 text-[#0C0D06]  mb-5">
          Follower Range
        </h4>
        <div className="grid grid-cols-2 gap-3 border-b-1 border-[#DADAD9] pb-5">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Min</label>
            <input
              type="number"
              value={filters.minFollowers}
              onChange={(e) =>
                handleFilterChange("minFollowers", e.target.value)
              }
              placeholder="2000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Max</label>
            <input
              type="number"
              value={filters.maxFollowers}
              onChange={(e) =>
                handleFilterChange("maxFollowers", e.target.value)
              }
              placeholder="10000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Brand Name */}
      <div className="mb-6 border-b-1 border-[#DADAD9] pb-5">
        <h4 className="text-[18px] font-bold leading-6 text-[#0C0D06]  mb-5">
          Brand Name
        </h4>
        <input
          type="text"
          value={brandInput}
          onChange={handleBrandChange}
          placeholder="Search by brand name"
          className="searchBrand w-full px-3 py-2 border border-[#0C0D06] rounded-[12px] text-sm"
        />
      </div>

      {/* Content Type */}
      <div className="mb-6 border-b-1 border-[#DADAD9] pb-5">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-[18px] font-bold leading-6 text-[#0C0D06]">
            Content Type
          </h4>
          {filters.contentType && (
            <button
              onClick={clearContentType}
              className="text-base font-normal leading-6"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-2">
          {["lifestyle", "fitness", "fashion", "beauty", "tech", "gaming"].map(
            (type) => (
              <button
                key={type}
                onClick={() => handleFilterChange("contentType", type)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  filters.contentType === type
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-[#0C0D06] hover:bg-gray-50"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Platforms */}
      <div className="mb-6 border-b-1 border-[#DADAD9] pb-5">
        <h4 className="text-[18px] font-bold leading-6 text-[#0C0D06]  mb-5">
          Platforms
        </h4>
        <div className="space-y-2">
          {["instagram", "youtube", "tiktok", "twitter", "facebook"].map(
            (platform) => (
              <label key={platform} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={filters.platforms.includes(platform)}
                  onChange={() => togglePlatform(platform)}
                  className="size-4.5 ml-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-base font-normal leading-6 text-[#000000]">
                  {platform}
                </span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => {
          const resetFilters = {
            type: "all",
            isOngoing: null,
            minFollowers: "",
            maxFollowers: "",
            brandName: "",
            contentType: "",
            platforms: [],
          };
          setFilters(resetFilters);
          updateUrl(resetFilters);
        }}
        className="text-sm text-[#000000] font-medium"
      >
        Reset All Filters
      </button>
    </div>
  );
};

export default CampaignFilters;
