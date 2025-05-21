import React from "react";

const BrandInfo = ({ formik, next }) => {
  return (
    <div>
      <div className="lg:mt-8 mt-7">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-[24px] lg:text-[32px]">
            Let’s start with some basic info
          </h2>
          <p className="text-base leading-[150%] tracking-[0%]">
            Just a few details to personalize your experience.
          </p>
        </div>
        
        <label className="mb-2 block ">Current Job title</label>
        <input
          name="jobTitle"
          value={formik.values.jobTitle}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
        {formik.touched.jobTitle && formik.errors.jobTitle && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.jobTitle}</p>
        )}
      </div>
      <div>
        <label className="mb-2 block mt-6 lg:mt-[31px]">
          What is your company name?
        </label>
        <input
          name="companyName"
          value={formik.values.companyName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
        {formik.touched.companyName && formik.errors.companyName && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.companyName}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block mt-6 lg:mt-[31px]">VAT number</label>
        <input
          name="vatNumber"
          value={formik.values.vatNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
        {formik.touched.vatNumber && formik.errors.vatNumber && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.vatNumber}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block mt-6 lg:mt-[31px]">Website URL</label>
        <input
          name="websiteUrl"
          value={formik.values.websiteUrl}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
        {formik.touched.websiteUrl && formik.errors.websiteUrl && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.websiteUrl}
          </p>
        )}
      </div>
      <div>
        <label className="mb-2 block mt-6 lg:mt-[31px]">
          Write short introduction about your brand
        </label>

        <textarea
          name="companyIntro"
          value={formik.values?.companyIntro}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="min-h-[145px]"
        />
        {formik.touched.companyIntro && formik.errors.companyIntro && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.companyIntro}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between lg:mt-8 mt-6 lg:mb-8 mb-4 ">
        <div className="flex items-center">
          <span>step 1/3</span>
        </div>

        <button onClick={next} className="primaryBtn">
          Next
        </button>
      </div>
    </div>
  );
};

export default BrandInfo;
