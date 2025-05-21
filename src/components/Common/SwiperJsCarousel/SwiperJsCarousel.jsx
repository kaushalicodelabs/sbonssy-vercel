"use client";
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import IconsLibrary from "@/util/IconsLibrary";
import DefaultLayout from "../DefaultLayout.jsx/DefaultLayout";
import Link from "next/link";
import Image from "next/image";

export default function SwiperJsCarousel({
  data,
  imgStyling,
  breakpoint,
  simpleCarousel,
  testimonial,
  ceoCards,
  slidesCount,
  slideSpace,
  swiperBtnStl,
  campaignBtnStyl,
  showImgContent,
  myCampCarousel,
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setSwiperReady(true); // ensures refs are attached before rendering Swiper
  }, []);

  // Handle Swiper Slide Change
  const handleSlideChange = () => {
    if (swiperRef.current) {
      setActiveIndex(swiperRef.current.swiper.realIndex);
    }
  };

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      swiperRef.current.swiper.params.navigation.prevEl = prevRef.current;
      swiperRef.current.swiper.params.navigation.nextEl = nextRef.current;

      // Destroy existing navigation, if any
      swiperRef.current.swiper.navigation.destroy();

      // Re-initialize with new refs
      swiperRef.current.swiper.navigation.init();
      swiperRef.current.swiper.navigation.update();
    }
  }, [swiperReady]);

  // Custom Pagination Controls
  const goToSlide = (index) => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  // const TagName = simpleCarousel === "true" ? "div" : DefaultLayout;
  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Navigation]}
        loop={true}
        breakpoints={breakpoint}
        // custom build
        ref={swiperRef}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSlideChange={handleSlideChange}
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.navigation !== "boolean") {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        slidesPerView={slidesCount}
        spaceBetween={slideSpace}
      >
        {data.map((i, index) => {
          return (
            <SwiperSlide key={index}>
              {ceoCards === true ? (
                <div className="w-[calc(100% - 20px)] lg:w-fit">
                  <div className="lg:w-[400px] h-[198px] lg:h-[395px] rounded-2xl overflow-hidden">
                    <Image
                      src={i.img || null}
                      width={400}
                      height={395}
                      alt={i.name}
                      className="rounded-2xl w-[100%] h-full object-cover lg:w-full"
                    />
                  </div>
                  <div className="flex gap-3 text-sm mt-5 lg:mt-6">
                    <Link href={i.linkdin}>
                      <IconsLibrary name="linkdinSolidDark" />
                    </Link>

                    <Link href={i.x}>
                      <IconsLibrary name="XSolidDark" />
                    </Link>

                    <Link href={i.dribble}>
                      <IconsLibrary name="dribbleSolidDark" />
                    </Link>
                  </div>
                </div>
              ) : testimonial === true ? (
                <div className="flex flex-col items-center gap-6">
                  <Image
                    src={i.platformLogo}
                    alt={i.platformName}
                    width={80}
                    height={24}
                  />

                  <p className="text-xl text-center md:text-2xl font-medium text-black max-w-2xl">
                    “{i.quote}”
                  </p>
                  <div className="mt-4 text-center">
                    <div className="w-[56px] h-[56px] rounded-full bg-white flex justify-center items-center mx-auto">
                      <Image
                        src={i.companyLogo}
                        width={38}
                        height={38}
                        alt="..."
                      />
                    </div>
                    <div className="text-black text-lg font-semibold">
                      {i.author}
                    </div>
                    <div className="text-black text-sm">{i.position}</div>
                  </div>
                </div>
              ) : (
                <div>
                  <Image
                    src={i.img || null}
                    alt="img"
                    width={304}
                    height={304}
                    draggable={false}
                    className={imgStyling}
                  />
                  {showImgContent ? (
                    <p className="text-[18px]font-normal leading-6 text-[#0C0D06] mt-4">
                      {i?.title}
                    </p>
                  ) : null}
                  {showImgContent ? (
                    <h2 className="text-[14px] !font-bold leading-6 text-[#0C0D06] mt-2 mb-2">
                      {i?.brand}
                    </h2>
                  ) : null}
                  {showImgContent ? (
                    <button className="bg-[#0C0D060D] text-[##0C0D06] h-10 px-5  w-full text-center rounded-full">
                      Select Ambassador
                    </button>
                  ) : null}
                </div>
              )}
            </SwiperSlide>
          );
        })}
        {simpleCarousel && (
          <div
            className={`${swiperBtnStl} absolute z-10 justify-between items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex ${
              testimonial ? "w-full" : "w-[95%]"
            }`}
          >
            <button
              ref={prevRef}
              className="bg-[#D7CED2] border-[#EBE6E8] border rounded-full cursor-pointer w-12 h-12 flex justify-center items-center"
            >
              <IconsLibrary name="arrow" />
            </button>
            <button
              ref={nextRef}
              className="bg-[#D7CED2] border-[#EBE6E8] border rounded-full w-12 h-12 cursor-pointer flex justify-center items-center -scale-x-100"
            >
              <IconsLibrary name="arrow" />
            </button>
          </div>
        )}
      </Swiper>
      {/* ------------- */}
      <DefaultLayout>
        <div
          className={`flex items-center mt-8 ${myCampCarousel} ${
            simpleCarousel === "true" ? "justify-center" : "justify-between"
          }`}
          // className={` ${myCampCarousel} flex items-center mt-8 lg:mt-12 ${simpleCarousel === "true" ? "justify-center" : "justify-between"
          //   }`}
        >
          <div className="flex gap-2">
            {data.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full  ${
                  activeIndex === index
                    ? "bg-[var(--textColor)]"
                    : "bg-[var(--textColor)]/20"
                }`}
              ></button>
            ))}
          </div>

          {simpleCarousel === "true" ? null : (
            <div className="flex items-center gap-4 justify-center">
              <button
                ref={prevRef}
                className={`${
                  ceoCards === "true" ? "bg-reddishPurple" : "bg-[#F1F1F1]"
                }  ${campaignBtnStyl} rounded-full cursor-pointer w-12 h-12 flex justify-center items-center`}
              >
                {ceoCards ? (
                  <IconsLibrary name="whiteArrow" />
                ) : (
                  <IconsLibrary name="arrow" />
                )}
              </button>
              <button
                ref={nextRef}
                className={`rounded-full w-12 h-12 cursor-pointer flex justify-center items-center -scale-x-100 ${
                  ceoCards === "true" ? "bg-reddishPurple" : "bg-[#F1F1F1]"
                } ${campaignBtnStyl}`}
                // className={`${ceoCards === "true" ? "bg-reddishPurple" : "bg-[#F1F1F1]"
                //   } ${campaignBtnStyl} rounded-full w-12 h-12 cursor-pointer flex justify-center items-center -scale-x-100`}
              >
                {ceoCards ? (
                  <IconsLibrary name="whiteArrow" />
                ) : (
                  <IconsLibrary name="arrow" />
                )}
                {/* 
                <IconsLibrary
  name={
    ceoCards
      ? "whiteArrow"
      : campaignBtnStyl
      ? "whiteArrow"
      : "arrow"
  }
/> */}
              </button>
            </div>
          )}
        </div>
      </DefaultLayout>
    </div>
  );
}
