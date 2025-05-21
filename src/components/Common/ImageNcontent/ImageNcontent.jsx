import React from "react";
import DefaultLayout from "../DefaultLayout.jsx/DefaultLayout";
import Image from "next/image";
import Link from "next/link";

export default function ImageNcontent({ data, changeBG, textColor }) {
  return (
    <div className={` bg-${changeBG}`}>
      <DefaultLayout styling="py-[64px] lg:py-[112px] bg-transparent">
        <div className="text-white rounded-2xl overflow-hidden flex flex-col lg:flex-row">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:w-full">
            <div className={`lg:max-w-[616px] ${textColor}`}>
              <span
                className={`text-left block  text-base font-bold leading-[150%] pb-3 lg:pb-4`}
              >
                {data.smallHeading}
              </span>
              <h3
                className={`${
                  changeBG === "orange"
                    ? "text-[36px] lg:text-[48px]"
                    : "text-[32px]"
                }  leading-[120%] font-[400]`}
              >
                {data.title}
              </h3>
              <p className="mt-4 text-base lg:text-lg leading-[150%]">
                {data.content}
              </p>

              {data.buttonTitle ? (
                <button className="primaryBtnPlainPurple text-white w-fit mt-6 lg:mt-8">
                  {data.buttonTitle}
                </button>
              ) : null}
            </div>

            <div className="mt-12 lg:mt-0">
              <Image
                src={data.img}
                alt="Basketball player"
                width={600}
                height={600}
                className="w-full object-cover h-[335px] lg:h-[640px] lg:w-[616px] rounded-2xl overflow-hidden "
              />
            </div>
          </div>
        </div>
      </DefaultLayout>
    </div>
  );
}
