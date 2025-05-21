import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import IconsLibrary from "@/util/IconsLibrary";
import React from "react";

export default function ContentSection() {
  return (
    <div>
      <section className="bg-reddishPurple">
        <DefaultLayout styling="py-[64px] lg:py-[112px]">
          {/* hero section start here */}
          <div className="max-w-[768px] text-white text-left">
            <h2 className="text-[32px] lg:text-[48px] mt-6 mb-5 lg:mb-6">
              Elevating sports
            </h2>
            <p className="text-base lg:text-lg font-normal leading-[150%]">
              Uniting fans, athletes, and brands through innovative promotions
              and affiliate marketing opportunities.
            </p>
          </div>
          {/* hero section end here */}
        </DefaultLayout>
      </section>

      {/* content section start here */}
      <section className="bg-white">
        <DefaultLayout styling={"py-[64px] lg:py-[112px]"}>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 justify-between items-start text-textColor">
            <div className="max-w-[616px]">
              <span className="text-base font-bold">Empower</span>
              <h2 className="text-[36px] lg:text-[48px] mt-3 lg:mt-4">
                Connecting Fans, Brands, and Sport Ambassadors Seamlessly
              </h2>
            </div>

            <div className="max-w-[616px]">
              <p className=" lg:text-lg text-base">
                At sbonssy, we believe in the power of connection. Our mission
                is to create a vibrant platform where fans can easily discover
                promotions while supporting their favorite ambassadors.
              </p>

              <div className="flex gap-4 mt-6 lg:mt-8">
                <button className="primaryBtnPlain border-0 text-white font-bold">
                  Learn More
                </button>

                <button className="flex cursor-pointer items-center font-[400] gap-2 lg:gap-4 text-base w-fit">
                  Sign Up
                  <IconsLibrary styling="fill-white" name="rightChevon" />
                </button>
              </div>
            </div>
          </div>
        </DefaultLayout>
      </section>
      {/* content section end here */}
    </div>
  );
}
