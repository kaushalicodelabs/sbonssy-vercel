import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import SmallCard from "@/components/Common/SmallCard/SmallCard";
import TextContainer from "@/components/Common/TextContainer/TextContainer";
import IconsLibrary from "@/util/IconsLibrary";
import React from "react";

export default function SmallCardSectionBrand() {
  return (
    <div className="bg-reddishPurple text-center">
      <DefaultLayout styling="py-[64px] lg:py-[112px]">
        <div className="lg:max-w-[768px] lg:mx-auto mb-12 lg:mb-20">
          <span className="text-base font-bold text-white leading-[150%] block mb-2 lg:mb-4">
            Engage
          </span>
          <h3 className="text-white leading-[120%] tracking-[-1%] font-[400] text-[32px] lg:text-[40px]">
            Scale Up Your Sport Partnerships
          </h3>

          <p className="text-white text-base  tracking-[0%] leading-[150%] mt-5 lg:text-lg">
            Run smarter, scalable campaigns with sport ambassadors. Activate
            multiple voices at once — for greater reach, deeper engagement, and
            measurable impact.
          </p>
        </div>
        <SmallCard
          data={smallCardData}
          wrapperStyle="bg-reddishPurple"
          cardWrapper="grid lg:grid-cols-3 gap-12"
        />

        <div className="flex gap-4 py-12 lg:py-20 justify-center">
          <button className="primaryBtnPlain text-white font-bold">
            Learn More
          </button>

          <button className="flex text-white cursor-pointer items-center font-[400] gap-2 lg:gap-4 text-base w-fit">
            Sign Up
            <IconsLibrary styling="fill-white" name="rightChevon" />
          </button>
        </div>
      </DefaultLayout>
    </div>
  );
}

const smallCardData = [
  {
    image: "/assets/images/iceHockey.png",
    title: "Launch Campaigns in Minutes",
    para: `Easily set up your campaign in just a few clicks.`,
  },
  {
    image: "/assets/images/skateguyFoot.png",
    title: "Track Performance in Real Time",
    para: `Track your campaign's success with real-time analytics.`,
  },
  {
    image: "/assets/images/runningTwoGuy.png",
    title: "Build Trust Through Real Ambassadors",
    para: `Partner with athletes to enhance your brand visibility.`,
  },
];
