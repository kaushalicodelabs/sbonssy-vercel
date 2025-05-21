import React from "react";

const SocialLogins = ({ formik, prev }) => {
  return (
    <div className="lg:mt-8 mt-6 formInputs">
      <div className="text-center mb-6 lg:mb-8 ">
        <h2 className="text-[24px] lg:text-[32px]">
          Last step - link your social accounts
        </h2>
        <p className="text-base leading-[150%] tracking-[0%]">
          Add the public URLs f your social media platforms to complete your
          profile
        </p>
      </div>

      <div>
        <label className="block mb-2 mt-6">Instagram</label>
        <input
          name="socialLogins.instagram" // Use dot notation for nested object
          value={formik.values?.socialLogins?.instagram} // Access nested value
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-2 mt-6">Facebook</label>
        <input
          name="socialLogins.facebook"
          value={formik.values?.socialLogins?.facebook}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-2 mt-6"> TikTok</label>
        <input
          name="socialLogins.tikTok"
          value={formik.values?.socialLogins?.tikTok}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-2 mt-6">You Tube</label>
        <input
          name="socialLogins.youTube"
          value={formik.values?.socialLogins?.youTube}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-2 mt-6">X</label>
        <input
          name="socialLogins.x"
          value={formik.values?.socialLogins?.twitter}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-2 mt-6">Website</label>
        <input
          name="socialLogins.website"
          value={formik.values?.socialLogins?.website}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex justify-between items-center mt-4 mb-3">
        <span>Step 4/4</span>

        <div>
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

export default SocialLogins;
