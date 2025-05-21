"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  checkOptions,
  companyInterest,
  uploadToCloudinary,
} from "@/lib/helper";
const Select = dynamic(() => import("react-select"), { ssr: false });

const companyInterestOptions = companyInterest.map((interest) => ({
  label: interest,
  value: interest,
}));

const BrandDetails = ({ formik, handleCompanyLogo, next, prev }) => {
  return (
    <div className="lg:mt-8 mt-6">
      <div className="text-center mb-6 lg:mb-8">
        <h2 className="text-[24px] lg:text-[32px]">
          Let’s start with some basic info
        </h2>
        <p className="text-base leading-[150%] tracking-[0%]">
          Just a few details to personalize your experience.
        </p>
      </div>

      <div className="customSelectDesign">
        <label className="block mb-2">Your company values and interests</label>

        <Select
          isMulti
          name="companyInterest"
          options={companyInterestOptions}
          placeholder="Select max five"
          value={companyInterestOptions.filter(
            (
              opt // need to do
            ) => formik.values.companyInterest?.includes(opt.value)
          )}
          closeMenuOnSelect={false}
          onChange={(selected) => {
            const values = selected.map((item) => item.value);

            formik.setFieldValue("companyInterest", values);
          }}
        />
        {formik.touched.companyInterest && formik.errors.companyInterest && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.companyInterest}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block mt-6">Upload your company logo</label>
        <input
          type="file"
          accept="image/*"
          className=""
          onChange={handleCompanyLogo} // need to do
        />

        {formik.values.companyLogo && (
          <img
            src={formik.values.companyLogo}
            alt="cover"
            width="100"
            height="100"
            className="mt-[14px] rounded-2xl object-cover h-[224px] w-fit"
          />
        )}
        {formik.touched.companyLogo && formik.errors.companyLogo && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.companyLogo}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 mt-6 font-medium text-black">
          How many people are you working with?
        </label>

        <div className="flex flex-wrap gap-2 mt-2">
          {checkOptions.map((option) => (
            <label
              key={option}
              className={`
          px-4 py-2 cursor-pointer rounded-sm text-sm font-medium
          ${
            formik.values.workingPeople === option
              ? "bg-black text-white shadow-[0px_4px_4px_rgba(0,0,0,0.25),_0px_4px_4px_rgba(0,0,0,0.25)]"
              : "bg-gray-100 text-black"
          }
        `}
            >
              <input
                type="radio"
                name="workingPeople"
                value={option}
                checked={formik.values.workingPeople === option}
                onChange={formik.handleChange}
                className="hidden"
              />
              {option}
            </label>
          ))}
        </div>

        {formik.touched.workingPeople && formik.errors.workingPeople && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.workingPeople}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-[56px] mb-8 lg:mt-[48px]">
        <div>Step 2/3</div>
        <div>
          <button onClick={prev} className="btn secondaryBtn mr-4">
            Back
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              next();
            }}
            className="primaryBtn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandDetails;
