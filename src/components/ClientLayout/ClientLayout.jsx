"use client";

import React from "react";
import Header from "../Common/Header/Header";
import Footer from "../Common/Footer/Footer";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const showHeaderFooter =
    !pathname.includes("/authentication") && !pathname.includes("/signup");

  const showFooter =
    !pathname.includes("/authentication") &&
    !pathname.includes("/signup") &&
    !pathname.includes("/onboarding/brand") &&
    !pathname.includes("/onboarding/sports-ambassador");

  return (
    <>
      {showHeaderFooter && <Header />}
      {children}
      {showFooter && <Footer />}
      {!showFooter && (
        <div
          className={`py-4 text-center mt-6  ${pathname.includes("/authentication")
            ? "lg:fixed bottom-0 w-full"
            : "lg:mt-8 fixed bottom-0 left-0 right-0 m-auto text-center"
            }`}
        >
          © {new Date().getFullYear()} Sbonssy
        </div>
      )}
    </>
  );
}
