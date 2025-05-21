import CheckBoxSection from "@/components/Common/CheckBoxSection/CheckBoxSection";
import HeroSection from "@/components/Common/HeroSection/HeroSection";
import ImageNcontent from "@/components/Common/ImageNcontent/ImageNcontent";
import ImgNinfo from "@/components/Common/ImgNinfo/ImgNinfo";
import FAQSection from "@/components/Common/FAQSection/FAQSection";
import SmallCardSectionBrand from "@/components/PagesComponents/BrandsPage/SmallCardSectionBrand/SmallCardSectionBrand";
import SmartCampaign from "@/components/PagesComponents/BrandsPage/SmartCampaign/SmartCampaign";
import TrustedBy from "@/components/PagesComponents/BrandsPage/TrustedBy/TrustedBy";
import SingleReview from "@/components/Common/SingleReview/SingleReview";
import React from "react";
import CTASection from "@/components/Common/CTASection/CTASection";

export default function page() {
  return (
    <>
      <HeroSection data={brandheroData} centerContent="false" />
      <SmallCardSectionBrand />
      <TrustedBy />
      <CheckBoxSection data={checkBoxData} />
      <ImageNcontent data={measureData} changeBG="orange" />
      <FAQSection data={faqData} />
      <SmartCampaign data={SmartCampaignData} />
      <SingleReview data={singleReviewData} noStars="true" />
      <CTASection data={ctaData} centerAlign="true" />
    </>
  );
}

const brandheroData = {
  img: "/assets/heroImages/brandheroImg.jpg",
  subTitle: "For Brands",
  title: "Drive Real Results Through Sport Ambassadors",
  content: `Partner with sport ambassadors to boost visibility — and only pay when it works.`,
  height: "525px",
  maxWidthContent: "768px",
  button1: "s",
};

const checkBoxData = [
  {
    title: "Easy Setup",
    description:
      "Quickly create campaigns that resonate with your target audience and drive engagement.",
    icon: "/icons/cube.svg",
  },
  {
    title: "Build Partnerships",
    description:
      "Collaborate with multiple sport ambassadors to extend your brand’s presence and influence across diverse fan bases.",
    icon: "/icons/cube.svg",
  },
  {
    title: "Ambassadors Engage Fans",
    description:
      "Leverage the authentic connection between sports ambassadors and their fans to boost loyalty and excitement around your brand.",
    icon: "/icons/cube.svg",
  },
  {
    title: "Track Performance",
    description:
      "Monitor your campaigns in real-time to optimize performance and maximize ROI.",
    icon: "/icons/cube.svg",
  },
];

const measureData = {
  img: "/assets/images/goalKeeper.png",
  subTitle: "Insights",
  title: "Measure What Matters. Improve What Works.",
  content: `Get real-time insights into your campaigns — track engagement, conversions, and audience behavior to make smarter marketing decisions.`,
  button1: "View Analytics",
  button2: "Features",
};

const faqData = [
  {
    title: "How does it work?",
    content:
      "Our platform connects brands with athletes and teams to create affiliate marketing campaigns. Brands publish promotions, which athletes can share with their fans. This creates a win-win situation for everyone involved.",
  },
  {
    title: "Who can join?",
    content:
      "Any brand looking to promote their products or services can join our platform. Additionally, athletes and teams can sign up to promote these campaigns. It’s an inclusive space for all sports enthusiasts.",
  },
  {
    title: "What are the fees?",
    content:
      "There are no upfront fees – you only pay based on the results achieved. Brands set the commission structure for their campaigns, and our platform applies a fixed commission rate based on your chosen fee structure. For more information on pricing, please contact our support team.",
  },
  {
    title: "How to promote campaigns?",
    content:
      "Athletes can promote campaigns through their social media channels and on our platform. We provide tools and resources to help them effectively share promotions. Engaging content leads to better results.",
  },
  {
    title: "Can I track results?",
    content:
      "Yes, our platform offers analytics tools to track the performance of your campaigns. Brands can see engagement metrics and conversion rates. This data helps optimize future promotions for better success.",
  },
];

const SmartCampaignData = [
  {
    title: "Track Campaign Performance in Real Time",
    description:
      "Set up your campaigns in minutes and see what’s working — instantly.",
    linkLabel: "Learn More",
  },
  {
    title: "Maximize Your Brand's Visibility Across a Diverse Audience",
    description:
      "Use our platform to launch scalable promotions and build authentic engagement.",
    linkLabel: "Sign Up",
  },
  {
    title: "Boost Your Brand with Athlete Partnerships",
    description:
      "Reach new audiences through targeted, ambassador-led campaigns.",
    linkLabel: "Get Started",
  },
];

const singleReviewData = {
  content: `"Working with sbonssy has transformed our marketing strategy, allowing us to reach our target audience like never before."`,
  author: "Alex Johnson",
  position: "Marketing Director, XYZ Corp",
  authorImg: "/assets/images/Avatar.png",
  logo: "/assets/logo/Logo.png",
};
const ctaData = {
  img: "/assets/images/runningGuy.jpeg",
  title: "Join Our Community of Champions",
  para: "Sign up today to amplify your brand and connect with passionate fans like never before!",
  route1: "#",
  btn1: "Learn More",
  route2: "#",
  btn2: "Sign Up",
  imposeBtnClass: 'primaryBtn'
};
