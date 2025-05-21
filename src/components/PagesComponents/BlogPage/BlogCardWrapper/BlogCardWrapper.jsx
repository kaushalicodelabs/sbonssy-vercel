"use client";
import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import Image from "next/image";
import React, { useState } from "react";

export default function BlogCardWrapper({ blogData, tabData }) {
  const [activeTab, setactiveTab] = useState(0);

  const handleClick = (index) => {
    setactiveTab(index);
  };

  return (
    <>
      <DefaultLayout styling="pb-[64px] lg:pb-[112px]">
        {/* tabs */}
        <div className="mb-12 lg:mb-16 flex w-full overflow-x-auto">
          {tabData.map((i, index) => {
            return (
              <React.Fragment key={index}>
                <button
                  onClick={() => handleClick(index)}
                  className={`py-[10px] px-4 text-nowrap rounded-full transition-all duration-300 cursor-pointer hover:bg-[#390a21] hover:text-white   ${
                    activeTab === index ? "bg-orange text-white" : "bg-white"
                  }`}
                >
                  {i}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* card wrapper */}
        <div className="grid gap-12 lg:gap-8 md:grid-cols-[repeat(auto-fill,_minmax(328px,_1fr))] ">
          {blogData.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden text-left text-textColor w-full rounded-2xl h-fit"
            >
              {/* Top Image */}
              <Image
                src={item.image}
                alt="cover"
                width={200}
                height={200}
                className="object-cover w-full h-[221px]"
              />

              {/* Orange Bottom Section */}
              <div className="bg-orange flex flex-col p-6 h-full">
                {/* blog title & description */}
                <div>
                  <span className="text-base font-bold leading-[150%] block mb-2 lg:mb-2">
                    {item.tag}
                  </span>
                  <h3 className="text-lg mb-2">{item.title}</h3>
                  <p className="text-sm">{item.description}</p>
                </div>

                {/* author & blog timing */}
                <div className="flex items-center gap-2 mt-6 lg:gap-4">
                  <Image
                    src={item.avatar}
                    alt={item.author}
                    width={48}
                    height={48}
                    className="rounded-full w-12 h-12 overflow-hidden"
                  />
                  <div>
                    <span className="font-bold">{item.author}</span>
                    <div className="flex items-center gap-2 text-sm">
                      <span>{item.date}</span>
                      <span className="">•</span>
                      <span>{item.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DefaultLayout>
    </>
  );
}
