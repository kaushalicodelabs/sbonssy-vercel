"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { sports, interestOptions } from "@/lib/helper";

const Select = dynamic(
  () => import("react-select").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full p-2 border border-gray-300 rounded-md h-[38px] bg-gray-100" />
    ),
  }
);


const SportsFilters = ({ currentFilters }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  // const [isFilter, setIsFilter] = useState(currentFilters);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // console.log(isFilter, "isFilter")

  const updateFilter = (name, value) => {
    const params = new URLSearchParams(currentFilters);
    if (value) params.set(name, value);
    else params.delete(name);
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const updateMultiFilter = (name, values) => {
    const params = new URLSearchParams(currentFilters);
    if (values.length > 0) {
      params.set(name, values.join(","));
    } else {
      params.delete(name);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const resetAllFilters = () => {
    router.push("?tab=sports");
  };

  const handleCheckboxChange = (name, value) => {
    const current = currentFilters[name]?.split(",") || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateMultiFilter(name, updated);
  };

  const getCurrentInterests = () => {
    if (!currentFilters.interests) return [];
    return currentFilters.interests.split(",").map((value) => {
      let found = null;
      interestOptions.forEach((group) => {
        const opt = group.options.find((o) => o.value === value);
        if (opt) found = opt;
      });
      return found || { value, label: value };
    });
  };

  const subRoleOptions = [
    { value: "influencer", label: "Influencer" },
    { value: "coach", label: "Coach" },
    { value: "athlete", label: "Athlete" },
    { value: "paraAthlete", label: "Para Athlete" },
    { value: "exAthlete", label: "Ex Athlete" },
    { value: "team", label: "Team" },
  ];

  const levelOptions = ["Olympic", "Professional", "College", "Amateur"];
  const socialMediaOptions = [
    "instagram",
    "twitter",
    "youtube",
    "facebook",
    "tiktok",
    "linkedin",
  ];
  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: '40px',         // Set your custom height
      minHeight: '40px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '40px',
      display: 'flex',
      alignItems: 'center',   // Center the text vertically
      padding: '0 12px',      // Optional: padding for spacing
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '40px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

  return (

    <div className="lg:flex-grow max-lg:w-[288px] p-4 bg-white space-y-4">

      {/* {heading section} */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-normal leading-[22px]">Filters</h2>
        <button
          onClick={resetAllFilters}
          className="text-base font-normal leading-6"
        >
          Clear all
        </button>
      </div>

      {/* Role type */}
      <div className="border-b-1 border-[#DADAD9] pb-5">
        <div className="flex justify-between items-center mb-5">
          <label className="text-[18px] font-bold leading-6 text-[#000000]">Role Type</label>
          {currentFilters.subRole && (
            <button
              className="text-base font-normal text-[#000000] leading-6"
              onClick={() => updateFilter("subRole", "")}
            >
              Clear
            </button>
          )}
        </div>
        <select
          value={currentFilters.subRole || ""}
          onChange={(e) => updateFilter("subRole", e.target.value)}
          className="dropdownIcon w-full py-2 px-3 border border-black bg-[#F3F3F2] rounded-[12px] h-10 min-h-10"
        >
          <option value="">All Roles</option>
          {subRoleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sport */}
      <div className="border-b-1 border-[#DADAD9] pb-5">
        <div className="flex justify-between items-center mb-5">
          <label className="text-[18px] font-bold leading-6 text-[#000000]">Sport</label>
          {currentFilters.sport && (
            <button
              className="text-base font-normal text-[#000000] leading-6"
              onClick={() => updateFilter("sport", "")}
            >
              Clear
            </button>
          )}
        </div>
        <select
          value={currentFilters.sport || ""}
          onChange={(e) => updateFilter("sport", e.target.value)}
          className="dropdownIcon w-full  py-2 px-3  border border-black bg-[#F3F3F2] rounded-[12px] h-10 min-h-10"
        >
          <option value="">All Sports</option>
          {sports.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>

      {/* Level (Radio) */}
      <div className="border-b-1 border-[#DADAD9] pb-5">
        <div className="flex justify-between items-center mb-5">
          <label className="text-[18px] font-bold leading-6 text-[#000000]">Level</label>
          {currentFilters.level && (
            <button
              className="text-base font-normal text-[#000000] leading-6"
              onClick={() => updateFilter("level", "")}
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1">
          {levelOptions.map((level) => (
            <label key={level} className="flex items-center space-x-2  mb-2 ">
              <input
                type="radio"
                name="level"
                value={level}
                checked={currentFilters.level === level}
                onChange={(e) => updateFilter("level", e.target.value)}
                className="size-4.5 ml-3"
              />
              <span className="text-base leading-6 font-normal text-[#0C0D06]">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="border-b-1 border-[#DADAD9] pb-5">
        <div className="flex justify-between items-center  mb-5">
          <label className="text-[18px] font-bold leading-6 text-[#000000]">Gender</label>
          {currentFilters.gender && (
            <button
              className="text-base font-normal text-[#000000] leading-6"
              onClick={() => updateFilter("gender", "")}
            >
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={currentFilters.gender || ""}
            onChange={(e) => updateFilter("gender", e.target.value)}
            className="dropdownIcon w-full  py-2 px-3  border border-black bg-[#F3F3F2] rounded-[12px] h-10 min-h-10"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>

          </select>
        </div>
      </div>

      {/* Location */}
      <div className="border-b-1 border-[#DADAD9] pb-5">
        <div className="flex justify-between items-center  mb-5">
          <label className="text-[18px] font-bold leading-6 text-[#000000]">Location</label>
          {currentFilters.location && (
            <button
              className="text-base font-normal text-[#000000] leading-6"
              onClick={() => updateFilter("location", "")}
            >
              Clear
            </button>
          )}
        </div>
        <input
          type="text"
          placeholder="Search location"
          value={currentFilters.location || ""}
          onChange={(e) => updateFilter("location", e.target.value)}
          className="searchBrand w-full p-3 border border-text-[#0C0D06] rounded-[12px] !important"
        />
      </div>

      {/* Interests (multi-select) */}
      <div className="border-b-1 border-[#DADAD9] pb-5">
        <div className="flex justify-between items-center mb-5">
          <label className="text-[18px] font-bold leading-6 text-[#000000]">
            Interests
          </label>
          <button className="text-base font-normal text-[#000000] leading-6">Clear</button>
        </div>
        {isMounted && (
          <Select
            isMulti
            name="interests"
            options={interestOptions}
            placeholder="Select interests"
            closeMenuOnSelect={false}
            value={getCurrentInterests()}
            onChange={(selected) =>
              updateMultiFilter(
                "interests",
                selected.map((s) => s.value)
              )
            }
            className="basic-multi-select kkkkkkkkkkk"
            classNamePrefix="select"
            styles={customStyles}
          />
        )}
      </div>

      {/* Social Media (Checkbox) */}
      <div className="border-b-1 border-[#DADAD9] pb-5">
        <div className="flex justify-between items-center mb-5">
          <label className="text-[18px] font-bold leading-6 text-[#000000]">
            Social Media
          </label>
          <button className="text-base font-normal text-[#000000] leading-6">Clear</button>
        </div>

        <div className="space-y-1 ">
          {socialMediaOptions.map((platform) => (
            <label key={platform} className="flex items-center space-x-2 mb-2 text-base leading-6 font-normal">
              <input
                type="checkbox"
                checked={
                  currentFilters.socialMedia?.split(",").includes(platform) ||
                  false
                }
                onChange={() => handleCheckboxChange("socialMedia", platform)}
                className="size-4.5 ml-3 checkboxWrapper"
              />
              <span className="capitalize">{platform}</span>
            </label>
          ))}
        </div>
      </div>

      {/* {Season} */}
      <div className="border-b-1 border-[#DADAD9] pb-5">
        <div className="flex justify-between items-center mb-5">
          <label className="text-[18px] font-bold leading-6 text-[#000000]">Season</label>
          <button className="text-base font-normal text-[#000000] leading-6">Clear</button>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-base font-normal leading-6 bg-[#0C0D06] text-white py-2 px-4">Summer</button>
          <button className="text-base font-normal leading-6 bg-[#F3F3F2] py-2 px-4">Winter</button>
        </div>
      </div>



      {/* {Age} */}
      <div className="border-b-1 border-[#DADAD9] pb-5">
        <div className="flex justify-between items-center mb-5">
          <label className="text-[18px] font-bold leading-6 text-[#000000]">Age</label>
          <button className="text-base font-normal text-[#000000] leading-6">Clear</button>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-base font-normal leading-6 bg-[#0C0D06] text-white py-2 px-4">U16</button>
          <button className="text-base font-normal leading-6 bg-[#F3F3F2] py-2 px-4">U16</button>
          <button className="text-base font-normal leading-6 bg-[#F3F3F2] py-2 px-4">U16</button>
        </div>
      </div>


    </div>
  );
};

export default SportsFilters;
