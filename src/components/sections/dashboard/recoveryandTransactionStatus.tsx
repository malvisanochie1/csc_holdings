import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiExchangeFundsLine } from "react-icons/ri";
import RecoveryMap from "@/components/sections/dashboard/recoveryMap";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { IoChevronDown } from "react-icons/io5";

const recoveryandTransactionStatus = () => {
  return (
    <>
      <div className="recoveryandTransactionStatus">
        <div className="col-span-2 card p-4 max-h-[600px]">
          <div className="text-gray-400 font-bold flex items-center space-x-2 my-3 sm:my-5">
            <span>
              <RiExchangeFundsLine className="text-blue-500 me-2" />
            </span>{" "}
            Incoming Funds Reclaims .
          </div>
          <Table className="min-h-40 sm:min-h-96 ">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">DATE</TableHead>
                <TableHead>ENTITY</TableHead>
                <TableHead>ASSETS</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right">VALUE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="items-start">
              <TableRow>
                <TableCell className="font-medium">
                  2025-10-09 13:16:58
                </TableCell>
                <TableCell>NB LTD</TableCell>
                <TableCell>Gold</TableCell>
                <TableCell> 10,000</TableCell>
                <TableCell className="text-right text-green-500">
                  completed
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        {/* mobile */}

        <div className="sm:hidden">


    <div className="h-screen w-full px-4 pt-32">
      <div className="mx-auto w-full max-w-lg divide-y divide-white/5 rounded-xl bg-white/5">
        <Disclosure as="div" className="p-6" defaultOpen={true}>
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
              What is your refund policy?
            </span>
            <IoChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
            If you&apos;re unhappy with your purchase, we&apos;ll refund you in full.
          </DisclosurePanel>
        </Disclosure>
        <Disclosure as="div" className="p-6">
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
              Do you offer technical support?
            </span>
            <IoChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-white/50">No.</DisclosurePanel>
        </Disclosure>
      </div>
    </div>

        </div>
        <RecoveryMap />
      </div>
    </>
  );
};

export default recoveryandTransactionStatus;
