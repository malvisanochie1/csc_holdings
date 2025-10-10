import React from "react";

const page = () => {
  return (
    <div>
      <div className="flex ">
        <div className="w-3/12 h-screen hidden xl:flex transform ease-in-out transition-transform duration-300"></div>
        <div className="w-full min-h-screen home-bg p-3 sm:px-5 md:px-7 lg:px-10">
          <div className="px-2 sm:px-4 md:px-4 py-1 sm:py-2 md:py-3 w-full bg-gradient-to-r from-[#03C2F3] to-[#2056FE] text-gray-200 rounded-md font-bold mt-5 sm:mt-10 md:mt-16 lg:mt-20">
            <h1>No Notifications for now.</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
