import React from "react";
import Hero from "@/components/sections/profile/hero";
import Profile from "./profile";
import EditAccount from "./editAccount";
import IdentityClaim from "./identityClaim";

const page = () => {
  return (
    <>
      <div className="flex ">
        <div className="w-3/12 h-screen hidden xl:flex transform ease-in-out transition-transform duration-300"></div>
        <div className="w-full  home-bg p-3 sm:p-5">
          <Hero />
          <div className="grid grid-cols-1 lg:grid-cols-3 mt-20 gap-4">
            <Profile />
            <EditAccount />
            <IdentityClaim />
          </div>
        </div>
      </div>
      <div>
        <div className="flex w-full h-80 bg-amber-700 rounded-2xl"></div>
      </div>
    </>
  );
};

export default page;
