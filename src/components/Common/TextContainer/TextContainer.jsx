import React from "react";
import DefaultLayout from "../DefaultLayout.jsx/DefaultLayout";

export default function TextContainer({ data, styling, contentAlliment }) {
  return (
    <div className="bg-reddishPurple">
      <DefaultLayout styling={`py-[64px] lg:py-[112px] ${styling}`}>
        <div className="grid lg:grid-cols-2 lg:justify-between">
          <div>
            <span className="text-base font-bold text-white leading-[150%] block mb-2 lg:mb-4">
              {data.subTitle}
            </span>
            <h3 className="text-white leading-[120%] tracking-[-1%] font-[400] text-[32px] lg:text-[40px] lg:max-w-[616px]">
              {data.title}
            </h3>
            {contentAlliment ? null : (
              <p className="text-white text-base  tracking-[0%] leading-[150%] mt-5 lg:text-lg">
                {data.para}
              </p>
            )}
          </div>

          {contentAlliment ? (
            <p className="text-white text-base  tracking-[0%] leading-[150%] mt-5 lg:text-lg lg:max-w-[616px]">
              {data.para}
            </p>
          ) : null}
          <p></p>
        </div>
      </DefaultLayout>
    </div>
  );
}
