import React from "react";
import DefaultLayout from "../DefaultLayout.jsx/DefaultLayout";
import Image from "next/image";

export default function InsightsComponent({
  cardData,
  headingContent,
  bgColor,
}) {
  return (
    <section className={`bg-${bgColor} text-${headingContent.textColor}`}>
      <DefaultLayout styling="py-[64px] lg:py-[112px]">
        {/* Heading Content */}
        <div className="lg:max-w-[768px] text-center lg:mx-auto mb-12 lg:mb-20">
          <span className="text-base font-bold  leading-[150%] block mb-2 lg:mb-4">
            {headingContent.subTitle}
          </span>
          <h3 className="leading-[120%] tracking-[-1%] font-[400] text-[32px] lg:text-[40px]">
            {headingContent.title}
          </h3>

          <p className="text-base  tracking-[0%] leading-[150%] mt-5 lg:text-lg">
            {headingContent.para}
          </p>
        </div>

        {/* card section */}
        <div className="grid mt-12 lg:mt-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          {cardData.map((post) => (
            <div key={post.id} className="rounded-2xl">
              <div className="">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={300}
                  height={180}
                  className="object-cover w-full h-full rounded-2xl overflow-hidden"
                />
              </div>
              <span
                className={`text-sm border-${cardData.textColor} border rounded-full px-3 py-1 block w-fit mt-6`}
              >
                {post.tag}
              </span>
              <h3 className="mt-2 text-xl lg:text-2xl">{post.title}</h3>
              <p className="text-base mt-2">{post.description}</p>
              <div className="flex items-center gap-2 mt-6">
                <Image
                  src={post.avatar}
                  alt={post.author}
                  width={48}
                  height={48}
                  className="rounded-full w-12 h-12 overflow-hidden"
                />
                <div>
                  <span>{post.author}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className={`mt-12 block lg:mt-20 mx-auto w-fit text-center  ${headingContent.bottomBtn}`}
        >
          View All
        </button>
      </DefaultLayout>
    </section>
  );
}
