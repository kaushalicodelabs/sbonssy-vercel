import Accordion from "@/components/Common/Accordion/Accordion";
import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import React from "react";

export default function AccordionSection() {
  return (
    <div>
      <DefaultLayout styling="py-[64px] lg:py-[112px]">
        <div className="text-left text-textColor pb-12 lg:mb-20">
          <h2 className="text-[32px] lg:text-[48px] ">FAQs</h2>
          <p className="text-base lg:text-lg tracking-[0%] leading-[150%] font-[400] pt-5 lg:pt-6">
            Find answers to your most pressing questions about athletes and
            teams on our platform.
          </p>
        </div>

        <Accordion data={data} />

        <div className="mt-12 lg:mt-20">
          <h2 className="text-[24px] lg:text-[32px]"> Still have questions?</h2>
          <p className="text-base lg:text-lg tracking-[0%] leading-[150%] font-[400] pt-4">
            We're here to help!
          </p>
          <button className="primaryBtnPlain mt-6 text-white">Contact</button>
        </div>
      </DefaultLayout>
    </div>
  );
}

const data = [
  {
    title: "How do I sign up?",
    content:
      "Signing up is easy! Simply visit our registration page, fill out the required information, and submit your application. You'll receive a confirmation email once your account is activated.",
  },
  {
    title: "Can I promote campaigns?",
    content:
      "Absolutely! Once you are registered, you can browse available campaigns and choose the ones you want to promote. Share them with your followers to maximize your impact.",
  },
  {
    title: "What are affiliate campaigns?",
    content:
      "Affiliate campaigns are marketing initiatives where brands partner with ambassadors to promote their products. Ambassadors earn commissions for driving sales through their promotions. It's a win-win for everyone involved!",
  },
  {
    title: "How do I get paid?",
    content:
      "Payments are processed through our platform on a monthly basis. Once you reach the minimum payout threshold, your earnings will be transferred to your designated payment method. Ensure your payment details are up to date!",
  },
  {
    title: "Who can join?",
    content:
      "Anyone who is elevating the world of sports can join our platform! Whether you're an athlete, team, club, sport influencer, or a coach looking to monetize your influence, we welcome you to sign up and start connecting with your fans.",
  },
  {
    title: "How to share selected campaigns?",
    content:
      "You can share campaigns directly with your audience using their unique links or promotional tools. Alternatively, you can share your profile, where all your selected campaigns are easily accessible in one place.",
  },
];
