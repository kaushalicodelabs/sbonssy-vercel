import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import SwiperJsCarousel from "@/components/Common/SwiperJsCarousel/SwiperJsCarousel";

export default function CarouselSection() {
  return (
    <div className="py-[64px] lg:py-[112px]">
      <DefaultLayout>
        <div className="lg:max-w-[768px] lg:mx-auto text-center">
          <h2 className="text-[36px] lg:text-[48px]">Our Sport Ambassadors</h2>
          <p className="text-base lg:text-lg leading-[150%] tracking-[0] mt-5">
            Real people. Real stories. Explore the community driving change in
            sports.
          </p>
        </div>
      </DefaultLayout>

      <div className="SportAmbassadorsCarouselWrapper mt-[48px]">
        <SwiperJsCarousel
          data={carouselContent}
          imgStyling="w-full h-[144px] object-cover  lg:w-[304px] lg:h-[304px] rounded-2xl"
          breakpoint={CarouselBreakPoint}
          simpleCarousel="true"
        />
      </div>
    </div>
  );
}

const carouselContent = [
  {
    img: "/assets/images/athleticNteamsCarousel/1.png",
  },
  {
    img: "/assets/images/athleticNteamsCarousel/2.png",
  },
  {
    img: "/assets/images/athleticNteamsCarousel/3.png",
  },
  {
    img: "/assets/images/athleticNteamsCarousel/4.png",
  },
  {
    img: "/assets/images/athleticNteamsCarousel/1.png",
  },
  {
    img: "/assets/images/athleticNteamsCarousel/2.png",
  },
  {
    img: "/assets/images/athleticNteamsCarousel/3.png",
  },
  {
    img: "/assets/images/athleticNteamsCarousel/4.png",
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
