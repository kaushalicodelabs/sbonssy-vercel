"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FiHome,
  FiStar,
  FiBarChart2,
  FiTrendingUp,
  FiPieChart,
  FiCalendar,
  FiUsers,
  FiUser,
  FiMail,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";

const Sidebar = () => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();
  const role = user?.onboardedDetails?.role;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 mt-4">
        <ul className="space-y-2">
          <li className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
            <div className="flex items-center space-x-3">
              <FiHome className="w-6 h-6 var(--textColor)" />
              <span className="text-base leading-6 var(--textColor) font-normal">Home</span>
            </div>
            <span className="border border-[var(--gray)] text-[var(--gray)] text-sm font-normal leading-6 rounded-full h-[21px] w-[33px] flex items-center justify-center">
              24
            </span>
          </li>
          <li className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
            <div className="flex items-center space-x-3">
              <FiStar className="w-6 h-6 var(--textColor)" />
              <span className="text-base leading-6 var(--textColor) font-normal">Saved</span>
            </div>
          </li>
          <li className="flex flex-col p-2 rounded">
            <div
              className="flex items-center justify-between hover:bg-gray-100 rounded p-2 cursor-pointer"
              onClick={() => setIsDashboardOpen(!isDashboardOpen)}
            >
              <div className="flex items-center space-x-3">
                <FiBarChart2 className="w-6 h-6 var(--textColor)" />
                <span className="text-base leading-6 var(--textColor) font-normal">Dashboard</span>
              </div>
            </div>
            {isDashboardOpen && (
              <ul className="ml-8 mt-2 space-y-1">
                <li className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                  <div className="flex items-center space-x-3">
                    <FiTrendingUp className="w-6 h-6 var(--textColor)" />
                    <span className="text-base leading-6 var(--textColor) font-normal">Trends</span>
                  </div>
                  <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    1
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                  <div className="flex items-center space-x-3">
                    <FiPieChart className="w-6 h-6 var(--textColor)" />
                    <span className="text-base leading-6 var(--textColor) font-normal">Analytics</span>
                  </div>
                </li>
                <li className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="w-6 h-6 var(--textColor)" />
                    <span className="text-base leading-6 var(--textColor) font-normal">Historical</span>
                  </div>
                  <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    1
                  </span>
                </li>
              </ul>
            )}
          </li>
          <li className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
            <div className="flex items-center space-x-3">
              <FiUsers className="w-6 h-6 var(--textColor)" />
              <span className="text-base leading-6 var(--textColor) font-normal">My Team</span>
            </div>
            <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
          </li>
          <li className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => {
                role === "brand"
                  ? router.push("/brand/profile")
                  : router.push("/sports-ambassador/profile");
              }}
            >
              <FiUser className="w-6 h-6 var(--textColor)" />
              <span className="text-base leading-6 var(--textColor) font-normal">Profile</span>
            </div>
            <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
          </li>
          <li className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
            <div className="flex items-center space-x-3">
              <FiMail className="w-6 h-6 var(--textColor)" />
              <span className="text-base leading-6 var(--textColor) font-normal">Invite</span>
            </div>
            <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
          </li>
          <li
            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
            onClick={() => {
              router.push("/brand/campaign");
            }}
          >
            <div className="flex items-center space-x-3">
              <FiMail className="w-6 h-6 var(--textColor)" />
              <span className="text-base leading-6 var(--textColor) font-normal">Campaigns</span>
            </div>
          </li>
        </ul>
      </nav>

      {/* Bottom Links */}
      <div className="p-4">
        <ul className="space-y-2">
          <li className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
            <FiHelpCircle className="w-6 h-6 var(--textColor)" />
            <span className="text-base leading-6 var(--textColor) font-normal">Support</span>
          </li>
          <li className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
            <FiSettings className="w-6 h-6 var(--textColor)" />
            <span className="text-base leading-6 var(--textColor) font-normal">Settings</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
