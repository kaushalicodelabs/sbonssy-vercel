import React from "react";
import { IoMdClose, IoMdImages } from "react-icons/io";

const OnboardingImages = ({
  formik,
  handleAthletePhotos,
  handleRemoveAthletePhoto,
  next,
  prev,
}) => {
  return (
    <div className="lg:mt-8 mt-6 formInputs">
      <div className="text-center mb-6 lg:mb-8 ">
        <h2 className="text-[24px] lg:text-[32px]">
          Almost there, let's just add few images
        </h2>
        <p className="text-base leading-[150%] tracking-[0%] text-center">
          Your first photo shows as your profile pic. Others go on your profile.
          Add 4+ for best results!
        </p>
      </div>

      <div>
        <label htmlFor="uploadImage" className="block mb-2">
          Upload images...
        </label>

        <div className="flex items-start gap-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAthletePhotos}
              className="hidden"
              id="uploadImage"
            />
            <label
              htmlFor="uploadImage"
              className="h-[202px] bg-[#0C0D060D] w-[161px] flex justify-center items-center rounded-xl"
            >
              <img
                src="/assets/images/defaultimg.png"
                className="w-[144px] h-[166px] rounded-2xl"
                alt=""
              />
            </label>
            {formik.touched.onboardPhotos && formik.errors.onboardPhotos && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.onboardPhotos}
              </p>
            )}
          </div>

          {formik.values.onboardPhotos.map((data, i) => (
            <div key={i} className="relative mt-6 lg:mt-6">
              <img
                src={data.url}
                alt="cover"
                width="100"
                height="100"
                className="w-full object-cover h-[160px] rounded-xl"
              />
              <button
                className="bg-red-100 text-red-700 w-6 h-6 rounded-full  flex justify-center items-center absolute -right-1 -top-1 cursor-pointer"
                type="button"
                // className={css.removeImageButton}
                onClick={() => handleRemoveAthletePhoto(i)}
              >
                <IoMdClose />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 mb-10">
        <div>Step 3/4</div>
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

export default OnboardingImages;
