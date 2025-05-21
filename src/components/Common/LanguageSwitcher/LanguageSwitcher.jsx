"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState, useRef } from "react";

export default function LanguageSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale();
  const [locale, setLocale] = useState(currentLocale);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") || "en";
    if (savedLocale !== locale) {
      setLocale(savedLocale);
      document.cookie = `locale=${savedLocale}; path=/`;
      router.refresh();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const switchLocale = (newLocale) => {
    localStorage.setItem("locale", newLocale);
    document.cookie = `locale=${newLocale}; path=/`;
    setLocale(newLocale);
    setIsOpen(false);
    router.refresh();
  };

  const languages =
    locale === "fi"
      ? [
          { code: "en", name: "Englanti" },
          { code: "fi", name: "Suomi" },
        ]
      : [
          { code: "en", name: "English" },
          { code: "fi", name: "Finnish" },
        ];

  const currentLanguage =
    languages.find((lang) => lang.code === locale)?.name || "English";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-between px-4 py-2 text-white text-base rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentLanguage}
        <svg
          className={`w-5 h-5 ml-2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`block w-full px-4 py-2 text-base text-left transition-colors duration-150 ${
                  locale === language.code
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => switchLocale(language.code)}
                role="menuitem"
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
