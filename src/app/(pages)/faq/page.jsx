import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import TextContainer from "@/components/Common/TextContainer/TextContainer";
import React from "react";

export default function page() {
  return (
    <>
      <TextContainer data={FrequentlyAskedData} contentAlliment="true" />
      <DefaultLayout styling="py-[64px] lg:py-[112px]">
        <h2 className="text-[36px] lg:text-[48px] font-normal mb-5 lg:mb-6">
          FAQs
        </h2>
        <p className="text-base lg:text-lg">
          Find answers to common questions about our platform for fans, brands,
          and athletes.
        </p>

        <div className="mt-12 lg:mt-20">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b last:border-b-0 border-[#0C0D0626] pt-5 pb-10 lg:pb-12 lg:pt-6 nth-[1]:border-t "
            >
              <h6 className="text-lg font-bold">{faq.question}</h6>
              <p className="text-lg font-normal text-[#0C0D06]">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 lg:mt-20">
          <h2 className="text-[24px] lg:text-[32px]"> Still have questions?</h2>
          <p className="text-base lg:text-lg tracking-[0%] leading-[150%] font-[400] pt-4">
            We're here to help!
          </p>
          <button className="primaryBtnPlain mt-6 text-white">Contact</button>
        </div>
      </DefaultLayout>

      <section className="bg-neonGreen">
        <DefaultLayout styling="py-[64px] lg:py-[112px]">
          <h2 className="text-[36px] lg:text-[48px] text-[#0C0D06]">
            Need More Help? Contact Us
          </h2>
          <p className="text-[#0C0D06] text-lg mt-5 lg:mt-6">
            Our support team is here to assist you with any questions you may
            have.
          </p>

          <div className="flex items-center text-base gap-4 mt-6 lg:mt-8">
            <button className="primaryBtnPurple">Contact</button>
            <button className="primaryBtnGreen">Support</button>
          </div>
        </DefaultLayout>
      </section>
    </>
  );
}

const FrequentlyAskedData = {
  title: "Frequently Asked Questions",
  para: `Welcome to our FAQ page! Here, you'll find answers to common questions about our platform, helping you navigate your experience with ease.`,
};

const faqData = [
  {
    question: "How do I sign up?",
    answer:
      "Signing up is easy! Simply click on the 'Sign Up' button on our homepage and fill out the required information. Once you verify your email, you can start exploring promotions.",
  },
  {
    question: "What is affiliate marketing?",
    answer:
      "Affiliate marketing is a performance-based marketing strategy where brands reward affiliates for promoting their product, services or brand itself. In our case, ambassadors promote campaigns and earn commissions on sales generated through their efforts. It's a win-win for everyone involved!",
  },
  {
    question: "How can brands participate?",
    answer:
      "Brands can join our platform by creating an account and submitting their campaigns for approval. Once approved, they can publish promotions that athletes will share with their fans. This helps brands reach a broader audience effectively.",
  },
  {
    question: "How do I find promotions?",
    answer:
      "You can discover promotions by browsing our marketplace on the platform. Filter by your favorite athletes or teams to find relevant offers. Stay updated by checking back frequently for new deals!",
  },
  {
    question: "Can I support athletes?",
    answer:
      "Absolutely! By participating in promotions and sharing them with your network, you directly support your favorite athletes. Every purchase made through their promotions helps them earn commissions and grow their brand.",
  },
];
