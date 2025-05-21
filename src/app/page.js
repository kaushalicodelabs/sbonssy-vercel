import HeroImg from "../../public/assets/heroImages/landingImg.png";
import BasketballPlayer from "../../public/assets/images/basketballPlayer.png";
import bgImage from "../../public/assets/images/runningGuy.jpeg";
import SportAmbassadorsCarousel from "@/components/PagesComponents/LandingPage/SportAmbassadorsCarousel/SportAmbassadorsCarousel";
import FindExclusiveOfferCard from "@/components/PagesComponents/LandingPage/FindExclusiveOfferCard/FindExclusiveOfferCard";
import ShopSmarter from "@/components/PagesComponents/LandingPage/ShopSmarter/ShopSmarter";
import TextContainer from "@/components/Common/TextContainer/TextContainer";
import SupportSports from "@/components/PagesComponents/LandingPage/SupportSports/SupportSports";
import ImageNcontent from "@/components/Common/ImageNcontent/ImageNcontent";
import ReviewSection from "@/components/PagesComponents/LandingPage/ReviewSection/ReviewSection";
import CTASection from "@/components/Common/CTASection/CTASection";
import LandingHeroSection from "@/components/PagesComponents/LandingPage/LandingHeroSection/LandingHeroSection";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  const HeroTile = {
    title: t("title"),
    desc: t("description"),
    btn1: t("ctaBtn1"),
    btn2: t("ctaBtn2"),
  };

  const TextContainerContent = {
    title: t("heroTitle"),
    para: t("heroPara"),
  };
  const Carousel = {
    heading: t("carouselHeading"),
  };
  const ImageNcontentContent = {
    img: BasketballPlayer,
    title: t("imageNcontentTitle"),
    content: t("imageNcontentPara"),
  };

  const ctaContent = {
    img: bgImage,
    title: t("ctaTitle"),
    btn1: t("ctaBtn1"),
    route1: "#",
    btn2: t("ctaBtn2"),
    route2: "#",
  };
  const card = {
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
  const smart = {
    heading: t("headingSmarter"),
    subHeading: t("subHeadingSmarter"),
  };
  const supportTab = {
    headingSupport: t("headingSupport"),
    subHeadingSupport1: t("subHeadingSupport1"),
    subHeadingSupport2: t("subHeadingSupport2"),
    colHeadSupport: t("colHeadSupport"),
    colSubHeadSupport: t("colSubHeadSupport"),
    colDescSupport: t("colDescSupport"),
    workSupport: t("workSupport"),
    exploreBtn: t("exploreBtn"),
    colHeadBrand: t("colHeadBrand"),
    colSubHeadBrand: t("colSubHeadBrand"),
    learnMoreBtn: t("learnMoreBtn"),
    colHeadSport: t("colHeadSport"),
    colSubHeadSport: t("colSubHeadSport"),
    colFeatures: t("colFeatures"),
    colFeaturesHeading: t("colFeaturesHeading"),
    colFeaturesSubHeading: t("colFeaturesSubHeading"),
    colResources: t("colResources"),
    colResourcesHeading: t("colResourcesHeading"),
    colResourcesSubHeading: t("colResourcesSubHeading"),
    readMoreBtn: t("readMoreBtn"),
  };

  const reviews = {
    testmonialName1: t("testmonialName1"),
    testmonialQuote1: t("testmonialQuote1"),
    testmonialAuthor1: t("testmonialAuthor1"),
    testmonialposition1: t("testmonialposition1"),
    testmonialName2: t("testmonialName2"),
    testmonialQuote2: t("testmonialQuote2"),
    testmonialAuthor2: t("testmonialAuthor2"),
    testmonialposition2: t("testmonialposition2"),
    testmonialName3: t("testmonialName3"),
    testmonialQuote3: t("testmonialQuote3"),
    testmonialAuthor3: t("testmonialAuthor3"),
    testmonialposition3: t("testmonialposition3"),
  };
  return (
    <>
      <LandingHeroSection data={HeroTile} bgImg={HeroImg} />
      <SportAmbassadorsCarousel data={Carousel.heading} />
      <FindExclusiveOfferCard data={card} />
      <ShopSmarter data={smart} />
      <TextContainer
        data={TextContainerContent}
        styling="py-[64px] lg:py-[112px] "
      />
      <SupportSports data={supportTab} />
      <ImageNcontent
        data={ImageNcontentContent}
        changeBG="reddishPurple"
        textColor="text-white"
      />
      <ReviewSection data={reviews} />
      <CTASection data={ctaContent} centerAlign="true" />
    </>
  );
}
