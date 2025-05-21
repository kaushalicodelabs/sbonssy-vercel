import React from "react";
import Image from "next/image";
import DefaultLayout from "../DefaultLayout.jsx/DefaultLayout";
import IconsLibrary from "@/util/IconsLibrary";
import Link from "next/link";

export default function ImgNinfo({ data, changeBG, flexDirections }) {
  return (
    <>
      <section className={` bg-${changeBG}`}>
        <DefaultLayout styling="py-[64px] lg:py-[112px]">
          <div
            className={`flex ${flexDirections} lg:justify-between gap-12 lg:items-center `}
          >
            <div className="lg:max-w-[616px]">
              <Image
                src={data.image}
                alt="Swimmers racing"
                width={600}
                height={400}
                className="rounded-2xl object-cover w-full h-[335px] lg:w-[616px] lg:h-[616px]"
              />
            </div>
            <div className="lg:max-w-[616px]">
              <span className="text-left block  text-base font-bold leading-[150%] pb-3 lg:pb-4">
                {data.subtitle}
              </span>
              <h2
                className={`text-textColor ${
                  data.titleFontSize === "change"
                    ? "text-[36px] lg:text-[40px]"
                    : "text-[36px] lg:text-[48px]"
                }`}
              >
                {data.title}
              </h2>

              <p className="text-[#0C0D06] mt-5 lg:mt-6">{data.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                {data.features.map((feature, index) => (
                  <div key={index} className="">
                    <h6 className="text-base text-[#0C0D06] lg:text-lg mb-4">
                      {feature.title}
                    </h6>
                    <h5 className="text-[36px] lg:text-[48px] text-[#0C0D06] mb-2 leading-[120%]">
                      {feature.number}
                    </h5>
                    <p className="text-base text-[#0C0D06] lg:text-lg ">
                      {feature.text}
                    </p>
                    {feature.button?.length > 0 ? (
                      <Link
                        href={feature?.buttonRoute || "#"}
                        style={{ background: "var(--reddishPurple)" }}
                        className="primaryBtnPlain mt-6 lg:mt-[29px] text-white block w-fit"
                      >
                        {feature.button}
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
              {Array.isArray(data.buttons) && data.buttons.length > 0 && (
                <div className="flex gap-4 mt-6 lg:mt-8">
                  {data.buttons.map((button, index) =>
                    button.variant === "primary" ? (
                      <button
                        key={index}
                        style={{
                          background: `${
                            changeBG === "true" ? "var(--reddishPurple)" : ""
                          }`,
                        }}
                        className="primaryBtnPlain text-white"
                      >
                        {button.label}
                      </button>
                    ) : (
                      <button
                        key={index}
                        className="flex cursor-pointer items-center font-[700] gap-2 lg:gap-4 text-base w-fit"
                      >
                        {button.label}
                        <IconsLibrary styling="fill-black" name="rightChevon" />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </DefaultLayout>
      </section>
    </>
  );
}
