"use client";

import { useFormik } from "formik";
import { use, useEffect, useState } from "react";
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

const EditProfile = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const subrole = user?.onboardedDetails?.subRole;

  const toCamelCase = (str) =>
    subrole && subrole?.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

  const result = toCamelCase();

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
      selectedRole: "sports-ambassador",
      onboardPhotos: [],
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const body = {
        role: "sports-ambassador",
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
          location: values.location.locationName,
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
          location: values.location.locationName,
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
          location: values.location.locationName,
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
          location: values.location.locationName,
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
          location: values.location.locationName,
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

      setUser({
        ...user,
        onboardedDetails: resp.data,
      });

      setSubmitting(false); // Reset submitting state
      alert("Profile updated successfully");

      router.push("/sports-ambassador/profile");
    },
  });

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

  useEffect(() => {
    if (user?.id) {
      (async () => {
        try {
          const response = await api.get(`/user?supabaseId=${user?.id}`);

          const profile = response.data;
          const sub_role = profile?.[result];

          formik.setValues({
            subRole: profile.subRole,
            name: sub_role.name,
            gender: sub_role.gender,
            interests: sub_role.interests,
            location: sub_role.location,

            biography: sub_role.biography,
            achievements: sub_role.achievements,
            records: sub_role.records,
            goals: sub_role.goals,
            sport: sub_role.sport,
            level: sub_role.level,
            teamName: sub_role.teamClubName,
            onboardPhotos: sub_role.images,
            socialLogins: {
              instagram: sub_role.socialMedia.instagram,
              facebook: sub_role.socialMedia.facebook,
              tikTok: sub_role.socialMedia.tiktok,
              youTube: sub_role.socialMedia.youtube,
              twitter: sub_role.socialMedia.twitter,
              website: sub_role.socialMedia.website,
            },
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      })();
    }
  }, [user?.id]);

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>{renderStep(currentStep)}</div>
      </form>
    </div>
  );
};

export default EditProfile;
