"use client";

import React, { useState } from "react";
import Image from "next/image";
import MobileLogo from "../../../../public/assets/logo/logoMobile.png";
import DesktopLogo from "../../../../public/assets/logo/logoDesktop.png";
import IconsLibrary from "@/util/IconsLibrary";
import DefaultLayout from "../DefaultLayout.jsx/DefaultLayout";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

export default function Header() {
  const t = useTranslations("Header");
  const [showMenu, setShowMenu] = useState(true);
  const [dropdown, setDropdown] = useState(0);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const openMenu = () => {
    setShowMenu(!showMenu);
  };

  const openDropdown = (value) => {
    setDropdown(value);
  };

  const handleLogout = async () => {
    try {
      await logout();

      router.push("/authentication");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  const pathname = usePathname();

  const hideContent =
    pathname !== "/onboarding/brand" &&
    pathname !== "/onboarding/sports-ambassador";

  const Menu = [
    {
      id: 1,
      title: t("marketplace"),
      routes: "/marketplace",
    },
    {
      id: 2,
      child: "true",
      title: t("features"),
      submenu: [
        { id: 21, title: t("fans"), routes: "/fans" },
        { id: 22, title: t("sportsAmbassador"), routes: "/athletes-teams" },
        { id: 23, title: t("brand"), routes: "/brands" },
      ],
      routes: "/features",
    },
    {
      id: 3,
      child: "true",
      title: t("resources"),
      submenu: [
        { id: 31, title: t("docs"), routes: "/docs" },
        { id: 32, title: t("blog"), routes: "/blog" },
        { id: 33, title: t("tutorials"), routes: "/tutorials" },
      ],
      routes: "/resources",
    },
  ];

  return (
    <React.Fragment>
      <nav className="text-6xl w-full bg-reddishPurple text-white py-1.5 min-[1150px]:py-[14.5px] left-0 z-30 sticky top-0 border-b border-black">
        <DefaultLayout>
          <div className="flex justify-between w-full min-[1150px]:items-center">
            <div className="cursor-pointer" onClick={() => router.push("/")}>
              <Image
                alt="Logo"
                src={MobileLogo}
                width={54}
                height={54}
                className="block min-[1150px]:hidden"
              />
              <Image
                alt="Logo"
                src={DesktopLogo}
                width={152}
                height={43}
                className="hidden min-[1150px]:block"
              />
            </div>
            <div className="flex items-center justify-between gap-8">
              {hideContent ? (
                <div
                  className={`absolute top-0 p-4 right-0 w-full transition-all duration-300 h-screen bg-black/50 backdrop-blur-xl text-white ${
                    showMenu ? "translate-x-full hidden" : "block translate-x-0"
                  } | min-[1150px]:relative min-[1150px]:p-0 min-[1150px]:w-fit min-[1150px]:h-fit min-[1150px]:bg-transparent min-[1150px]:backdrop-blur-none min-[1150px]:translate-x-0 z-50 min-[1150px]:block`}
                >
                  <h6 className="text-2xl text-white mb-6 min-[1150px]:hidden">
                    Menu
                  </h6>
                  <div
                    className="w-8 h-8 absolute cursor-pointer right-4 top-4 min-[1150px]:hidden"
                    onClick={() => openMenu()}
                  >
                    <IconsLibrary name="MenuCloseToogle" />
                  </div>
                  <ul className="flex flex-col gap-0 min-[1150px]:gap-8 min-[1150px]:flex-row">
                    {Menu.map((i, index) => (
                      <React.Fragment key={index}>
                        <li className="group min-[1150px]:relative border-b py-4 border-white/20 min-[1150px]:border-0">
                          <div
                            className="cursor-pointer flex gap-1 justify-between items-center min-[1150px]:justify-start"
                            onClick={() => i.routes && router.push(i.routes)}
                          >
                            {i.title}
                            {i.child ? (
                              <div onClick={() => openDropdown(i.id)}>
                                <IconsLibrary name="dropdown" />
                              </div>
                            ) : null}
                          </div>
                          {i.child === "true" ? (
                            <ul
                              className={`overflow-hidden transition-all duration-300 min-[1150px]:max-h-60 ${
                                dropdown === i.id ? "max-h-60" : "max-h-[0]"
                              } | min-[1150px]:p-4 min-[1150px]:bg-black/30 min-[1150px]:backdrop.servicesssblur-xl min-[1150px]:rounded-2xl min-[1150px]:shadow-orange-100 opacity-0 duration-500 min-[1150px]:min-w-[190px] -translate-y-5 min-[1150px]:absolute group-hover:translate-y-0 group-hover:opacity-100 group-hover:h-fit h-0`}
                            >
                              {i.submenu?.map((subMenu, index) => (
                                <li
                                  key={index}
                                  className="cursor-pointer py-2"
                                  onClick={() => router.push(subMenu.routes)}
                                >
                                  {subMenu.title}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </li>
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="flex gap-1.5 justify-end items-center min-[1150px]:flex-row-reverse min-[1150px]:gap-4">
                {user && hideContent ? (
                  <button
                    className="primaryBtn py-1 min-[1150px]:py-[10px] mr-[27px] min-[1150px]:ml-4 bg-red-600 hover:bg-red-700"
                    onClick={handleLogout}
                  >
                    {t("logout")}
                  </button>
                ) : (
                  <button
                    className="primaryBtn py-1 min-[1150px]:py-[10px] mr-[27px] min-[1150px]:ml-4"
                    onClick={() => router.push("/authentication")}
                  >
                    {t("signUp")}
                  </button>
                )}
                <LanguageSwitcher />
                <div className="w-12 h-12 flex items-center justify-center relative min-[1150px]:w-fit min-[1150px]:h-fit ">
                  <input
                    type="text"
                    className="defaultInput hidden rounded-fullpl-12 min-[1150px]:block placeholder:text-white pl-12"
                    placeholder={t("searchPlaceholder")}
                  />
                  <IconsLibrary
                    name="search"
                    styling="min-[1150px]:absolute min-[1150px]:left-[14px] min-[1150px]:top-[9px]"
                  />
                </div>
                <div
                  className="cursor-pointer flex items-center justify-center min-[1150px]:hidden"
                  onClick={() => openMenu()}
                >
                  <IconsLibrary name="MenuToggle" />
                </div>
              </div>
            </div>
          </div>
        </DefaultLayout>
      </nav>
    </React.Fragment>
  );
}
