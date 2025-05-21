import React from "react";
import DefaultLayout from "../DefaultLayout.jsx/DefaultLayout";
import Link from "next/link";

export default function CTASection({ data, centerAlign }) {
  return (
    <div
      style={{ backgroundImage: `url(${data.img.src || data.img})` }}
      className={`relative overflow-hidden w-full h-fit bg-cover bg-bottom flex  after:w-screen after:h-screen after:bg-black/40 after:absolute after:top-0 after:left-0 ${
        centerAlign === "true"
          ? "justify-center items-center"
          : "justify-left items-center"
      }`}
    >
      <DefaultLayout styling="py-[64px] lg:py-[112px]">
        <div
          className={`z-20 relative ${
            centerAlign === "true" ? "w-fit text-center" : "w-screen text-left "
          }`}
        >
          <h2 className="text-white text-[36px] lg:text-[48px]">
            {data.title}
          </h2>

          <p className="text-white pt-5 lg:pt-6 lg:max-w-[768px]">
            {data.para}
          </p>

          <div
            className={`flex ${
              centerAlign === "true" ? "justify-center " : "justify-start"
            } gap-4 items-center mt-6 lg:mt-8`}
          >
            <Link
              href={data.route1}
              className={`${
                centerAlign === "true"
                  ? "primaryBtnPlain text-white "
                  : "primaryBtn"
              } ${data.imposeBtnClass}`}
            >
              {data.btn1}
            </Link>
            <Link href={data.route2} className="secondaryBtn text-white">
              {data.btn2}
            </Link>
          </div>
        </div>
      </DefaultLayout>
    </div>
  );
}
