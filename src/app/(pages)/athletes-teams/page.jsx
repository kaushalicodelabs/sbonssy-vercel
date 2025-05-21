import CheckBoxSection from "@/components/Common/CheckBoxSection/CheckBoxSection";
import CTASection from "@/components/Common/CTASection/CTASection";
import HeroSection from "@/components/Common/HeroSection/HeroSection";
import ImageNcontent from "@/components/Common/ImageNcontent/ImageNcontent";
import AccordionSection from "@/components/PagesComponents/AthletesNTeamsPage/AccordionSection/AccordionSection";
import CarouselSection from "@/components/PagesComponents/AthletesNTeamsPage/CarouselSection/CarouselSection";
import SmallCardSection from "@/components/PagesComponents/AthletesNTeamsPage/SmallCardSection/SmallCardSection";
import TestmonialSection from "@/components/PagesComponents/AthletesNTeamsPage/TestmonialSection/TestmonialSection";

export default function page() {
  return (
    <>
      <HeroSection data={AthletesNTeamsHeroData} />
      <SmallCardSection />
      <CarouselSection />
      <CheckBoxSection data={checkBoxData} />
      <ImageNcontent
        data={imgNcontentData}
        changeBG="neonGreen"
        textColor="text-textColor"
      />
      <AccordionSection />
      <TestmonialSection data={testimonials} />
      <CTASection data={ctaData} bgName='' centerAlign="true" />
    </>
  );
}

const AthletesNTeamsHeroData = {
  img: "/assets/heroImages/Athletes&TeamsHeroImg.png",
  title: "Grow Your Brand. Connect with Fans. Earn More.",
  content:
    "Unlock new ways to grow your audience, activate your fanbase, and monetize your brand — all in one platform built for sport ambassadors.",
  styling: "",
  sectionAligment: "center",
  height: "369px",
  bgPosition: "50% 28%",
  maxWidthContent: "768px",
};

const checkBoxData = [
  {
    title: "Sign Up & Create Profile",
    description:
      "Follow our step-by-step onboarding and create a stunning profile.",
    icon: "/icons/cube.svg",
  },
  {
    title: "Discover Promotions",
    description:
      "Explore exclusive deals and offers tailored for you by your favorite brands. Find the necessary assets and start promoting to earn.",
    icon: "/icons/cube.svg",
  },
  {
    title: "Engage Fans",
    description:
      "Leverage your influence by connecting directly with your fans through exciting campaigns.",
    icon: "/icons/cube.svg",
  },
  {
    title: "Boost Revenue",
    description:
      "Increase your earnings by promoting campaigns that resonate with your audience’s interests.",
    icon: "/icons/cube.svg",
  },
  {
    title: "Track Success",
    description:
      "Monitor your performance and optimize your strategies for maximum impact and profitability.",
    icon: "/icons/cube.svg",
  },
];

const imgNcontentData = {
  title: "Partner with Brands That Share Your Values",
  content:
    "As a sport ambassador, you can build partnerships with brands that reflect your values and resonate with your audience. Create campaigns that grow your brand and deliver real value to your fans.",
  img: "/assets/images/basketballPlayer.png",
};

const ctaData = {
  img: "/assets/images/runningGuy.jpeg",
  title: "Join Our Community of Champions",
  para: `Sign up today to to grow your audience, activate your fanbase, and monetize your brand — all in one platform built for sport ambassadors.`,
  btn1: "Learn More",
  route1: "#",
  btn2: "Sign Up",
  route2: "#",
};

const testimonials = [
  {
    quote:
      "This platform has transformed how I connect with my favorite athletes and discover amazing promotions! I never miss out on opportunities to support them and save on gear.",
    name: "Alex Johnson",
    position: "Fan, Sports Enthusiast",
    image: "/assets/images/Avatar.png",
    logo: "/assets/logo/Logo.png",
  },
  {
    quote:
      "This platform has transformed how I connect with my favorite athletes and discover amazing promotions! I never miss out on opportunities to support them and save on gear.",
    name: "Jamie Lee",
    position: "Community Member",
    image: "/assets/images/Avatar.png",
    logo: "/assets/logo/Logo.png",
  },
];
