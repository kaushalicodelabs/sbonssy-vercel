import HeroSection from "@/components/Common/HeroSection/HeroSection";
import React from "react";
import featuerHeroImg from "@/../public/assets/heroImages/featuerHeroImg.jpeg";
import cyclistVerticle from "@/../public/assets/images/cyclistVertical.jpeg";
import TextContainer from "@/components/Common/TextContainer/TextContainer";
import ImageNcontent from "@/components/Common/ImageNcontent/ImageNcontent";
import ImgNinfo from "@/components/Common/ImgNinfo/ImgNinfo";
import swimingGuys from "@/../public/assets/images/swimingGuys.png";
import driftCar from "@/../public/assets/images/driftCar.png";
import { useTranslations } from "next-intl";

export default function page() {
  const t = useTranslations("Features");
  const featureHeroSection = {
    img: featuerHeroImg,
    title: t("title"),
    content: t("content"),
    styling: "",
    sectionAligment: "center",
    height: "500px",
  };

  const textContentData = {
    title: t("textTitle"),
    para: t("textDesc"),
  };

  const imgNcontent = {
    title: t("imgTitle"),
    content: t("imgDesc"),
    img: cyclistVerticle,

    buttonTitle: t("imgBtn"),
    btnRoute: "#",
    smallHeading: t("imgSubHeading"),
  };

  const unlockNew = {
    title: t("newTitle"),
    subtitle: t("newSubTitle"),
    description: t("newDesc"),
    features: [
      {
        title: t("newFeaturesTitle1"),
        text: t("newFeaturesText1"),
      },
      {
        title: t("newFeaturesTitle2"),
        text: t("newFeaturesText2"),
      },
    ],
    buttons: [
      {
        label: t("newBtn1"),
        variant: "primary",
      },
      {
        label: t("newBtn2"),
        variant: "link",
      },
    ],
    image: swimingGuys,
  };

  const brandHero = {
    title: t("brandTitle"),
    subtitle: t("brandSubTitle"),
    description: t("brandDesc"),
    features: [
      {
        title: t("brandFeaturesL1"),
        text: t("brandFeaturesT1"),
      },
      {
        title: t("brandFeaturesL2"),
        text: t("brandFeaturesT2"),
      },
    ],
    buttons: [
      {
        label: t("brandBtnL1"),
        variant: "primary",
      },
      {
        label: t("brandBtnL2"),
        variant: "link",
      },
    ],
    image: driftCar,
  };
  return (
    <>
      <HeroSection data={featureHeroSection} />
      <TextContainer data={textContentData} contentAlliment="vertical" />
      <ImageNcontent
        data={imgNcontent}
        changeBG="orange"
        textColor="text-textColor"
      />
      <ImgNinfo
        data={unlockNew}
        changeBG="false"
        flexDirections="flex-col-reverse lg:flex-row"
      />

      <ImgNinfo
        data={brandHero}
        changeBG="neonGreen"
        flexDirections="flex-col-reverse lg:flex-row-reverse"
      />
    </>
  );
}
