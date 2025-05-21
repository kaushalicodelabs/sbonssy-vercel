"use client";

import BasicsStep from "@/components/campaign/BasicsStep";
import CompensationStep from "@/components/campaign/CompensationStep";
import CreativeAssetsStep from "@/components/campaign/CreativeAssetsStep";
import CreatorProfileStep from "@/components/campaign/CreatorProfileStep";
import GoalsStep from "@/components/campaign/GoalsStep";
import LegalStep from "@/components/campaign/LegalStep";
import api from "@/lib/axios";
import IconsLibrary from "@/util/IconsLibrary";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import * as Yup from "yup";

export default function CampaignCreationForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState({
    logo: false,
    photos: false,
    videos: false,
    examplePost: false,
  });
  const [submitError, setSubmitError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  // Validation schemas for each step (removed Tracking step)
  const validationSchemas = [
    Yup.object({
      basics: Yup.object({
        campaignType: Yup.string()
          .oneOf(["public", "apply", "private"])
          .required("Required"),
        title: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
        startDate: Yup.date().when("isOngoing", {
          is: false,
          then: (schema) => schema.required("Required"),
          otherwise: (schema) => schema.nullable(),
        }),
        endDate: Yup.date().when("isOngoing", {
          is: false,
          then: (schema) =>
            schema
              .min(Yup.ref("startDate"), "End date must be after start date")
              .required("Required"),
          otherwise: (schema) => schema.nullable(),
        }),
        isOngoing: Yup.boolean(),
        targetRegions: Yup.array().of(Yup.string()),
      }),
    }),
    Yup.object({
      creatorProfile: Yup.object({
        followerRange: Yup.object({
          min: Yup.number().min(0, "Must be positive").required("Required"),
          max: Yup.number()
            .min(Yup.ref("min"), "Max must be greater than min")
            .required("Required"),
        }),
        platforms: Yup.array()
          .min(1, "Select at least one platform")
          .required("Required"),
        ambassadorTypes: Yup.array()
          .min(1, "Select at least one type")
          .required("Required"),
        contentRequirements: Yup.string().required("Required"),
        requiresApproval: Yup.boolean(),
      }),
    }),
    Yup.object({
      compensation: Yup.object({
        type: Yup.string()
          .oneOf(["pay-per-sale", "pay-per-lead", "pay-per-click", "flat-fee"])
          .required("Required"),
        commission: Yup.number().when("type", {
          is: (type) => type === "pay-per-sale",
          then: (schema) =>
            schema.min(0, "Must be positive").required("Required"),
          otherwise: (schema) => schema.nullable(),
        }),
        amount: Yup.number().when("type", {
          is: (type) =>
            ["pay-per-lead", "pay-per-click", "flat-fee"].includes(type),
          then: (schema) =>
            schema.min(0, "Must be positive").required("Required"),
          otherwise: (schema) => schema.nullable(),
        }),
        gifting: Yup.boolean(),
      }),
    }),
    Yup.object({
      assets: Yup.object({
        logos: Yup.array()
          .of(
            Yup.object({
              url: Yup.string().required("Logo URL is required"),
              publicId: Yup.string().required("Logo publicId is required"),
            })
          )
          .min(1, "Required")
          .required("Logos are required"),
        photos: Yup.array().of(
          Yup.object({ url: Yup.string(), publicId: Yup.string() })
        ),
        videos: Yup.array().of(
          Yup.object({ url: Yup.string(), publicId: Yup.string() })
        ),
        examplePosts: Yup.array().of(
          Yup.object({
            url: Yup.string(),
            publicId: Yup.string(),
            mediaType: Yup.string().oneOf(["image", "video"]),
          })
        ),
        styleGuide: Yup.object({
          fonts: Yup.string(),
          colors: Yup.string(),
          guidelines: Yup.string(),
        }),
      }),
    }),
    Yup.object({
      goals: Yup.object({
        clicks: Yup.number().min(0, "Must be positive").nullable(),
        sales: Yup.number().min(0, "Must be positive").nullable(),
        signups: Yup.number().min(0, "Must be positive").nullable(),
        budgetCap: Yup.number().min(0, "Must be positive").nullable(),
        products: Yup.array().when("compensation.gifting", {
          is: true,
          then: (schema) =>
            schema
              .of(
                Yup.object({
                  name: Yup.string().required("Product name is required"),
                  description: Yup.string(),
                })
              )
              .min(1, "Select at least one product")
              .required("Required"),
          otherwise: (schema) => schema.nullable(),
        }),
        shippingRegions: Yup.array().when("compensation.gifting", {
          is: true,
          then: (schema) =>
            schema.min(1, "Select at least one region").required("Required"),
          otherwise: (schema) => schema.nullable(),
        }),
        shippingRequirements: Yup.string(),
      }),
    }),
    Yup.object({
      legal: Yup.object({
        termsAgreed: Yup.boolean()
          .oneOf([true], "You must agree to terms")
          .required("Required"),
        ftcDisclosure: Yup.boolean(),
        customTerms: Yup.string().required("Required"),
      }),
    }),
  ];

  // Initial form values
  const initialValues = {
    basics: {
      campaignType: "public",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      isOngoing: false,
      targetRegions: [],
    },
    creatorProfile: {
      followerRange: { min: "", max: "" },
      platforms: [],
      ambassadorTypes: [],
      contentRequirements: "",
      requiresApproval: false,
    },
    compensation: {
      type: "",
      commission: "",
      amount: "",
      gifting: false,
    },
    assets: {
      logos: [],
      photos: [],
      videos: [],
      examplePosts: [],
      styleGuide: {
        fonts: "",
        colors: "",
        guidelines: "",
      },
    },
    goals: {
      clicks: "",
      sales: "",
      signups: "",
      budgetCap: "",
      products: [],
      shippingRegions: [],
      shippingRequirements: "",
    },
    legal: {
      termsAgreed: false,
      ftcDisclosure: true,
      customTerms: "",
    },
  };

  // Select options
  const platformOptions = [
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "twitter", label: "Twitter" },
    { value: "facebook", label: "Facebook" },
  ];

  const regionOptions = [
    { value: "north_america", label: "North America" },
    { value: "europe", label: "Europe" },
    { value: "asia", label: "Asia" },
    { value: "africa", label: "Africa" },
    { value: "south_america", label: "South America" },
    { value: "australia", label: "Australia" },
  ];

  const ambassadorTypeOptions = [
    { value: "athlete", label: "Athlete" },
    { value: "team", label: "Team" },
    { value: "influencer", label: "Influencer" },
    { value: "para-athlete", label: "Para-Athlete" },
    { value: "coach", label: "Coach" },
    { value: "ex-athlete", label: "Ex-Athlete" },
  ];

  // Validate current step
  const validateStep = async (currentStep) => {
    await formik.validateForm();

    const stepFields = {
      0: () => {
        const fields = [
          "basics.campaignType",
          "basics.title",
          "basics.description",
          "basics.isOngoing",
          "basics.targetRegions",
        ];
        if (!formik.values.basics.isOngoing) {
          fields.push("basics.startDate", "basics.endDate");
        }
        return fields;
      },
      1: () => [
        "creatorProfile.followerRange.min",
        "creatorProfile.followerRange.max",
        "creatorProfile.platforms",
        "creatorProfile.ambassadorTypes",
        "creatorProfile.contentRequirements",
        "creatorProfile.requiresApproval",
      ],
      2: () => {
        const fields = ["compensation.type", "compensation.gifting"];
        if (formik.values.compensation.type === "pay-per-sale") {
          fields.push("compensation.commission");
        }
        if (
          ["pay-per-lead", "pay-per-click", "flat-fee"].includes(
            formik.values.compensation.type
          )
        ) {
          fields.push("compensation.amount");
        }
        return fields;
      },
      3: () => [
        "assets.logos",
        "assets.photos",
        "assets.videos",
        "assets.examplePosts",
        "assets.styleGuide.fonts",
        "assets.styleGuide.colors",
        "assets.styleGuide.guidelines",
      ],
      4: () => {
        const fields = ["goals.shippingRequirements"];
        if (formik.values.compensation.gifting) {
          fields.push("goals.products", "goals.shippingRegions");
        }
        return fields;
      },
      5: () => [
        "legal.termsAgreed",
        "legal.ftcDisclosure",
        "legal.customTerms",
      ],
    };

    const fields = stepFields[currentStep] ? stepFields[currentStep]() : [];
    const errors = await formik.validateForm();
    const stepErrors = fields.filter((field) => {
      const getNestedError = (obj, path) => {
        return path.split(".").reduce((current, key) => {
          return current ? current[key] : undefined;
        }, obj);
      };
      return !!getNestedError(errors, field);
    });

    if (stepErrors.length > 0) {
      const touched = fields.reduce((acc, field) => {
        let current = acc;
        const parts = field.split(".");
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]] = current[parts[i]] || {};
        }
        current[parts[parts.length - 1]] = true;
        return acc;
      }, {});
      formik.setTouched(touched);
      return false;
    }

    return true;
  };

  // Proceed to next step
  const next = async () => {
    const isStepValid = await validateStep(step);
    if (isStepValid) {
      setStep(step + 1);
    }
  };

  const handleFileUpload = async (e, field) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading((prev) => ({ ...prev, [field]: true }));

      const isLogoUpload = field === "logos";
      const fileArray = isLogoUpload ? [files[0]] : Array.from(files);
      const existingAssets = formik.values.assets[field] || [];

      const uploadedAssets = await Promise.all(
        fileArray.map(async (file, index) => {
          const uploaded = await uploadToCloudinary(file);
          return {
            ...uploaded,
            isProfile:
              isLogoUpload || (existingAssets.length === 0 && index === 0),
          };
        })
      );

      const updatedAssets = isLogoUpload
        ? uploadedAssets
        : [...existingAssets, ...uploadedAssets];

      formik.setFieldValue(`assets.${field}`, updatedAssets);
    } catch (error) {
      setSubmitError("Failed to upload files. Please try again.");
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleRemovePhoto = async (field, index) => {
    try {
      const currentAssets = [...formik.values.assets[field]];
      currentAssets.splice(index, 1);
      formik.setFieldValue(`assets.${field}`, currentAssets);
    } catch (error) {
      setSubmitError("Failed to remove photo. Please try again.");
    }
  };

  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        formData
      );

      const mediaType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : null;

      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
        ...(mediaType && { mediaType }),
      };
    } catch (error) {
      throw error;
    }
  };

  // Formik setup
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchemas[step],
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError("");
      try {
        await api.post("/campaign", values);
        router.push("/brand/campaign");
      } catch (error) {
        setSubmitError(
          error.response?.data?.message || "Failed to create campaign"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const renderStep = () => {
    const stepProps = {
      values: formik.values,
      errors: formik.errors,
      touched: formik.touched,
      handleChange: formik.handleChange,
      handleBlur: formik.handleBlur,
      setFieldValue: formik.setFieldValue,
    };

    switch (step) {
      case 0:
        return <BasicsStep {...stepProps} regionOptions={regionOptions} />;
      case 1:
        return (
          <CreatorProfileStep
            {...stepProps}
            platformOptions={platformOptions}
            ambassadorTypeOptions={ambassadorTypeOptions}
          />
        );
      case 2:
        return <CompensationStep {...stepProps} />;
      case 3:
        return (
          <CreativeAssetsStep
            {...stepProps}
            handleFileUpload={handleFileUpload}
            handleRemovePhoto={handleRemovePhoto}
            uploading={uploading}
            setUploading={setUploading}
          />
        );
      case 4:
        return (
          <GoalsStep
            {...stepProps}
            regionOptions={regionOptions}
            show={formik.values.compensation.gifting}
          />
        );
      case 5:
        return <LegalStep {...stepProps} />;
      default:
        return null;
    }
  };

  const onboardSteps = [
    {
      step: 1,
      // icon: "stepDone",
    },

    {
      step: 2,
      // icon: "stepDone",
    },

    {
      step: 3,
      // icon: "stepDone",
    },

    {
      step: 4,
      // icon: "stepDone",
    },
    {
      step: 5,
      // icon: "stepDone",
    },
    {
      step: 6,
      // icon: "stepDone",
    },
    {
      step: 7,
      // icon: "stepDone",
    },
  ];

  return (
    <div className="lg:max-w-3xl mx-auto px-5 lg:px-0  pb-7 bg-white rounded-lg">
      {/* <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Create New Campaign
      </h1> */}

      {/* Progress bar */}
      <div className="w-full flex gap-0 items-center mt-[28px] mb-8 lg:mt-[48px]">
        {onboardSteps.map((i, index) => (
          <Fragment key={index}>
            <div
              className={`min-w-8 min-h-8 flex justify-center items-center rounded-full border ${
                i.step < step + 1
                  ? "bg-[#F2F2F2] border-[#F2F2F2] text-[#0c0d06]" // completed step styles
                  : i.step === step + 1
                  ? "bg-blue-600 border-blue-600 text-white" // current step styles
                  : "bg-[#F2F2F2] border-[#0C0D0626] text-textColor" // upcoming steps
              }`}
            >
              {i.step < step + 1 ? <IconsLibrary name={"stepDone"} /> : i.step}
            </div>
            {i.step !== onboardSteps.length && (
              <span className="block w-full h-[1px] bg-[#0C0D0626]" />
            )}
          </Fragment>
        ))}
      </div>

      {/* <div className="w-full flex gap-0 items-center mt-[28px] mb-8 lg:mt-[48px]">
        {onboardSteps.map((i, index) => {
          return (
            <>
              <div className="min-w-8 min-h-8 justify-center items-center flex rounded-full border border-[#0C0D0626] bg-[#F2F2F2] text-textColor " key={index}>
                {currentStep == i.step ? (
                  <IconsLibrary name={"stepDone"} />
                ) : (
                  i.step
                )}
              </div>
              <span className="block w-full h-[1px] bg-[#0C0D0626] last:hidden" />

            </>
          );
        })}
      </div> */}

      <div className="text-center mb-6 lg:mb-8">
        <h2 className="text-[24px] lg:text-[32px]">
          Let’s start with some basic info
        </h2>
        <p className="text-base leading-[150%] tracking-[0%]">
          Just a few details to personalize your experience.
        </p>
      </div>

      {/* <div className="mb-8">
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>
            Step {step + 1} of {validationSchemas.length}
          </span>
          <span>
            {Math.round(((step + 1) / validationSchemas.length) * 100)}%
            Complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{
              width: `${((step + 1) / validationSchemas.length) * 100}%`,
            }}
          />
        </div>
      </div> */}

      {/* Error message */}
      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {submitError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="">
        {renderStep()}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              disabled={formik.isSubmitting}
            >
              Back
            </button>
          ) : (
            <Link
              href="/campaigns"
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </Link>
          )}

          {step < validationSchemas.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="px-6 py-2 bg-[#f26915] text-white rounded-lg"
              disabled={formik.isSubmitting}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting
                ? "Creating..."
                : "Create Marketing Campaign"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
