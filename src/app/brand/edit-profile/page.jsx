"use client";
import BrandDetails from "@/components/BrandDetails";
import BrandForm from "@/components/BrandForm";
import BrandInfo from "@/components/BrandInfo";
import BrandLast from "@/components/BrandLast";
import api from "@/lib/axios";
import { checkOptions, uploadToCloudinary } from "@/lib/helper";
import { useAuthStore } from "@/store/authStore";
import { useFormik } from "formik";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

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

const EditProfile = () => {
  const [currentStepBrand, setCurrentStepBrand] = useState(0);
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const formikBrand = useFormik({
    initialValues: {
      jobTitle: "",
      companyName: "",
      vatNumber: "",
      references: "",
      companyInterest: [],
      companyIntro: "",
      websiteUrl: "",
      workingPeople: checkOptions?.at(0) || "",
      companyLogo: "",
    },
    validationSchema: validationSchemaBrand,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const body = {
          role: user?.onboardedDetails?.role,
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

        alert("Profile updated successfully");
      } catch (error) {
      } finally {
        setSubmitting(false);
      }
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

    const hasErrors = fields.some((field) => errors[field]);

    if (hasErrors) {
      return false;
    }

    return true;
  };

  const nextBrand = async () => {
    const isStepValid = await validateStepBrand(currentStepBrand);
    if (!isStepValid) {
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

  useEffect(() => {
    if (user?.id) {
      (async () => {
        try {
          const response = await api.get(`/user?supabaseId=${user?.id}`);
          const profile = response.data;
          const brand = profile?.brand;
          formikBrand.setValues({
            jobTitle: brand?.currentJobTitle || "",
            companyName: brand?.companyName || "",
            vatNumber: brand?.vatNumber || "",
            references: brand?.howDidYouHear || "",
            companyInterest: brand?.valuesAndInterests || [],
            companyIntro: brand?.intro || "",
            websiteUrl: brand?.websiteUrl || "",
            workingPeople: brand?.workingPeople || checkOptions?.at(0) || "",
            companyLogo: brand?.companyLogo || "",
          });
        } catch (error) {}
      })();
    }
  }, [user?.id]);

  return (
    <div>
      <div className="lg:w-[560px] mx-auto px-5 lg:px-0 ">
        {/* <h1 className="text-2xl font-bold mb-4">Edit your profile</h1> */}
        <BrandForm
          formik={formikBrand}
          renderStep={renderStepBrand}
          currentStep={currentStepBrand}
        />
      </div>
    </div>
  );
};

export default EditProfile;
