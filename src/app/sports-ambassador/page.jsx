"use client";

import SidebarSports from "@/components/SidebarSports";
import { useAuthStore } from "@/store/authStore";

const Home = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1">
        <SidebarSports />
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome to the Home Page
          </h1>
        </div>
      </div>
    </div>
  );
};
export default Home;
