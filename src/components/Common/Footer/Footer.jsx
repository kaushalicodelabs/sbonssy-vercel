"use client";

import React from "react";
import DefaultLayout from "../DefaultLayout.jsx/DefaultLayout";
import Link from "next/link";
import IconsLibrary from "@/util/IconsLibrary";
import Image from "next/image";
import mobileLogo from "../../../../public/assets/logo/logoMobile.png";
import desktopLogo from "../../../../public/assets/logo/logoDesktop.png";
import { useRouter } from "next/navigation";
import MailchimpSubscribe from "@/components/Mailchimp";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const router = useRouter();

  const footerData = [
    {
      title: t("quickLinks"),
      links: [
        { title: t("marketplace"), route: "/marketplace" },
        { title: t("contactUs"), route: "/contact" },
        { title: t("company"), route: "/company" },
      ],
    },
    {
      title: t("resources"),
      links: [
        { title: t("news"), route: "/news" },
        { title: t("blog"), route: "/blog" },
        { title: t("faq"), route: "/faq" },
      ],
    },
    {
      title: t("features"),
      links: [
        { title: t("forFans"), route: "/fans" },
        { title: t("forSportsAmbassadors"), route: "/athletes-teams" },
        { title: t("forBrands"), route: "/brands" },
      ],
    },
  ];

  return (
    <footer className="bg-reddishPurple">
      <DefaultLayout styling="py-12 md:py-20 text-left">
        <div className="text-white md:mb-20 pb-[48px] md:pb-[44px]">
          <div className="flex flex-col md:flex-row md:flex-wrap justify-between md:gap-8 xl:gap-0">
            <div className="md:w-[60%] flex flex-col md:flex-row md:gap-10">
              <div
                className="lg:min-w-[126px]"
                onClick={() => router.push("/")}
              >
                <Image
                  width={70}
                  height={65}
                  src={mobileLogo}
                  className="hidden md:block"
                  alt="Logo"
                />
                <Image
                  width={126}
                  height={36}
                  src={desktopLogo}
                  className="block md:hidden"
                  alt="Logo"
                />
              </div>
              {footerData.map((section, index) => (
                <div key={index} className="mt-10 md:mt-0 md:min-w-[166px]">
                  <h4 className="font-semibold mb-3">{section.title}</h4>
                  <ul className="">
                    {section.links.map((link, idx) => (
                      <li
                        key={idx}
                        className="py-2 text-sm cursor-pointer"
                        onClick={() => router.push(link.route)}
                      >
                        {link.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:w-fit md:max-w-[400px] lg:max-w-[460px] xl:max-w-[400px] mt-2 md:mt-0">
              <MailchimpSubscribe />
            </div>
          </div>
        </div>
        <div className="border-t border-white pt-6 flex flex-col-reverse justify-between md:flex-row gap-8">
          <div className="flex flex-col md:flex-row gap-4">
            <p className="text-white font-[400] text-sm leading-[150%] tracking-[0]">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                className="text-white font-[400] text-sm leading-[150%] tracking-[0]"
                href="/privacy-policy"
              >
                {t("privacyPolicy")}
              </Link>
              <Link
                className="text-white font-[400] text-sm leading-[150%] tracking-[0]"
                href="/terms"
              >
                {t("termsOfService")}
              </Link>
              <Link
                className="text-white font-[400] text-sm leading-[150%] tracking-[0]"
                href="/cookies"
              >
                {t("cookieSettings")}
              </Link>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <IconsLibrary name="facebook" />
            <IconsLibrary name="instagram" />
            <IconsLibrary name="linkdin" />
          </div>
        </div>
      </DefaultLayout>
    </footer>
  );
}
