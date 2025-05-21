"use client";

const LegalStep = ({ values, errors, touched, handleChange, handleBlur }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Legal & Compliance
      </h2>

      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              name="legal.termsAgreed"
              checked={values.legal.termsAgreed}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-4 w-4 text-blue-600 rounded"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label className="font-medium text-gray-700">
              I agree to the{" "}
              <a
                href="/terms"
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                Affiliate Terms and Conditions
              </a>
            </label>
            {touched.legal?.termsAgreed && errors.legal?.termsAgreed && (
              <p className="mt-1 text-red-600">{errors.legal.termsAgreed}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              name="legal.ftcDisclosure"
              checked={values.legal.ftcDisclosure}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-4 w-4 text-blue-600 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label className="font-medium text-gray-700">
              Creators must include FTC-compliant disclosure in their content
            </label>
            <p className="mt-1 text-gray-500">
              We recommend keeping this enabled to ensure compliance with
              advertising regulations
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-gray-700">Campaign Terms</label>
        <textarea
          name="legal.customTerms"
          value={values.legal.customTerms}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          rows={6}
          placeholder="Include legal terms for your campaign"
        />
        {touched.legal?.customTerms && errors.legal?.customTerms && (
          <p className="mt-1 text-sm text-red-600">
            {errors.legal.customTerms}
          </p>
        )}
      </div>
    </div>
  );
};

export default LegalStep;
