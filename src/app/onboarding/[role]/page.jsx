"use client";

import { useFormik } from "formik";
import React, { use, useEffect, useState } from "react";
import * as Yup from "yup";
import BasicInfo from "@/components/BasicInfo";
import Details from "@/components/Details";
import OnboardingImages from "@/components/OnboardingImages";
import SocialLogins from "@/components/SocialLogins";
import BrandForm from "@/components/BrandForm";
import { checkOptions, uploadToCloudinary } from "@/lib/helper";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import BrandInfo from "@/components/BrandInfo";
import BrandDetails from "@/components/BrandDetails";
import BrandLast from "@/components/BrandLast";
import IconsLibrary from "@/util/IconsLibrary";
import { useAuthStore } from "@/store/authStore";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  gender: Yup.string().when("subRole", {
    is: "team",
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("Gender is required"),
  }),
  sport: Yup.mixed().when("subRole", {
    is: "influencer",
    then: (schema) => schema.optional(),
    otherwise: (schema) =>
      schema.test("sport-validation", "Sport is required", function (value) {
        const { subRole } = this.parent;
        if (subRole === "team") {
          return Array.isArray(value) && value.length > 0;
        }
        return typeof value === "string" && value !== "";
      }),
  }),
  level: Yup.string().when("subRole", {
    is: "influencer",
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("Level is required"),
  }),
  teamName: Yup.string().when("subRole", {
    is: "influencer",
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("Team name is required"),
  }),
  // location: Yup.string().required("Location is required"),
  location: Yup.object()
    .shape({
      type: Yup.string().required().oneOf(["Point"]),
      coordinates: Yup.array().of(Yup.number().required()).length(2).required(),
      locationName: Yup.string().required("Location is required"),
    })
    .required("Location is required"),

  biography: Yup.string().required("Biography is required"),
  achievements: Yup.string().required("Achievements are required"),
  records: Yup.string().required("Records are required"),
  goals: Yup.string().required("Goals are required"),
  interests: Yup.array()
    .of(Yup.string())
    .min(5, "Select at least 5 interests")
    .required("Interests are required"),
  subRole: Yup.string().required("Sub role is required"),
  onboardPhotos: Yup.array()
    .min(1, "Upload at least 1 photo")
    .required("Photo is required"),
});
const validationSchemaBrand = Yup.object().shape({
  companyName: Yup.string().required("Company name is required"),
  jobTitle: Yup.string().required("Title is required"),
  vatNumber: Yup.string().required("Number is required"),
  references: Yup.string().required("Reference is required"),
  companyInterest: Yup.array()
    .min(5, "Select at least 5 interests")
    .required("Interests are required"),
  companyIntro: Yup.string().required("Company introduction is required"),
  websiteUrl: Yup.string().url().required("Website URL is required"),
  workingPeople: Yup.string().required("Working people is required"),
  companyLogo: Yup.string().required("Logo is required"),
});
export default function RoleFormPage({ params }) {
  const resolvedParams = use(params); // Unwrap the Promise
  const role = resolvedParams.role; // Access the property safely
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepBrand, setCurrentStepBrand] = useState(0);

  const formik = useFormik({
    initialValues: {
      subRole: "",
      name: "",
      gender: "",
      sport: "",
      level: "",
      teamName: "",
      // location: "",
      location: {
        type: "Point",
        coordinates: [0, 0],
        locationName: "",
      },
      biography: "",
      achievements: "",
      records: "",
      goals: "",
      interests: [],
      socialLogins: {
        instagram: "",
        facebook: "",
        tikTok: "",
        youTube: "",
        x: "",
        website: "",
      },
      selectedRole: role,
      onboardPhotos: [],
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const body = {
        role: decodeURIComponent(role),
        subRole: values.subRole,
        athlete: values.subRole === "athlete" && {
          name: values.name,
          gender: values.gender.toLowerCase(), // Normalize to lowercase
          sport: values.sport,
          level: values.level,
          teamClubName: values.teamName,
          interests: values.interests,

          location: values.location,
          images: values.onboardPhotos,
          biography: values.biography,
          achievements: values.achievements,
          records: values.records,
          goals: values.goals,
          socialMedia: {
            instagram: values.socialLogins.instagram,
            facebook: values.socialLogins.facebook,
            tiktok: values.socialLogins.tikTok,
            youtube: values.socialLogins.youTube,
            twitter: values.socialLogins.x,
            website: values.socialLogins.website,
          },
        },
        team: values.subRole === "team" && {
          name: values.name,
          sports: values.sport,
          level: values.level,
          teamClubName: values.teamName,
          interests: values.interests,
          location: values.location,
          images: values.onboardPhotos,
          biography: values.biography,
          achievements: values.achievements,
          records: values.records,
          goals: values.goals,
          socialMedia: {
            instagram: values.socialLogins.instagram,
            facebook: values.socialLogins.facebook,
            tiktok: values.socialLogins.tikTok,
            youtube: values.socialLogins.youTube,
            twitter: values.socialLogins.x,
            website: values.socialLogins.website,
          },
        },
        influencer: values.subRole === "influencer" && {
          name: values.name,
          gender: values.gender,
          interests: values.interests,
          location: values.location,
          images: values.onboardPhotos,
          biography: values.biography,
          achievements: values.achievements,
          records: values.records,
          goals: values.goals,
          socialMedia: {
            instagram: values.socialLogins.instagram,
            facebook: values.socialLogins.facebook,
            tiktok: values.socialLogins.tikTok,
            youtube: values.socialLogins.youTube,
            twitter: values.socialLogins.x,
            website: values.socialLogins.website,
          },
        },
        coach: values.subRole === "coach" && {
          name: values.name,
          gender: values.gender.toLowerCase(), // Normalize to lowercase
          sport: values.sport,
          level: values.level,
          teamClubName: values.teamName,
          interests: values.interests,
          location: values.location,
          images: values.onboardPhotos,
          biography: values.biography,
          achievements: values.achievements,
          records: values.records,
          goals: values.goals,
          socialMedia: {
            instagram: values.socialLogins.instagram,
            facebook: values.socialLogins.facebook,
            tiktok: values.socialLogins.tikTok,
            youtube: values.socialLogins.youTube,
            twitter: values.socialLogins.x,
            website: values.socialLogins.website,
          },
        },
        exAthlete: values.subRole === "ex-athlete" && {
          name: values.name,
          gender: values.gender.toLowerCase(), // Normalize to lowercase
          sport: values.sport,
          level: values.level,
          teamClubName: values.teamName,
          interests: values.interests,
          location: values.location,
          images: values.onboardPhotos,
          biography: values.biography,
          achievements: values.achievements,
          records: values.records,
          goals: values.goals,
          socialMedia: {
            instagram: values.socialLogins.instagram,
            facebook: values.socialLogins.facebook,
            tiktok: values.socialLogins.tikTok,
            youtube: values.socialLogins.youTube,
            twitter: values.socialLogins.x,
            website: values.socialLogins.website,
          },
        },
        paraAthlete: values.subRole === "para-athlete" && {
          name: values.name,
          gender: values.gender.toLowerCase(), // Normalize to lowercase
          sport: values.sport,
          level: values.level,
          teamClubName: values.teamName,
          interests: values.interests,
          location: values.location,
          images: values.onboardPhotos,
          biography: values.biography,
          achievements: values.achievements,
          records: values.records,
          goals: values.goals,
          socialMedia: {
            instagram: values.socialLogins.instagram,
            facebook: values.socialLogins.facebook,
            tiktok: values.socialLogins.tikTok,
            youtube: values.socialLogins.youTube,
            twitter: values.socialLogins.x,
            website: values.socialLogins.website,
          },
        },
      };

      const resp = await api.put("/user", body);
      // setUser()
      // console.log(resp);

      setUser({
        ...user,
        onboardedDetails: resp.data,
      });

      setSubmitting(false); // Reset submitting state

      router.push("/sports-ambassador");
    },
  });

  // Reset form when subRole changes to avoid stale validation errors
  useEffect(() => {
    formik.resetForm({
      values: {
        ...formik.initialValues,
        subRole: formik.values.subRole,
        name: formik.values.name,
        location: formik.values.location,
      },
      touched: {},
      errors: {},
    });
  }, [formik.values.subRole]);

  const renderStep = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInfo
            formik={formik}
            handleRoleChange={handleRoleChange}
            next={next}
          />
        );
      case 1:
        return <Details formik={formik} next={next} prev={prev} />;
      case 2:
        return (
          <OnboardingImages
            formik={formik}
            handleAthletePhotos={handleAthletePhotos}
            handleRemoveAthletePhoto={handleRemoveAthletePhoto}
            next={next}
            prev={prev}
          />
        );
      case 3:
        return <SocialLogins formik={formik} prev={prev} />;
      default:
        return null;
    }
  };

  const validateStep = async (step) => {
    await formik.validateForm(); // Triggers validation

    // Define which fields to check per step
    const stepFields = {
      0: () => {
        const fields = ["name", "subRole"];
        if (!formik.values.location?.locationName) {
          formik.setFieldTouched("location.locationName", true);
          return [...fields, "location"];
        }
        if (formik.values.subRole !== "team") fields.push("gender");
        if (formik.values.subRole !== "influencer")
          fields.push("sport", "level", "teamName");
        return fields;
      },
      1: () => ["biography", "achievements", "goals", "interests", "records"],
      2: () => ["onboardPhotos"],
    };

    const fields = stepFields[step] ? stepFields[step]() : [];
    const errors = await formik.validateForm(); // Fresh error check
    const stepErrors = fields.filter((field) => !!errors[field]);

    if (stepErrors?.length > 0) {
      const touched = fields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
      formik.setTouched(touched);
      return false;
    }

    return true;
  };

  const next = async () => {
    const isStepValid = await validateStep(currentStep);
    if (isStepValid) {
      setCurrentStep(currentStep + 1);
    } else {
      formik.setTouched({
        name: true,
        subRole: true,
        gender: true,
        sport: true,
        level: true,
        teamName: true,
        location: true,
      });
    }
  };

  const prev = () => setCurrentStep(currentStep - 1);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;

    // Reset step to 0 if changing role from step 1
    if (currentStep === 1) {
      setCurrentStep(0);
    }

    // Update subRole and reset form state
    formik.setFieldValue("subRole", newRole);
  };

  const handleAthletePhotos = (e) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const existingPhotos = formik.values.onboardPhotos || [];

      const uploadPromises = fileArray.map((file, index) =>
        uploadToCloudinary({
          file,
          folder: "onboarding_photos",
        }).then((uploaded) => {
          return {
            ...uploaded,
            isProfile: existingPhotos.length === 0 && index === 0,
          };
        })
      );

      Promise.all(uploadPromises).then((uploadedUrls) => {
        const updatedPhotos = [...existingPhotos, ...uploadedUrls];
        formik.setFieldValue("onboardPhotos", updatedPhotos);
      });
    }
  };

  const handleRemoveAthletePhoto = async (index) => {
    const photo = formik.values.onboardPhotos[index];
    // await cloudinary.uploader.destroy(photo.publicId);

    const updatedPhotos = [...formik.values.onboardPhotos];
    updatedPhotos.splice(index, 1);

    formik.setFieldValue("onboardPhotos", updatedPhotos);
  };
  //  Brand
  const formikBrand = useFormik({
    initialValues: {
      jobTitle: "",
      companyName: "",
      vatNumber: "",
      references: "",
      companyInterest: [],
      companyIntro: "",
      websiteUrl: "",
      workingPeople: checkOptions?.at(0),
      companyLogo: "",
    },
    validationSchema: validationSchemaBrand,
    onSubmit: async (values, { setSubmitting }) => {
      const body = {
        role: decodeURIComponent(role),
        brand: {
          currentJobTitle: values.jobTitle,
          companyName: values.companyName,
          vatNumber: values.vatNumber,
          websiteUrl: values.websiteUrl,
          intro: values.companyIntro,
          valuesAndInterests: values.companyInterest,
          companyLogo: values.companyLogo,
          workingPeople: values.workingPeople,
          howDidYouHear: values.references,
        },
      };

      const resp = await api.put("/user", body);
      setUser({
        ...user,
        onboardedDetails: resp.data,
      });

      setSubmitting(false); // Reset submitting state
      router.push("/brand");
    },
  });

  const renderStepBrand = (step) => {
    switch (step) {
      case 0:
        return <BrandInfo formik={formikBrand} next={nextBrand} />;
      case 1:
        return (
          <BrandDetails
            formik={formikBrand}
            handleCompanyLogo={handleCompanyLogo}
            next={nextBrand}
            prev={prevBrand}
          />
        );
      case 2:
        return <BrandLast formik={formikBrand} prev={prevBrand} />;
      default:
        return null;
    }
  };

  const validateStepBrand = async (step) => {
    const fieldsToValidate = {
      0: ["jobTitle", "companyName", "companyIntro", "vatNumber", "websiteUrl"],
      1: ["companyInterest", "workingPeople", "companyLogo"],
      2: ["references"],
    };

    const fields = fieldsToValidate[step] || [];
    const errors = await formikBrand.validateForm();

    // Check if any of the current step's fields have errors
    const hasErrors = fields.some((field) => errors[field]);

    if (hasErrors) {
      return false;
    }

    return true;
  };

  const nextBrand = async () => {
    const isStepValid = await validateStepBrand(currentStepBrand);
    if (!isStepValid) {
      // Force validation messages to show
      const fieldsToValidate = {
        0: [
          "jobTitle",
          "companyName",
          "companyIntro",
          "vatNumber",
          "websiteUrl",
        ],
        1: ["companyInterest", "workingPeople", "companyLogo"],
        2: ["references"],
      };

      const fields = fieldsToValidate[currentStepBrand] || [];
      const touchedFields = fields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
      formikBrand.setTouched(touchedFields);
      return;
    }
    setCurrentStepBrand((prev) => prev + 1);
  };

  const prevBrand = () => setCurrentStepBrand(currentStepBrand - 1);

  const handleCompanyLogo = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadToCloudinary({ file, folder: "brand_logo" }).then((uploadedUrl) => {
        if (uploadedUrl?.url) {
          formikBrand.setFieldValue("companyLogo", uploadedUrl.url);
        }
      });
    }
  };

  return (
    <div className="lg:w-[560px] mx-auto px-5 lg:px-0 ">
      <div className="w-full flex gap-0 items-center mt-[28px] mb-8 lg:mt-[48px]">
        {onboardSteps.map((i, index) => {
          return (
            <React.Fragment key={index}>
              <div className="min-w-8 min-h-8 justify-center items-center flex rounded-full border border-[#0C0D0626] bg-[#F2F2F2] text-textColor">
                {currentStep == i.step ? (
                  <IconsLibrary name={"stepDone"} />
                ) : (
                  i.step
                )}
              </div>
              <span className="block w-full h-[1px] bg-[#0C0D0626] last:hidden" />
            </React.Fragment>
          );
        })}
      </div>
      {role === "brand" ? (
        <BrandForm
          formik={formikBrand}
          renderStep={renderStepBrand}
          currentStep={currentStepBrand}
        />
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>{renderStep(currentStep)}</div>
        </form>
      )}
    </div>
  );
}

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
];
