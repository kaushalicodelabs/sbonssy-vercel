"use client";

import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });

const BasicsStep = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  regionOptions,
}) => {
  // const campaignType = ["public", "apply", "private"];
  const campaignType = [
    { key: "Public", value: "public" },
    { key: "Apply", value: "apply" },
    { key: "Private", value: "private" },
  ];

  return (
    <div className="">
      {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Campaign Basics
      </h2> */}

      {/* <div>
        <label className="block mb-2 text-gray-700">Campaign Type</label>
        <div className="grid grid-cols-3 gap-4">
          {["public", "apply", "private"].map((type) => (
            <label
              key={type}
              className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50"
            >
              <input
                type="radio"
                name="basics.campaignType"
                value={type}
                checked={values.basics.campaignType === type}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-4 w-4 text-blue-600 mt-1"
              />
              <div>
                <span className="capitalize text-gray-800 font-medium">
                  {type}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {campaignTypeDescriptions[type]}
                </p>
              </div>
            </label>
          ))}
        </div>
        {touched.basics?.campaignType && errors.basics?.campaignType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.basics.campaignType}
          </p>
        )}
      </div> */}
      <div>
        <label htmlFor="campaignType" className="block mb-2 mt-6">
          Campaign Type
        </label>
        <select
          id="campaignType"
          name="basics.campaignType"
          value={values.basics.campaignType}
          onChange={handleChange}
          onBlur={handleBlur}
          className="dropdownIcon w-full h-[48px] py-2 px-3 bg-[#F3F3F2] rounded-[12px] border-0 focus:outline-none focus:ring-0 hover:border-0"
        >
          {campaignType.map((type) => (
            <option key={type.key} value={type.value} className="capitalize">
              {type.key}
            </option>
          ))}
        </select>
        {touched.basics?.campaignType && errors.basics?.campaignType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.basics.campaignType}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 mt-6">Campaign Title</label>
        <input
          type="text"
          name="basics.title"
          value={values.basics.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Summer Collection Promotion"
          className="forms w-full border p-2 rounded"
        />
        {touched.basics?.title && errors.basics?.title && (
          <p className="text-red-500 text-sm mt-1">{errors.basics.title}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 mt-6">Campaign Description</label>
        <textarea
          name="basics.description"
          value={values.basics.description}
          onChange={handleChange}
          onBlur={handleBlur}
          className="forms w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 !h-auto "
          rows={4}
          placeholder="Describe the campaign goals, product details, and expectations for creators..."
        />
        {touched.basics?.description && errors.basics?.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.basics.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 mt-6 ">Start Date</label>
          <input
            type="date"
            name="basics.startDate"
            value={values.basics.startDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-3 rounded-lg bg-[rgba(12,13,6,0.05)] border border-transparent focus:outline-none focus:border-transparent hover:border-transparent"
            disabled={values.basics.isOngoing}
          />
          {touched.basics?.startDate && errors.basics?.startDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.basics.startDate}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-2 mt-5">End Date</label>
          <input
            type="date"
            name="basics.endDate"
            value={values.basics.endDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-3 rounded-lg bg-[rgba(12,13,6,0.05)] border border-transparent focus:outline-none focus:border-transparent hover:border-transparent"
            disabled={values.basics.isOngoing}
            min={values.basics.startDate}
          />
          {touched.basics?.endDate && errors.basics?.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.basics.endDate}</p>
          )}
        </div>
      </div>

      <div className="flex items-center mt-6 mb-2">
        <input
          type="checkbox"
          name="basics.isOngoing"
          checked={values.basics.isOngoing}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-4 w-4 text-blue-600 rounded"
        />
        <label className="ml-2 text-gray-500">
          Ongoing Campaign (no end date)
        </label>
      </div>

      <div>
        <label className="block mb-2 mt-6">Target Regions (Optional)</label>
        <Select
          isMulti
          options={regionOptions}
          onChange={(selected) =>
            setFieldValue(
              "basics.targetRegions",
              selected ? selected.map((option) => option.value) : []
            )
          }
          onBlur={() => handleBlur("basics.targetRegions")}
          placeholder="Select regions..."
          classNamePrefix="select"
          styles={{
            control: (provided, state) => ({
              ...provided,
              backgroundColor: "rgba(12,13,6,0.05)",
              minHeight: "48px",
              ":hover": {
                backgroundColor: "rgba(12,13,6,0.05)",
                borderColor: "transparent",
              },
              ...(state.isFocused && {
                borderColor: "transparent",
                boxShadow: "none",
                outline: "none",
              }),
            }),
            multiValue: (provided) => ({
              ...provided,
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }),
          }}
        />
        {touched.basics?.targetRegions && errors.basics?.targetRegions && (
          <p className="text-red-500 text-sm mt-1">
            {errors.basics.targetRegions}
          </p>
        )}
      </div>
    </div>
  );
};

export default BasicsStep;
