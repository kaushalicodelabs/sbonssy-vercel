"use client";

const BrandForm = ({ formik, renderStep, currentStep }) => {
  // console.log(formik.errors);
  // console.log(formik.values);
  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="formInputs">
        <div>{renderStep(currentStep)}</div>
      </form>
    </div>
  );
};

export default BrandForm;
