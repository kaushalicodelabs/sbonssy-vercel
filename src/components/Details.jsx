import React from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { interestOptions } from "@/lib/helper";
const Select = dynamic(() => import("react-select"), { ssr: false });

// const interests = [
//   "Fitness",
//   "Music",
//   "Travel",
//   "Technology",
//   "Photography",
//   "Fashion",
//   "Gaming",
//   "Cooking",
//   "Art",
//   "Reading",
// ];

// const interestOptions = interests.map((interest) => ({
//   label: interest,
//   value: interest,
// }));

const Details = ({ formik, next, prev }) => {
  return (
    <div className="lg:mt-8 mt-6 formInputs">
      <div className="text-center mb-6 lg:mb-8 ">
        <h2 className="text-[24px] lg:text-[32px]">
          Great, now a bit more about you{" "}
        </h2>
        <p className="text-base leading-[150%] tracking-[0%]">
          Let your fans, brands and supporters know you better!
        </p>
      </div>
      <div>
        <label className="block mb-2 mt-6 ">
          Write a biography of yourself
        </label>
        <textarea
          name="biography"
          value={formik.values?.biography}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
        {formik.touched.biography && formik.errors.biography && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.biography}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 mt-6">Achievements</label>
        <textarea
          name="achievements"
          value={formik.values?.achievements}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
        {formik.touched.achievements && formik.errors.achievements && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.achievements}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 mt-6">Records</label>
        <textarea
          name="records"
          value={formik.values?.records}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
        {formik.touched.records && formik.errors.records && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.records}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 mt-6">Goals</label>
        <textarea
          name="goals"
          value={formik.values?.goals}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
        {formik.touched.goals && formik.errors.goals && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.goals}</p>
        )}
      </div>
      <div className="customSelectDesign">
        <label className="block mb-2 mt-6"> Interests </label>
        <Select
          isMulti
          name="interests"
          options={interestOptions}
          placeholder="Select your interests (min 5)"
          closeMenuOnSelect={false}
          value={interestOptions
            .flatMap((group) => group.options)
            .filter((opt) => formik.values.interests.includes(opt.value))}
          onChange={(selected) => {
            const values = selected.map((item) => item.value);
            formik.setFieldValue("interests", values);
          }}
        />
        {formik.touched.interests && formik.errors.interests && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.interests}</p>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="">Step 2/4</div>
        <div>
          <button onClick={prev} className="btn secondaryBtn mr-4">
            Back
          </button>

          <button onClick={next} className="primaryBtn">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
