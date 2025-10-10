import React from "react";
import Image from "next/image";
const hero = () => {
  return (
    <>
      <div className="w-full h-56 sm:h-80 profile_bg rounded-2xl relative">
        <div className="bg-gradient-to-r from-blue-600/40 to-green-600/40 absolute top-0 w-full h-full rounded-2xl">
          <div className="col-span-2  p-4 max-h-[600px]">
            <div className="text-gray-400 font-semibold items-center space-x-2 my-3 sm:my-5 z-20">
              <span className="flex items-center text-gray-400 z-">
                <h3>Pages</h3>
                <span className="mx-2 text-white">/</span>
                <h3 className="text-white">Profile</h3>
              </span>{" "}
              <div className="font-bold text-white text-xl">Profile</div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-14 w-10/12 left-[8%] card bg-gradient-to-bl from-[#D4FBF7] to h-28 flex items-center px-5">
          <div className="w-fit h-fit relative">
            <Image
              width="200"
              height="200"
              src="/dashboard/account_overview/user-account.png"
              alt=""
              className="max-h-20 rounded-xl max-w-20 h-full object-cover border-4 border-white shadow-lg"
            />
            <button className="absolute -bottom-1 w-5 h-5 bg-gray-200 rounded -right-2"></button>
          </div>
          <div>
            <h2 className="text-gray-500 font-semibold text-[15px] ms-4">
              Recovery Profile
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default hero;
