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
import { account_assets, account_currency } from "@/components/text/csc";
import InsufficientBalance from "../../modals/withdrawal/insufficientBalance";
import { FaArrowDownLong } from "react-icons/fa6";

const financialAssets = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 lg:mt-8 xl:mt-10">
        {account_assets.map((item, idx) => (
          <div
            key={idx}
            className={`card p-2 sm:px-4 px-4 md:px-auto ${
              item.className ?? ""
            }`}
          >
            <div className="flex items-center justify-between">
              <Image
                width="200"
                height="200"
                src={item.img}
                alt=""
                className="rounded max-w-8 md:max-w-10 h-full object-cover mx-auto"
              />
              <DropdownMenu>
                <div className="w-full flex justify-end  focus:rind-0 focus:border-0 focus:outline-none">
                  <DropdownMenuTrigger className=" focus:rind-0 focus:border-0 focus:outline-none cursor-pointer text-gray-500">
                    <MdMoreVert />
                  </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onSelect={(e: Event) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <InsufficientBalance triggerText="Convert" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>{" "}
            </div>
            <div>
              <h5 className="header-sm text-start mt-3 lg:mt-2">
                {item.currency}
              </h5>
              <p className={`header text-start`}>
                {typeof item.amount === "number"
                  ? `$${item.amount.toLocaleString()}`
                  : item.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center w-full mt-3 sm:mt-4 md:mt-5">
        <span className="rounded-full border p-2 sm:p-3 animate-bounce border-gray-100 dark:border-gray-600 gradient text-gray-100 dark:text-gray-300">
          <FaArrowDownLong size={14} className="" />
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 lg:mt-8 xl:mt-10">
        {account_currency.map((item, idx) => (
          <div
            key={idx}
            className={`card p-2 sm:px-4 px-4 md:px-auto ${
              item.className ?? ""
            }`}
          >
            <div className="flex items-center justify-between">
              <Image
                width="200"
                height="200"
                src={item.img}
                alt=""
                className="rounded max-w-8 md:max-w-10 h-full object-cover mx-auto"
              />
              <DropdownMenu>
                <div className="w-full flex justify-end  focus:rind-0 focus:border-0 focus:outline-none">
                  <DropdownMenuTrigger className=" focus:rind-0 focus:border-0 focus:outline-none cursor-pointer text-gray-500">
                    <MdMoreVert />
                  </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onSelect={(e: Event) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <InsufficientBalance triggerText="Withdraw" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>{" "}
            </div>
            <div>
              <h5 className="header-sm text-start mt-3 lg:mt-2">
                {item.currency}
              </h5>
              <p className={`header text-start`}>
                {typeof item.amount === "number"
                  ? `$${item.amount.toLocaleString()}`
                  : item.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default financialAssets;
