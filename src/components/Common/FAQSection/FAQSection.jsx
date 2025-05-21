import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import React from "react";

export default function FAQSection({ data, content }) {
  return (
    <section className="bg-white">
      <DefaultLayout styling="py-[64px] lg:py-[112px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:justify-between lg:gap-20">
          <div className="lg:max-w-[500px] text-textColor">
            <h2 className="text-[32px] lg:text-[48px] font-semibold">FAQs</h2>
            <p className="mt-5 lg:mt-6">
              Find answers to common questions about our platform and how it
              benefits brands.
            </p>
            {/* { content?.length > 0 ? (
              <p className="mt-5 lg:mt-6">{content}</p>
            ) : (
              <p className="mt-5 lg:mt-6">
                Find answers to common questions about our platform and how it
                benefits brands.
              </p>
            )} */}

            <button className="primaryBtnPlain text-white fw-bold mt-6 lg:mt-8">
              Contact
            </button>
          </div>

          <div className="lg:max-w-[732px]">
            {data.map((faq, index) => (
              <div key={index} className="mt-10 lg:mt-12">
                <h4 className="font-semibold">{faq.title}</h4>
                <p className=" mt-3 lg:mt-4 ">{faq.content}</p>
              </div>
            ))}
          </div>
        </div>
      </DefaultLayout>
    </section>
  );
}
