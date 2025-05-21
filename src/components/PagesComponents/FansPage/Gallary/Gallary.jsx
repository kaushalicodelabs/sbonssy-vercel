import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import Image from "next/image";
import React from "react";

export default function Gallary({ data }) {
  return (
    <section className="bg-reddishPurple">
      <DefaultLayout styling="py-[64px] lg:py-[112px] ">
        <div className="lg:max-w-[768px] text-center mx-auto text-white">
          <h2 className="text-[32px] lg:text-[48px]">{data.galleryHeading}</h2>
          <p className="text-base lg:text-lg mt-4 lg:mt-6">
            {data.galleryDesc}
          </p>
        </div>

        <div className="mt-12 lg:mt-20">
          <div className="columns-1 md:columns-3 gap-6 lg:gap-8">
            {imageData.map((src, index) => (
              <div key={index} className="overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt={`Athlete ${index + 1}`}
                  width={400}
                  height={400}
                  className="object-cover w-full h-auto mb-6 lg:mb-8"
                />
              </div>
            ))}
          </div>
        </div>
      </DefaultLayout>
    </section>
  );
}

const imageData = [
  "/assets/images/gallary/img1.png",
  "/assets/images/gallary/img4.png",
  "/assets/images/gallary/img2.png",
  "/assets/images/gallary/img5.png",
  "/assets/images/gallary/img6.png",
  "/assets/images/gallary/img3.png",
  "/assets/images/gallary/img7.png",
];
