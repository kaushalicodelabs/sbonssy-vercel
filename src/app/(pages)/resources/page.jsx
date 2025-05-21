import HeroSection from "@/components/Common/HeroSection/HeroSection";
import InsightsComponent from "@/components/Common/InsightsComponent/InsightsComponent";
import FAQSection from "@/components/Common/FAQSection/FAQSection";
import React from "react";
import CTAwithFormSection from "@/components/Common/CTAwithFormSection/CTAwithFormSection";

export default function pages() {
  return (
    <>
      <HeroSection data={heroData} centerContent="false" />
      <InsightsComponent
        bgColor="reddishPurple"
        headingContent={headingContentData}
        cardData={blogData}
      />

      <FAQSection
        content="Find answers to your questions about our platform and how it works."
        data={faqData}
      />

      <InsightsComponent
        bgColor="neonGreen"
        headingContent={companyNewHeadingData}
        cardData={NewsData}
      />
      <CTAwithFormSection data={newsletterData} />
    </>
  );
}

const heroData = {
  title: "Explore Our Resources",
  content:
    "Discover valuable insights, FAQs, and updates to enhance your experience with our platform.",
  img: "/assets/heroImages/resourceheroImg.png",
  height: "369px",
  maxWidthContent: "768px",
  bgPosition: "50% 20%",
};

const headingContentData = {
  subTitle: "Blog",
  title: "Latest Insights and Tips",
  para: "Explore our recent blog posts below.",
  textColor: "white",
  bottomBtn: "text-white primaryBtnPlain  ",
};

const blogData = [
  {
    id: 1,
    tag: "Sports",
    title: "Maximize Your Game Day Experience",
    description: "Discover how to enhance your game day with these tips.",
    author: "John Doe",
    date: "11 Jan 2022",
    readTime: "5 min read",
    image: "/assets/images/defaultimg.png",
    avatar: "/assets/images/Avatar.png",
  },
  {
    id: 2,
    tag: "Marketing",
    title: "Building Stronger Brand Partnerships",
    description:
      "Learn how to create impactful partnerships in sports marketing.",
    author: "Jane Smith",
    date: "10 Feb 2022",
    readTime: "7 min read",
    image: "/assets/images/defaultimg.png",
    avatar: "/assets/images/Avatar.png",
  },
  {
    id: 3,
    tag: "Insights",
    title: "The Future of Sports Sponsorship",
    description: "Explore emerging trends in sports sponsorship and marketing.",
    author: "Alex Johnson",
    date: "15 Mar 2022",
    readTime: "6 min read",
    image: "/assets/images/defaultimg.png",
    avatar: "/assets/images/Avatar.png",
  },
];

const companyNewHeadingData = {
  subTitle: "News",
  title: "Company news and press releases",
  para: "Read our official statements and latest news releases.",
  textColor: "textColor",
  bottomBtn: "text-white primaryBtnPlainPurple",
};

const NewsData = [
  {
    id: 1,
    tag: "Sports",
    title: "The Future of Athlete Marketing",
    description:
      "Discover how athlete marketing is evolving in today’s digital landscape.",
    author: "John Doe",
    date: "11 Jan 2022",
    readTime: "5 min read",
    image: "/assets/images/defaultimg.png",
    avatar: "/assets/images/Avatar.png",
  },
  {
    id: 2,
    tag: "Marketing",
    title: "Building Stronger Brand-Athlete Relationships",
    description: "Learn how to create impactful partnerships with athletes.",
    author: "Jane Smith",
    date: "15 Feb 2022",
    readTime: "7 min read",
    image: "/assets/images/defaultimg.png",
    avatar: "/assets/images/Avatar.png",
  },
  {
    id: 3,
    tag: "Insights",
    title: "Maximizing Your Sponsorship Potential",
    description:
      "Unlock the secrets to effective sponsorship strategies for athletes.",
    author: "Alex Brown",
    date: "20 Mar 2022",
    readTime: "6 min read",
    image: "/assets/images/defaultimg.png",
    avatar: "/assets/images/Avatar.png",
  },
];

const faqData = [
  {
    title: "What is sbonssy?",
    content:
      "sbonssy is a platform that connects fans with their favorite sports ambassadors through promotions. It allows brands to create affiliate marketing campaigns that ambassadors can promote. Fans can discover these promotions and support their favorites.",
  },
  {
    title: "How do I participate?",
    content:
      "To participate, simply access the marketplace on our platform. You can explore various promotions and support your chosen ambassadors. Follow the instructions provided to engage with campaigns.",
  },
  {
    title: "Are there any fees?",
    content:
      "There are no fees for fans to access promotions on sbonssy. Brands may have their own pricing structures for campaigns that sports ambassadors promote. Always check the details of each promotion for any specific terms.",
  },
  {
    title: "Can I suggest promotions?",
    content:
      "Yes, we welcome suggestions for promotions! If you have an idea, please reach out to our team. We love hearing from our community and exploring new opportunities.",
  },
  {
    title: "How do I contact?",
    content:
      "You can contact us through the 'Contact' section on our website. We aim to respond to all inquiries promptly. Your feedback and questions are important to us!",
  },
];

const newsletterData = {
  heading: "Stay Updated with Our Newsletter",
  description:
    "Sign up to receive the latest blog updates, promotions, and news from your favorite athletes.",
  placeholder: "Enter your email",
  buttonText: "Sign up",
  disclaimer:
    "By clicking Sign Up you’re confirming that you agree with our Terms and Conditions.",
  bgImage: "/assets/images/runningFoot.jpg",
};
