
import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";

import CTAwithFormSection from "@/components/Common/CTAwithFormSection/CTAwithFormSection";
import Image from "next/image";
import BlogCardWrapper from "@/components/PagesComponents/BlogPage/BlogCardWrapper/BlogCardWrapper";

export default function page() {
  return (
    <>
      <DefaultLayout styling="py-[64px] lg:py-[112px]">
        {/*  */}
        <div>
          <div className="lg:max-w-[768px] text-left mb-12 lg:mb-20">
            <span className="text-base font-bold  leading-[150%] block mb-2 lg:mb-4">
              Blog
            </span>
            <h3 className="leading-[120%] tracking-[-1%] font-[400] text-[32px] lg:text-[40px]">
              Explore Our Latest Insights
            </h3>

            <p className="text-base  tracking-[0%] leading-[150%] mt-5 lg:text-lg">
              Stay updated with our tips and the latest trends in sports
              marketing.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-0">
            {/* leftContainer */}
            <div className="overflow-hidden rounded-t-2xl lg:rounded-t-none lg:rounded-l-2xl ">
              <Image
                width={500}
                height={500}
                src="/assets/images/defaultimg.png"
                alt="blog image"
                className="w-full h-[221px] lg:h-[500px]"
              />
            </div>

            <div className="bg-reddishPurple overflow-hidden text-white rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl p-6 lg:p-12 flex flex-col justify-between items-start">
              <div className="">
                <span className="text-sm">Features</span>
                <h5 className="text-2xl">The Future of Sports Sponsorship</h5>
                <p className="text-base">
                  Discover how sponsorships are evolving in the digital age.
                </p>
              </div>

              <div className="flex items-center gap-4 mt-6 lg:mt-0">
                <Image
                  src="/assets/images/Avatar.png"
                  width={48}
                  height={48}
                  alt="avatar"
                  className=""
                />

                <div className="">
                  <span>John Doe</span>
                  <div className="flex items-center gap-1 text-sm">
                    <span>11 Jan 2022</span>
                    <span className="mx-2">•</span>
                    <span>5 min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>

      <BlogCardWrapper tabData={tabMenu} blogData={blogOrangeData} />
      <CTAwithFormSection data={newsletterData} />
    </>
  );
}

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

const tabMenu = [
  "View all",
  "Marketing Tips",
  "Sport Ambassadors",
  "Brand Strategies",
  "Success Stories",
];

const blogOrangeData = [
  {
    id: 1,
    tag: "Insights",
    title: "Maximizing Your Brand's Reach",
    description:
      "Learn how to effectively engage with your audience through sports marketing.",
    author: "Jane Smith",
    date: "12 Feb 2022",
    readTime: "6 min read",
    image: "/assets/images/defaultimg.png",
    avatar: "/assets/images/Avatar.png",
  },
  {
    id: 2,
    tag: "Trends",
    title: "Engaging Fans Through Digital Platforms",
    description: "Explore innovative ways to connect with fans online.",
    author: "Mike Johnson",
    date: "15 Mar 2022",
    readTime: "4 min read",
    image: "/assets/images/defaultimg.png",
    avatar: "/assets/images/Avatar.png",
  },
  {
    id: 3,
    tag: "Strategies",
    title: "Building Lasting Partnerships in Sports",
    description:
      "Learn how to foster strong relationships with athletes and brands.",
    author: "Emily Davis",
    date: "20 Apr 2022",
    readTime: "7 min read",
    image: "/assets/images/defaultimg.png",
    avatar: "/assets/images/Avatar.png",
  },
];
