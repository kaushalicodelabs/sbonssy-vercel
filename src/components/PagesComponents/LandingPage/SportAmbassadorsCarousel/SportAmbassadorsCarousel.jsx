"use client";
import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import React from "react";
import SwiperJsCarousel from "@/components/Common/SwiperJsCarousel/SwiperJsCarousel";

export default function SportAmbassadorsCarousel({ data }) {
  return (
    <div className="py-[64px] lg:py-[112px]">
      <DefaultLayout>
        <h2 className="text-[36px] lg:text-[48px]">{data}</h2>
      </DefaultLayout>

      <div className="SportAmbassadorsCarouselWrapper mt-[48px]">
        <SwiperJsCarousel
          data={carouselContent}
          imgStyling="w-full h-[144px] object-cover  lg:w-[416px] lg:h-[416px] rounded-2xl"
          breakpoint={breakpoints}
        />
      </div>
    </div>
  );
}

const carouselContent = [
  { img: "/assets/images/dicoverCarousel/3.png" },
  { img: "/assets/images/dicoverCarousel/2.png" },
  { img: "/assets/images/dicoverCarousel/3.png" },
  { img: "/assets/images/dicoverCarousel/4.jpg" },
  { img: "/assets/images/dicoverCarousel/3.png" },
  { img: "/assets/images/dicoverCarousel/2.png" },
  { img: "/assets/images/dicoverCarousel/3.png" },
  { img: "/assets/images/dicoverCarousel/4.jpg" },
  { img: "/assets/images/dicoverCarousel/3.png" },
  { img: "/assets/images/dicoverCarousel/2.png" },
];

const breakpoints = {
  320: {
    slidesPerView: 2.5,
    spaceBetween: 24,
  },

  640: {
    slidesPerView: 2.5,
  },
  1200: {
    slidesPerView: 3.5,
    spaceBetween: 32,
  },
  1340: {
    slidesPerView: 3.5,
    spaceBetween: 32,
  },
  1600: {
    slidesPerView: 4.5,
    spaceBetween: 32,
  },
};
