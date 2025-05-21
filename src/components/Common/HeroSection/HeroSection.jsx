import React from "react";
import DefaultLayout from "../DefaultLayout.jsx/DefaultLayout";

export default function HeroSection({ data, centerContent }) {
  return (
    <section
      className={`bg-cover bg-center w-full flex justify-start items-center after:w-screen after:h-screen after:bg-black/50 after:absolute after:top-0 after:left-0 overflow-hidden relative`}
      style={{
        backgroundImage: `url(${data?.img?.src || data?.img})`,
        height: data.height,
        backgroundPosition: data?.bgPosition,
      }}
    >
      <DefaultLayout>
        <div
          className={`z-20 relative ${
            centerContent === "true"
              ? "w-fit text-center lg:max-w-[768px]"
              : "lg:w-screen"
          }`}
        >
          <span className="text-left text-white text-base font-bold leading-[150%]  mb-3 lg:mb-5">
            {data.subTitle}
          </span>
          <h1
            className={`text-white font-[400] text-[40px] leading-[120%] tracking-[-1%] lg:text-[56px] lg:max-w-[${data.maxWidthContent}]`}
          >
            {data.title}
          </h1>
          <p
            className={`mt-5 lg:mt-6 text-white font-[400] text-lg leading-[150%] lg:max-w-[${data.maxWidthContent}]`}
          >
            {data.content}
          </p>

          {data.button1 ? (
            <div
              className={
                centerContent === "true" ? " mx-auto w-fit text-center" : ""
              }
            >
              <div className="mt-6 lg:mt-8 flex items-center gap-4">
                <button className="primaryBtn">{data.button1}</button>
                <button className="secondaryBtn text-white">
                  {data?.button2}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </DefaultLayout>
    </section>
  );
}
