"use client";

import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/store/authStore";

import React from "react";

const BrandHomePage = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome to the Home Page
          </h1>
        </div>
      </div>
    </div>
  );
};

export default BrandHomePage;
