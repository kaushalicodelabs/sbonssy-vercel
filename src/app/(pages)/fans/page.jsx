import HeroSection from "@/components/Common/HeroSection/HeroSection";
import React from "react";
import fansHeroImg from "@/../public/assets/heroImages/fansHeroImg.jpeg";
import ImgNinfo from "@/components/Common/ImgNinfo/ImgNinfo";
import inairbike from "@/../public/assets/images/inairbike.png";
import CardSection from "@/components/PagesComponents/FansPage/CardSection/CardSection";
import Gallary from "@/components/PagesComponents/FansPage/Gallary/Gallary";
import CheckBoxSection from "@/components/Common/CheckBoxSection/CheckBoxSection";
import SingleReview from "@/components/Common/SingleReview/SingleReview";
import CTASection from "@/components/Common/CTASection/CTASection";
import { useTranslations } from "next-intl";

export default function page() {
  const t = useTranslations("Fans");

  const fansHeroData = {
    img: fansHeroImg,
    title: t("fanTitle"),
    content: t("fanDesc"),
    button1: t("fanBtn1"),
    button2: t("fanBtn2"),
    button1Route: "#",
    button2Route: "#",
    subHeading: t("fanSubHeading"),
    height: "596px",
    bgPosition: "50% 0",
  };

  const inAirBikeData = {
    titleFontSize: "change",
    title: t("airTitle"),
    description: t("airDesc"),
    features: [
      {
        number: "50",
        text: t("airFeaturesT1"),
      },
      {
        number: "200",
        text: t("airFeaturesT2"),
      },
    ],
    image: inairbike,
  };

  const checkBoxData = [
    {
      title: t("checkboxTitle1"),
      description: t("checkboxDesc1"),
      icon: "/icons/cube.svg",
    },
    {
      title: t("checkboxTitle2"),
      description: t("checkboxDesc2"),
      icon: "/icons/cube.svg",
    },
    {
      title: t("checkboxTitle3"),
      description: t("checkboxDesc3"),
      icon: "/icons/cube.svg",
    },
    {
      title: t("checkboxTitle4"),
      description: t("checkboxDesc4"),
      icon: "/icons/cube.svg",
    },
    {
      title: t("checkboxTitle5"),
      description: t("checkboxDesc5"),
      icon: "/icons/cube.svg",
    },
  ];
  const checkHeaderData = {
    checkboxHeading: t("checkboxHeading"),
    checkboxSubHeading: t("checkboxSubHeading"),
    checkboxBtn1: t("checkboxBtn1"),
    checkboxBtn2: t("checkboxBtn2"),
  };

  const fanDealData = {
    titleFontSize: "change",
    title: t("dealTitle"),
    description: t("dealDesc"),
    features: [
      {
        title: t("dealFeaturedL1"),
        text: t("dealFeaturedT1"),
        button: t("dealFeaturedBtn1"),
        buttonRoute: "#",
      },
      {
        title: t("dealFeaturedL2"),
        text: t("dealFeaturedT2"),
        button: t("dealFeaturedBtn2"),
        buttonRoute: "#",
      },
    ],
    image: "/assets/images/gallary/tenishGuy.png",
  };

  const singleReviewData = {
    content: t("reviewContent"),
    author: t("reviewAuthor"),
    position: t("reviewPosition"),
    authorImg: "/assets/images/Avatar.png",
    logo: "/assets/logo/Logo.png",
  };

  const ctaContent = {
    img: "/assets/images/runningGuy.jpeg",
    title: t("ctaTitle"),
    btn1: t("ctaBtn1"),
    route1: "#",
    btn2: t("ctaBtn2"),
    route2: "#",
  };

  const cardData = {
    cardTitle1: t("cardTitle1"),
    cardLabel1: t("cardLabel1"),
    cardPBtn1: t("cardPBtn1"),
    cardSBtn1: t("cardSBtn1"),
    cardDesc1: t("cardDesc1"),
    cardTitle2: t("cardTitle2"),
    cardLabel2: t("cardLabel2"),
    cardPBtn2: t("cardPBtn2"),
    cardSBtn2: t("cardSBtn2"),
    cardDesc2: t("cardDesc2"),
  };
  const gallaryData = {
    galleryHeading: t("galleryHeading"),
    galleryDesc: t("galleryDesc"),
  };
  return (
    <>
      <HeroSection data={fansHeroData} centerContent="true" />
      <ImgNinfo
        data={inAirBikeData}
        changeBG="white"
        flexDirections="flex-col-reverse lg:flex-row-reverse"
      />
      <CardSection data={cardData} />
      <Gallary data={gallaryData} />
      <CheckBoxSection data={checkBoxData} sideData={checkHeaderData} />
      <ImgNinfo
        changeBG="orange"
        data={fanDealData}
        flexDirections="flex-col-reverse lg:flex-row-reverse"
      />
      <SingleReview data={singleReviewData} />
      <CTASection data={ctaContent} centerAlign="false" />
    </>
  );
}
