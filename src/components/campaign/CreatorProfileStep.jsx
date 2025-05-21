"use client";

import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });

const CreatorProfileStep = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  platformOptions,
  ambassadorTypeOptions,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Sport Ambassador Profile
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-gray-700">Minimum Followers</label>
          <input
            type="number"
            name="creatorProfile.followerRange.min"
            value={values.creatorProfile.followerRange.min}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="1000"
            min="0"
          />
          {touched.creatorProfile?.followerRange?.min &&
            errors.creatorProfile?.followerRange?.min && (
              <p className="mt-1 text-sm text-red-600">
                {errors.creatorProfile.followerRange.min}
              </p>
            )}
        </div>
        <div>
          <label className="block mb-2 text-gray-700">Maximum Followers</label>
          <input
            type="number"
            name="creatorProfile.followerRange.max"
            value={values.creatorProfile.followerRange.max}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="100000"
            min={values.creatorProfile.followerRange.min || 0}
          />
          {touched.creatorProfile?.followerRange?.max &&
            errors.creatorProfile?.followerRange?.max && (
              <p className="mt-1 text-sm text-red-600">
                {errors.creatorProfile.followerRange.max}
              </p>
            )}
        </div>
      </div>

      <div>
        <label className="block mb-2 text-gray-700">Platforms</label>
        <Select
          isMulti
          options={platformOptions}
          onChange={(selected) =>
            setFieldValue(
              "creatorProfile.platforms",
              selected ? selected.map((option) => option.value) : []
            )
          }
          onBlur={() => handleBlur("creatorProfile.platforms")}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select platforms..."
        />
        {touched.creatorProfile?.platforms &&
          errors.creatorProfile?.platforms && (
            <p className="mt-1 text-sm text-red-600">
              {errors.creatorProfile.platforms}
            </p>
          )}
      </div>

      <div>
        <label className="block mb-2 text-gray-700">
          Sport Ambassador Type(s)
        </label>
        <Select
          isMulti
          options={ambassadorTypeOptions}
          onChange={(selected) =>
            setFieldValue(
              "creatorProfile.ambassadorTypes",
              selected ? selected.map((option) => option.value) : []
            )
          }
          onBlur={() => handleBlur("creatorProfile.ambassadorTypes")}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select ambassador types..."
        />
        {touched.creatorProfile?.ambassadorTypes &&
          errors.creatorProfile?.ambassadorTypes && (
            <p className="mt-1 text-sm text-red-600">
              {errors.creatorProfile.ambassadorTypes}
            </p>
          )}
      </div>

      <div>
        <label className="block mb-2 text-gray-700">Content Requirements</label>
        <textarea
          name="creatorProfile.contentRequirements"
          value={values.creatorProfile.contentRequirements}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="Required CTAs, hashtags, brand mentions, etc."
        />
        {touched.creatorProfile?.contentRequirements &&
          errors.creatorProfile?.contentRequirements && (
            <p className="mt-1 text-sm text-red-600">
              {errors.creatorProfile.contentRequirements}
            </p>
          )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="creatorProfile.requiresApproval"
          checked={values.creatorProfile.requiresApproval}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-4 w-4 text-blue-600 rounded"
        />
        <label className="ml-2 text-gray-700">
          Pre-approve content before it goes live
        </label>
      </div>
    </div>
  );
};

export default CreatorProfileStep;
