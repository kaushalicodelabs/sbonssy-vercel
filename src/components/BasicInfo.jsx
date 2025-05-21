"use client";

import { sports } from "@/lib/helper";
import IconsLibrary from "@/util/IconsLibrary";
import dynamic from "next/dynamic";

// import MapboxLocationPicker from "./MapboxLocationPicker";
// import MapboxLocationPicker from "./MapboxPicker";

const Select = dynamic(() => import("react-select"), { ssr: false });

const MapboxLocationPicker = dynamic(
  () => import("@/components/MapboxLocationPicker"),
  { ssr: false }
);
const roles = [
  "team",
  "athlete",
  "influencer",
  "coach",
  "ex-athlete",
  "para-athlete",
];
const levels = ["Olympic", "Professional", "Semi-Pro", "Amateur", "Junior"];
const sportsOptions = sports.map((sport) => ({ label: sport, value: sport }));

const BasicInfo = ({ formik, handleRoleChange, next }) => {
  return (
    <div className="lg:mt-8 mt-6 formInputs">
      <div className="text-center mb-6 lg:mb-8">
        <h2 className="text-[24px] lg:text-[32px]">
          Let’s start with some basic info
        </h2>
        <p className="text-base leading-[150%] tracking-[0%]">
          Just a few details to personalize your experience.
        </p>
      </div>

      {/* Role */}
      <div>
        <label className="mb-2 block mt-6">What would describe you</label>
        <div className="relative w-full">
          <select
            name="subRole"
            value={formik.values.subRole}
            onChange={handleRoleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
          <IconsLibrary
            styling="absolute top-1/2 z-1 -translate-1/2 right-6"
            name={"dropdownSelect"}
          />
        </div>
        {formik.touched.subRole && formik.errors.subRole && (
          <div className="text-red-500 text-sm">{formik.errors.subRole}</div>
        )}
      </div>

      {formik.values.subRole && (
        <div>
          {/* Name */}
          <div>
            <label className="block mb-2 mt-6">Enter your name</label>
            <input
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="w-full border p-2 rounded"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
          </div>

          {/* Gender */}
          {formik.values.subRole !== "team" && (
            <div>
              <label className="block mb-2 mt-6">Gender</label>
              <div className="relative w-full">
                <select
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <IconsLibrary
                  styling="absolute top-1/2 z-1 -translate-1/2 right-6"
                  name={"dropdownSelect"}
                />
              </div>
              {formik.touched.gender && formik.errors.gender && (
                <div className="text-red-500 text-sm">
                  {formik.errors.gender}
                </div>
              )}
            </div>
          )}

          {/* Sports */}
          {formik.values.subRole !== "influencer" && (
            <div>
              <label className="block mb-2 mt-6">Sport(s)</label>
              <div className="customSelectDesign ">
                {formik.values.subRole === "team" ? (
                  <Select
                    isMulti
                    name="sport"
                    options={sportsOptions}
                    placeholder="Select at least one"
                    value={sportsOptions.filter(
                      (opt) =>
                        Array.isArray(formik.values.sport) &&
                        formik.values.sport.includes(opt.value)
                    )}
                    closeMenuOnSelect={false}
                    onChange={(selected) => {
                      const values = selected
                        ? selected.map((item) => item.value)
                        : [];
                      formik.setFieldValue("sport", values);
                    }}
                  />
                ) : (
                  <select
                    name="sport"
                    value={
                      typeof formik.values.sport === "string"
                        ? formik.values.sport
                        : ""
                    }
                    onChange={formik.handleChange}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select a sport</option>
                    {sports.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                )}
                <IconsLibrary
                  styling="absolute top-1/2 z-1 -translate-1/2 right-6"
                  name={"dropdownSelect"}
                />
              </div>
              {formik.touched.sport && formik.errors.sport && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.sport}
                </p>
              )}
            </div>
          )}

          {/* Level */}
          {formik.values.subRole !== "influencer" && (
            <div>
              <label className="block mb-2 mt-6">
                {formik.values.subRole === "athlete"
                  ? "Level you are competing?"
                  : "Level your team is competing"}
              </label>
              <div className="relative w-full">
                <select
                  name="level"
                  value={formik.values.level}
                  onChange={formik.handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select one...</option>
                  {levels.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <IconsLibrary
                  styling="absolute top-1/2 z-1 -translate-1/2 right-6"
                  name={"dropdownSelect"}
                />
              </div>
              {formik.touched.level && formik.errors.level && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.level}
                </p>
              )}
            </div>
          )}

          {/* Team Name */}
          {formik.values.subRole !== "influencer" && (
            <div>
              <label className="block mb-2 mt-6">Team / Club name</label>
              <input
                name="teamName"
                value={formik.values.teamName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border p-2 rounded"
              />
              {formik.touched.teamName && formik.errors.teamName && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.teamName}
                </p>
              )}
            </div>
          )}

          {/* Location */}
          <div>
            <label className="mb-2 mt-6 block">Location</label>
            {/* <input
          name="location"
          value={formik.values.location}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        /> */}
            <MapboxLocationPicker
              value={formik.values.location}
              onChange={(val) => {
                formik.setFieldValue("location", val);
                formik.setFieldTouched("location", true);
              }}
            />
            {formik.touched.location?.locationName &&
              formik.errors.location?.locationName && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.location.locationName}
                </p>
              )}
          </div>
          {/* <MapboxLocationPicker
        value={formik.values.location}
        onChange={(val) => formik.setFieldValue("location", val)}
      /> */}

          {/* Navigation */}
          <div className="flex justify-between items-center my-6">
            <div>Step 1/4</div>
            <button className="primaryBtn" onClick={next}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInfo;
