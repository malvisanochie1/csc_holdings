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
import { account_overview } from "@/components/text/csc";
import InsufficientBalance from "../withdraw/insufficientBalance";
const financialAssets = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 sm:gap-6 mt-4 md:mt-6 lg:mt-8 xl:mt-10">
        {account_overview.map((item, idx) => (
          <div
            key={idx}
            className={`card p-2 sm:p-4 px-4 md:px-auto ${
              item.className ?? ""
            }`}
          >
            <div className="flex items-center justify-between">
              <Image
                width="200"
                height="200"
                src={item.img}
                alt=""
                className="rounded max-h-10 md:max-h-12 max-w-10 md:max-w-12 h-full object-cover mx-auto"
              />
              <DropdownMenu>
                <div className="w-full flex justify-end  focus:rind-0 focus:border-0 focus:outline-none">
                  <DropdownMenuTrigger className=" focus:rind-0 focus:border-0 focus:outline-none cursor-pointer text-gray-500">
                    <MdMoreVert />
                  </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent>
                  <DropdownMenuItem>{item.option[0].option1}</DropdownMenuItem>
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
                    <InsufficientBalance />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>{" "}
            </div>
            <div>
              <h5 className="header-sm text-start mt-3 mb-0.5">
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
