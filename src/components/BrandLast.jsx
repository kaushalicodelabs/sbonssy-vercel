import IconsLibrary from "@/util/IconsLibrary";
import React from "react";
const references = ["Ad", "Friend", "Facebook", "Instagram", "Influencer"];
const BrandLast = ({ formik, prev }) => {
  return (
    <div className="lg:mt-8 mt-6 formInputs">
      <div className="text-center mb-6 lg:mb-8 ">
        <h2 className="text-[24px] lg:text-[32px]">
          Let’s start with some basic info
        </h2>
        <p className="text-base leading-[150%] tracking-[0%]">
          Just a few details to personalize your experience.
        </p>
      </div>

      <div className="customSelectDesign">
        <label className="mb-2 block">How did you hear about us?</label>
        <div className="relative w-full">
          <select
            name="references"
            value={formik.values.references}
            onChange={formik.handleChange}
            className="w-full py-0"
          >
            <option value="">Select One</option>
            {references.map((g) => (
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
        {formik.touched.references && formik.errors.references && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.references}
          </p>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <span>Step 3/3</span>

        <div className="flex gap-2 items-center">
          <button onClick={prev} className="btn secondaryBtn mr-4">
            Back
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="primaryBtn"
          >
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandLast;
