"use client";
import React from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdMoreVert } from "react-icons/md";
import { MdDiamond } from "react-icons/md";
import { Withdraw } from "../withdraw/withdraw";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

const accountOverview = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5  gap-4 pb-5  ">
        <div className="lg:col-span-3 card h-fit pb-2 sm:pb-3">
          <div className="grid lg:grid-cols-3 gap-4 mt-5 p-4">
            <div className="py-5 pb-10 ">
              <h2 className="text-center text-gray-400 font-bold">Hi John,</h2>
              <h3 className="text-center text-gray-400 pb-1.5 sm:pb-2 md:pb-3">
                Account ID
              </h3>
              <p className="header text-center"> ACMCT3IRDL1</p>
            </div>
            <div className="py-5 pb-10 shadow-xl dark:shadow-gray-700 shadow-gray-200 card">
              <div className="min-h-16">
                {" "}
                <Image
                  width="200"
                  height="200"
                  src="/dashboard/vaultt.jpg"
                  alt=""
                  className="rounded w-16 h-16 mx-auto mb-3"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <h2 className="text-center text-gray-500 font-bold">
                  Total Asset Value
                </h2>
                <h3 className="header-sm pb-1.5 sm:pb-2 md:pb-3 text-center">
                  Current Re-Claimed Funds{" "}
                </h3>
                <hr className="w-7/12 mx-auto bg-gradient-to-r from-gray-50 from via-gray-400 to-gray-50 dark:from-gray-800 from dark:via-gray-600 dark:to-gray-800 border-0 h-[1px]" />
                <p className="header text-center">$ 10,000</p>
              </div>
            </div>
            <div className="py-5 pb-10 shadow-xl card">
              <div className="min-h-16 w-full">
                <DropdownMenu>
                  <div className="w-full flex justify-end  focus:rind-0 focus:border-0 focus:outline-none pe-2 md:pe-4 text-gray-600">
                    <DropdownMenuTrigger className=" focus:rind-0 focus:border-0 focus:outline-none cursor-pointer">
                      <MdMoreVert />
                    </DropdownMenuTrigger>
                  </div>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <div onClick={(e) => e.stopPropagation()} className="p-2">
                        <Withdraw />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>{" "}
                <Image
                  width="200"
                  height="200"
                  src="/dashboard/gift.png"
                  alt=""
                  className="rounded w-12 mx-auto mb-3"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <h2 className="text-center text-gray-500 font-bold text-sm">
                  Av. BAL IN FIAT{" "}
                </h2>
                <h3 className="text-center text-gray-400 pb-1.5 sm:pb-2 md:pb-3 text-xs">
                  FIAT{" "}
                </h3>
                <hr className="w-7/12 mx-auto bg-gradient-to-r from-gray-50 from via-gray-400 to-gray-50 dark:from-gray-800 from dark:via-gray-600 dark:to-gray-800 border-0 h-[1px]" />
                <p className="header text-center"> $ 0</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 card p-2 sm:p-4">
          <div className="p-2 sm:p-5 bg-gradient-to-br from-[#5FC2C1] to-[#676DD3] dark:from-[#5fc2c072] dark:to-[#676DD374] card  dark:text-gray-300 text-white flex flex-col space-y-2 sm:space-y-3 w-full">
            <Disclosure as="div" className="w-full">
              <DisclosureButton className="w-full">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold flex items-start w-full md:text-center">
                  <span className="p-1 pb-2 rounded-md  dark:bg-gray-300 bg-white w-7 sm:w-9 h-7 sm:h-9 flex justify-center me-2 text-gray-600">
                    <MdDiamond />
                  </span>{" "}
                  Award Winning Escrow Services
                </h1>

                {/* <IoChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" /> */}
              </DisclosureButton>
              <DisclosurePanel className="">
                <p className="dark:text-gray-400 text-gray-200 font-[400] leading-snug">
                  Your funds re-claim and recovery journey is very important to
                  us. Trust us to put your priorities first in getting back your
                  money.
                </p>
                <p className="dark:text-gray-400 text-gray-200 font-[400] leading-snug">
                  NOTE: YOU ARE ELIGIBLE FOR THE FIAT WITHDRAWAL.
                </p>{" "}
              </DisclosurePanel>
            </Disclosure>

            {/* <h1 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center">
              <span className="p-1 pb-2 rounded-md  dark:bg-gray-300 bg-white w-7 sm:w-9 h-7 sm:h-9 flex justify-center me-2 text-gray-600">
                <MdDiamond />
              </span>{" "}
              Award Winning Escrow
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold pb-2">
              Services
            </h2>
            <p className="dark:text-gray-400 text-gray-200 font-[400] leading-snug">
              Your funds re-claim and recovery journey is very important to us.
              Trust us to put your priorities first in getting back your money.
            </p>
            <p className="dark:text-gray-400 text-gray-200 font-[400] leading-snug">
              NOTE: YOU ARE ELIGIBLE FOR THE FIAT WITHDRAWAL.
            </p> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default accountOverview;
