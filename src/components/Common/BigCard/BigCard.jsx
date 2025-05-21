import React from "react";
import Image from "next/image";
import IconsLibrary from "@/util/IconsLibrary";

export default function BigCard({ data, wrapperStyle }) {
  return (
    <div className={wrapperStyle}>
      {data.map((card, index) => (
        <div key={index} className="">
          <div className="rounded-2xl overflow-hidden lg:max-w-[624px]">
            <Image
              src={card.image}
              alt={card.title}
              width={616}
              height={400}
              className="object-cover w-full h-[335px] lg:h-[400px]"
            />
          </div>
          <div className="mt-6 lg:mt-8">
            <span className="block text-base font-bold mb-2 lg:mb-4">
              {card.subtitle}
            </span>
            <h2 className="text-[32px] lg:text-[40px] font-semibold text-black leading-tight">
              {card.title}
            </h2>
            <p className="text-base text-[#0C0D06] mt-4 lg:mt-6">
              {card.description}
            </p>

            {Array.isArray(card.buttons) && card.buttons?.length > 0 && (
              <div className="flex gap-4 mt-6 lg:mt-8">
                {card.buttons.map((button, idx) =>
                  button.variant === "primary" ? (
                    <button
                      key={idx}
                      className="bg-[#FF6700] text-white px-5 py-2 rounded-full font-medium"
                    >
                      {button.label}
                    </button>
                  ) : (
                    <button
                      key={idx}
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      {button.label}
                      <IconsLibrary styling="fill-black" name="rightChevon" />
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
