import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import IconsLibrary from "@/util/IconsLibrary";
import Image from "next/image";
import React from "react";

// Local images
import cyclist from "../../../../../public/assets/images/cyclist.png";
import featureImage from "../../../../../public/assets/images/feature.png"; // add this image
import boxingImage from "../../../../../public/assets/images/boxing.png"; // add this image

export default function SupportSports({ data }) {
  return (
    <>
      <DefaultLayout styling="py-[64px] lg:py-[112px] ">
        <span className="text-center block text-textColor text-base font-bold leading-[150%]">
          {data.headingSupport}
        </span>
        <h2 className="text-textColor pt-3 pb-5 lg:pb-6 lg:pt-4 max-w-[768px] mx-auto text-center text-[36px] lg:text-[48px]">
          {data.subHeadingSupport1}
        </h2>
        <p className="text-textColor text-center text-base leading-[150%] tracking-[0] lg:text-lg">
          {data.subHeadingSupport2}
        </p>

        {/* Two-column responsive layout */}
        <div className="grid lg:grid-cols-2 mt-12 gap-6 lg:gap-8">
          {/* Left Section */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <div className="flex flex-col gap-0">
              <div className="bg-orange p-6 lg:p-12 text-textColor rounded-t-2xl">
                <span className="font-bold text-base leading-[150%]">
                  {data.colHeadSupport}
                </span>
                <h3 className="font-[400] leading-[120%] text-[32px] lg:text-[40px] mt-3 tracking-[-1%]">
                  {data.colSubHeadSupport}
                </h3>
                <p className="text-base mt-6 lg:max-w-[544px]">
                  {data.colDescSupport}
                </p>
                <div className="pt-6 lg:mt-8 flex items-center gap-6">
                  <button className="primaryBtnPlainPurple text-white">
                    {data.workSupport}
                  </button>
                  <button className="flex cursor-pointer items-center font-[400] gap-2 lg:gap-4 text-base w-fit">
                    {data.exploreBtn}
                    <IconsLibrary styling="fill-black" name="rightChevon" />
                  </button>
                </div>
              </div>
              <Image
                width={400}
                height={400}
                src={cyclist}
                alt="cyclist"
                quality={100}
                className="w-full h-[188px] lg:h-[360px] rounded-b-2xl"
              />
            </div>

            <div className="flex gap-6 flex-col lg:flex-row lg:gap-8 h-full">
              {/* card One */}
              <div className="w-full bg-reddishPurple p-6 lg:p-8 rounded-2xl justify-between flex flex-col">
                <div>
                  <h3 className="text-white text-2xl leading-[140%] tracking-[-1%]">
                    {data.colHeadBrand}
                  </h3>
                  <p className="text-white mt-2 text-base leading-[150%]">
                    {data.colSubHeadBrand}
                  </p>
                </div>
                <button className="primaryBtnPlain mt-5 lg:mb-10 w-fit">
                  {data.learnMoreBtn}
                </button>
              </div>

              {/* card Two */}
              <div className="w-full bg-neonGreen p-6 lg:p-8 rounded-2xl justify-between flex flex-col">
                <div>
                  <h3 className="text-textColor text-2xl leading-[140%] tracking-[-1%]">
                    {data.colHeadSport}
                  </h3>
                  <p className="text-textColor mt-2 text-base leading-[150%]">
                    {data.colSubHeadSport}
                  </p>
                </div>
                <button
                  style={{ backgroundColor: "var(--reddishPurple)" }}
                  className="primaryBtnPlain mt-5 text-white lg:mb-10 w-fit"
                >
                  {data.learnMoreBtn}
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-6 lg:gap-8 mt-8 lg:mt-0">
            {/* Feature Card */}
            <div className="rounded-2xl overflow-hidden flex flex-col lg:flex-row">
              <div className="lg:w-1/2 h-[200px] lg:h-auto">
                <Image
                  src={featureImage}
                  alt="Feature visual"
                  width={400}
                  height={400}
                  className="w-full h-[326px] lg:h-[340px] object-cover"
                />
              </div>
              <div className="lg:w-1/2 bg-reddishPurple text-white p-6 lg:p-8 flex flex-col justify-center">
                <span className="font-bold text-base leading-[150%]">
                  {data.colFeatures}
                </span>
                <h3 className="text-2xl mt-2 leading-[140%] tracking-[-1%]">
                  {data.colFeaturesHeading}
                </h3>
                <p className="text-base mt-2 leading-[150%]">
                  {data.colFeaturesSubHeading}
                </p>
              </div>
            </div>

            {/* Resource Card */}

            <div>
              <div className="bg-orange text-textColor p-6 lg:p-12 rounded-t-2xl">
                <span className="font-bold text-base leading-[150%]">
                  {data.colResources}
                </span>
                <h3 className="font-[400] text-[32px] lg:text-[40px] leading-[120%] mt-2">
                  {data.colResourcesHeading}
                </h3>
                <p className="text-base mt-6 lg:max-w-[544px]">
                  {data.colResourcesSubHeading}
                </p>
                <button
                  className="primaryBtnPlain mt-6 w-fit"
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  {data.readMoreBtn}
                </button>
              </div>

              {/* Boxing Image */}
              <div className="rounded-b-2xl overflow-hidden">
                <Image
                  src={boxingImage}
                  alt="Boxing silhouette"
                  width={400}
                  height={400}
                  className="w-full h-[188px]  full lg:h-[360px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}
