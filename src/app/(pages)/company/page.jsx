import CTASection from "@/components/Common/CTASection/CTASection";
import TripleTestimonialSection from "@/components/Common/TripleTestimonialSection/TripleTestimonialSection";
import ContentSection from "@/components/PagesComponents/CompanyPage/ContentSection";
import GetInTouchForm from "@/components/PagesComponents/CompanyPage/GetInTouchForm";
import OurTeamCarousel from "@/components/PagesComponents/CompanyPage/OurTeamCarousel";
import StayInTouchSection from "@/components/PagesComponents/CompanyPage/StayInTouchSection";
import TopBrandMarqueSection from "@/components/PagesComponents/CompanyPage/TopBrandMarqueSection";
import React from "react";

export default function page() {
  return (
    <>
      <ContentSection />
      <OurTeamCarousel />
      <TopBrandMarqueSection />
      <TripleTestimonialSection data={testimonials} bgColor="bgGraySmoke" />
      <CTASection data={ctaData} centerAlign="true" />
      <StayInTouchSection />
      <GetInTouchForm />
    </>
  );
}

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "CEO, Sports Inc.",
    image: "/assets/images/Avatar.png", // replace with actual path
    text: "Sbonssy has revolutionized athlete-brand partnerships!",
    rating: 5,
    companyLogo: "/assets/logo/Logo.png", // replace with actual path
  },
  {
    id: 2,
    name: "Jamie Lee",
    role: "Marketing Director, Brand Co.",
    image: "/assets/images/Avatar.png",
    text: "A game-changer for sports marketing strategies!",
    rating: 5,
    companyLogo: "/assets/logo/Logo.png",
  },
  {
    id: 3,
    name: "Chris Smith",
    role: "Founder, Fan Hub",
    image: "/assets/images/Avatar.png",
    text: "The best way to engage with our audience!",
    rating: 5,
    companyLogo: "/assets/logo/Logo.png",
  },
];

const ctaData = {
  title: "Join Our Community of Champions",
  para: "Sign up today to amplify your brand and connect with passionate fans like never before!",
  img: "/assets/images/runningGuy.jpeg",
  route1: "#",
  route2: "#",
  btn1: "Sign Up",
  btn2: "Learn More",
};
