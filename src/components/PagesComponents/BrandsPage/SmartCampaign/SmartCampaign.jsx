import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import IconsLibrary from "@/util/IconsLibrary";
import React from "react";

export default function SmartCampaign({ data }) {
  return (
    <section className="bg-reddishPurple">
      <DefaultLayout styling="py-[64px] lg:py-[112px]">
        <div className="">
          <h2 className="text-[32px] lg:text-[40px] text-white mb-20">
            Smart Campaign Tools to Reach Fans
          </h2>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {data.map((tool, index) => (
              <div key={index} className="text-white text-left">
                <IconsLibrary name="fillCheckBox" styling="fill-white" />

                <h4 className="text-xl lg:text-2xl mt-3 lg:pt-6">
                  {tool.title}
                </h4>
                <p className="text-base mt-3 lg:pt-6">{tool.description}</p>

                <a className="flex cursor-pointer items-center font-[400] gap-2 lg:gap-4 text-base w-fit mt-6 lg:mt-8">
                  {tool.linkLabel}{" "}
                  <IconsLibrary styling="fill-white" name="rightChevon" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </DefaultLayout>
    </section>
  );
}
