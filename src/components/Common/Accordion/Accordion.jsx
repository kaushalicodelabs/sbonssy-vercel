"use client";
import IconsLibrary from "@/util/IconsLibrary";
import React, { useState } from "react";

export default function Accordion({ data }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <React.Fragment>
      <div className="">
        {data.map((item, index) => (
          <div
            key={index}
            className="border-t border-[#0C0D0626] transition-all duration-300"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center py-5 lg:py-[22.5px]"
            >
              <span className="font-bold text-base lg:text-lg leading-[150%]">
                {item.title}
              </span>
              <IconsLibrary
                name="dropdown"
                styling={`h-5 w-5 transform duration-300 transition-transform fill-black ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                openIndex === index ? "max-h-40 pb-5 lg:pb-6" : "max-h-0"
              }`}
            >
              <p className="text-base text-[#0C0D06] leading-[150%] font-[400]">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
