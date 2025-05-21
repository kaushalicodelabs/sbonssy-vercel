import React from "react";
import DefaultLayout from "../DefaultLayout.jsx/DefaultLayout";
import Image from "next/image";
import IconsLibrary from "@/util/IconsLibrary";

export default function CheckBoxSection({ data, sideData, styling }) {
  return (
    <section className="bg-[#EBEDF0]">
      <DefaultLayout styling="py-[64px] lg:py-[112px]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
          {/* Left Column */}
          <div className="lg:w-1/2">
            <span className="text-sm font-bold leading-[150%] block mb-2 lg:mb-4">
              {sideData?.checkboxHeading}
            </span>
            <h2 className="text-3xl font-bold mb-6">
              {sideData?.checkboxSubHeading}
            </h2>
            <div className="flex gap-4 mt-6 lg:mt-8">
              <button className="primaryBtnPlain text-white font-bold">
                {sideData?.checkboxBtn1}
              </button>

              <button className="flex cursor-pointer items-center font-[400] gap-2 lg:gap-4 text-base w-fit">
                {sideData?.checkboxBtn2}
                <IconsLibrary styling="fill-black" name="rightChevon" />
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/2 space-y-10">
            {data.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 lg:gap-10 items-start mt-10  mb-0 md:mt-4 lg:mt-0 lg:max-h-auto lg:min-h-[164px] drawALine"
              >
                <IconsLibrary
                  name="fillCheckBox"
                  styling="min-w-[36px] min-h-[40px] fill-[#0C0D06]"
                />
                <div>
                  <h4 className="font-semibold text-xl">{step.title}</h4>
                  <p className="text-gray-700 mt-3 text-base pb-6">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DefaultLayout>
    </section>
  );
}
