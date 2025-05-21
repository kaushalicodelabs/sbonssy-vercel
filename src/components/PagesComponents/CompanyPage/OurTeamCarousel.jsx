import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import SwiperJsCarousel from "@/components/Common/SwiperJsCarousel/SwiperJsCarousel";
import React from "react";

export default function OurTeamCarousel() {
  return (
    <div className="bg-neonGreen py-[64px] lg:py-[112px]">
      <DefaultLayout>
        <div className="mb-12 lg:mb-20">
          <span className="font-bold">Team</span>
          <h2 className="text-[36px] lg:text-[48px] ">Our team</h2>
          <p className="text-base leading-[150%]">
            Meet the passionate leaders behind our platform.
          </p>
        </div>
      </DefaultLayout>

      <div className="outTeamCarouselWrapper">
        <SwiperJsCarousel
          breakpoint={CarouselBreakPoint}
          data={teamMembers}
          ceoCards="true"
        />
      </div>

      <DefaultLayout>
        <div className="mt-12 lg:mt-20">
          <h3 className="text-[24px] lg:text-[32px]">We’re hiring!</h3>
          <p className="text-base leading-[150%] mt-3 lg:mt-4 mb-5 lg:mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <button className="primaryBtnPurple border-0">Open Position</button>
        </div>
      </DefaultLayout>
    </div>
  );
}

const teamMembers = [
  {
    img: "/assets/images/defaultimg.png",
    name: "Alex Johnson",
    role: "CEO",
    description:
      "Driving innovation and connecting fans with their favorite athletes.",
    linkdin: "#",
    x: "#",
    dribble: "#",
  },
  {
    img: "/assets/images/defaultimg.png",
    name: "Maria Smith",
    role: "CTO",
    description:
      "Leading technology development to enhance user experience on our platform.",
    linkdin: "#",
    x: "#",
    dribble: "#",
  },
  {
    img: "/assets/images/defaultimg.png",
    name: "James Brown",
    role: "CMO",
    description:
      "Crafting marketing strategies that resonate with fans and brands alike.",
    linkdin: "#",
    x: "#",
    dribble: "#",
  },
  {
    img: "/assets/images/defaultimg.png",
    name: "Alex Johnson",
    role: "CEO",
    description:
      "Driving innovation and connecting fans with their favorite athletes.",
    linkdin: "#",
    x: "#",
    dribble: "#",
  },
  {
    img: "/assets/images/defaultimg.png",
    name: "Maria Smith",
    role: "CTO",
    description:
      "Leading technology development to enhance user experience on our platform.",
    linkdin: "#",
    x: "#",
    dribble: "#",
  },
  {
    img: "/assets/images/defaultimg.png",
    name: "James Brown",
    role: "CMO",
    description:
      "Crafting marketing strategies that resonate with fans and brands alike.",
    linkdin: "#",
    x: "#",
    dribble: "#",
  },
  {
    img: "/assets/images/defaultimg.png",
    name: "Alex Johnson",
    role: "CEO",
    description:
      "Driving innovation and connecting fans with their favorite athletes.",
    linkdin: "#",
    x: "#",
    dribble: "#",
  },
  {
    img: "/assets/images/defaultimg.png",
    name: "Maria Smith",
    role: "CTO",
    description:
      "Leading technology development to enhance user experience on our platform.",
    linkdin: "#",
    x: "#",
    dribble: "#",
  },
  {
    img: "/assets/images/defaultimg.png",
    name: "James Brown",
    role: "CMO",
    description:
      "Crafting marketing strategies that resonate with fans and brands alike.",
    linkdin: "#",
    x: "#",
    dribble: "#",
  },
];

const CarouselBreakPoint = {
  320: {
    slidesPerView: 1.2,
    spaceBetween: 24,
  },

  640: {
    slidesPerView: 3.2,
    spaceBetween: 24,
  },

  1280: {
    slidesPerView: 4.2,
    spaceBetween: 32,
  },
};
