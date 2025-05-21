"use client";

import DefaultLayout from "@/components/Common/DefaultLayout.jsx/DefaultLayout";
import UserLogin from "@/components/LoginPage/LoginPage";
import { useState } from "react";
import Image from "next/image";
import RegisterPage from "@/components/RegisterPage/RegisterPage";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [activeTab, setactiveTab] = useState("singUpTab");
  const router = useRouter();

  const tabActiveHandle = (value) => {
    setactiveTab(value);
  };

  return (
    <div>
      {/* logo header */}
      <DefaultLayout>
        <div className="sticky top-0 start-0  bg-white py-4">
          <div className="cursor-pointer">
            <Image
              alt="Logo"
              src="/assets/logo/logoMobile.png"
              width={54}
              height={54}
              className="block lg:hidden"
            />

            <Image
              alt="Logo"
              src="/assets/logo/logoDesktop.png"
              width={152}
              height={43}
              className="hidden lg:block invert-100"
            />
          </div>
        </div>
      </DefaultLayout>

      <div className="authenticationScreenHeight">
        <div className="lg:w-[480px] mx-auto px-5 lg:px-0">
          {/* tab menu */}
          <div className="w-full  flex items-center">
            <button
              className={`${
                activeTab === "singUpTab"
                  ? "border-[#F26915]"
                  : "border-transparent"
              } w-full border-b  transition-all duration-400 flex-1 text-center h-[49px]`}
              onClick={() => tabActiveHandle("singUpTab")}
            >
              Sign Up
            </button>
            <button
              className={`${
                activeTab === "loginTab"
                  ? "border-[#F26915]"
                  : "border-transparent"
              } w-full border-b transition-all duration-400 flex-1 text-center h-[49px]`}
              onClick={() => tabActiveHandle("loginTab")}
            >
              Login
            </button>
          </div>

          {/* tab end here */}

          <div
            className={`w-full mt-8 lg:mt-12 formInputs ${
              activeTab === "loginTab" ? "block" : "hidden"
            }`}
          >
            <UserLogin />
          </div>

          <div
            className={`w-full mt-8 lg:mt-12 formInputs  ${
              activeTab === "singUpTab" ? "block" : "hidden"
            }`}
          >
            <RegisterPage />
          </div>
        </div>
      </div>
    </div>
  );
}
