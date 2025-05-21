"use client";

import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import SwiperJsCarousel from "@/components/Common/SwiperJsCarousel/SwiperJsCarousel";

export default function ShopSmarter({ data }) {
  return (
    <div className="py-[64px] lg:py-[112px] bg-whiteSmoke w-full h-full">
      <DefaultLayout>
        <h2 className="text-center text-textColor text-[36px] lg:text-[48px] lg:max-w-[768px] lg:mx-auto">
          {data.heading}
        </h2>

        <p className="text-textColor lg:mx-auto lg:mt-6 text-center text-base">
          {data.subHeading}
        </p>
      </DefaultLayout>
      <div className="mt-12 lg:mt-20 ShopSmarterCarouselWrapper">
        <SwiperJsCarousel
          data={shopSmartData}
          imgStyling="w-[144px] h-[144px] lg:w-[304px] lg:h-[304px]"
          breakpoint={CarouselBreakPoint}
          simpleCarousel="true"
        />
      </div>
    </div>
  );
}

const shopSmartData = [
  {
    img: "/assets/images/shopCarousel/1.png",
  },
  {
    img: "/assets/images/shopCarousel/2.png",
  },
  {
    img: "/assets/images/shopCarousel/3.png",
  },
  {
    img: "/assets/images/shopCarousel/4.png",
  },
  {
    img: "/assets/images/shopCarousel/1.png",
  },
  {
    img: "/assets/images/shopCarousel/2.png",
  },
  {
    img: "/assets/images/shopCarousel/3.png",
  },
  {
    img: "/assets/images/shopCarousel/4.png",
  },
];

const CarouselBreakPoint = {
  320: {
    slidesPerView: 2.3,
    spaceBetween: 24,
  },

  640: {
    slidesPerView: 4.4,
  },

  1280: {
    spaceBetween: 32,
  },

  1600: {
    slidesPerView: 6.4,
    spaceBetween: 32,
  },
};
