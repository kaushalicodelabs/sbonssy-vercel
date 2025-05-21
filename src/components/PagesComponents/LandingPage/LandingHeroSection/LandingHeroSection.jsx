import React from "react";
import DefaultLayout from "../../../Common/DefaultLayout.jsx/DefaultLayout";

export default function LandingHeroSection({ data, bgImg }) {
  return (
    <section className="overflow-hidden">
      <div
        className="bg-cover relative bg-center h-screen w-full flex justify-start items-center after:w-screen after:h-screen after:bg-black/40 after:absolute after:top-0 after:left-0"
        style={{ backgroundImage: `url(${bgImg?.src})` }}
      >
        <DefaultLayout>
          <div className="lg:w-screen h-full relative z-20">
            <div className="w-full lg:max-w-[560px]">
              <h1 className="text-white font-[400] text-[40px] leading-[120%] tracking-[-1%] lg:text-[56px] ">
                {data?.title}
              </h1>
              <p className=" mt-5 lg:mt-6 text-white font-[400] text-lg leading-[150%]">
                {data.desc}
              </p>

              <div className="mt-6 lg:mt-8 flex items-center gap-4">
                <button className="primaryBtn">{data.btn1}</button>
                <button className="secondaryBtn text-white">{data.btn2}</button>
              </div>
            </div>
          </div>
        </DefaultLayout>
      </div>
    </section>
  );
}
