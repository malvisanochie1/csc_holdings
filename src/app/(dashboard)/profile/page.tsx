import React from "react";
import Hero from "@/components/sections/profile/hero";
import EditAccount from "@/components/sections/profile/editAccount";
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
          <div className="w-full p-3 sm:p-5 h-screen overflow-y-auto">
            <Hero />
            <div className="mt-20">
              <EditAccount />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
