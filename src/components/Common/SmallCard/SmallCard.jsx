import Image from "next/image";
import React from "react";
import DefaultLayout from "../DefaultLayout.jsx/DefaultLayout";

export default function SmallCard({ data, wrapperStyle, cardWrapper }) {
  return (
    <div className={wrapperStyle}>
      <DefaultLayout>
        <div className={cardWrapper}>
          {data.map((i, index) => {
            return (
              <div key={index}>
                <Image
                  src={i.image}
                  width={600}
                  height={600}
                  alt={i.title}
                  className="w-full h-[198px] object-cover lg:object-contain lg:w-[405px] lg:h-[240px]"
                />

                {/* content section */}
                <div className="mt-6 lg:mt-8 text-white">
                  <h2 className="text-2xl leading-[130%] tracking-[-1%] lg:text-[32px]">
                    {i.title}
                  </h2>
                  <p className="text-base leading-[150%] tracking-[0] mt-5">
                    {i.para}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </DefaultLayout>
    </div>
  );
}
