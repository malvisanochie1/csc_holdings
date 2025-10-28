import React from "react";
import Navbar from "@/components/sections/navs/navbar";
import Sidebar from "@/components/sections/navs/sidebar";
const page = () => {
  return (
    <>
      <Navbar />
      <div className="flex home-bg lg:h-screen">
        <div className="max-w-[240px] w-full hidden xl:flex">
          <Sidebar />
        </div>
        <div className="w-full">
          <div className="w-full min-h-screen p-3 sm:px-5 md:px-7 lg:px-10">
            <div className="px-2 sm:px-4 md:px-4 py-1 sm:py-2 md:py-3 w-full gradient text-gray-200 dark:text-gray-300 rounded-md font-bold mt-5 sm:mt-10 md:mt-16 lg:mt-20">
              <h1>No Notifications for now.</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
