import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import SmallCard from "@/components/Common/SmallCard/SmallCard";
import TextContainer from "@/components/Common/TextContainer/TextContainer";
import IconsLibrary from "@/util/IconsLibrary";
import React from "react";

export default function SmallCardSection() {
  return (
    <div className="bg-reddishPurple">
      <TextContainer data={unlockPontentialData} contentAlliment="true" />
      <SmallCard
        data={smallCardData}
        wrapperStyle="bg-reddishPurple"
        cardWrapper="grid lg:grid-cols-3 gap-12"
      />

      <DefaultLayout>
        <div className="flex gap-4 py-12 lg:py-20">
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

const unlockPontentialData = {
  title: "Unlock Your Potential as a Sport Ambassador ",
  para: `As a sport ambassador, you have a unique chance to grow your reach, earn through brand partnerships, and inspire fans through your campaigns. Join us to turn your presence into lasting impact — and new income streams.`,
  subTitle: "For Sports Ambassadors",
};

const smallCardData = [
  {
    image: "/assets/images/americanFootball.png",
    title: "Grow and Activate Your Fanbase",
    para: `Create lasting connections with your supporters.`,
  },
  {
    image: "/assets/images/cyclistraceguy.png",
    title: "Offer Deals Your Fans Will Love",
    para: `Offer unique deals that fans can't resist.`,
  },
  {
    image: "/assets/images/swimingGuy.png",
    title: "Turn Your Influence into Income",
    para: `Turn your passion into a profitable venture.`,
  },
];
