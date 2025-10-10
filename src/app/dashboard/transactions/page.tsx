import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const page = () => {
  return (
    <div className="w-full  home-bg p-3 sm:px-5 md:px-7 lg:px-10">
      <div className="col-span-2  p-4 max-h-[600px] ">
        <div className="text-gray-400 font-semibold items-center space-x-2 z-20">
          <span className="flex items-center text-gray-400 text-sm">
            <h3>Pages</h3>
            <span className="mx-2 ">/</span>
            <h3 className="text-gray-700">Transactions</h3>
          </span>{" "}
          <div className="font-bold text-gray-700 text-">Transactions</div>
        </div>
      </div>{" "}
      <div className=" gap-4 card mt-5 sm:mt-10">
        <div className="text-gray-400 font-bold flex items-center space-x-2 pt-3 sm:pt-5 px-4 sm:px-5 md:px-7 lg:px-10">
          <h2>Transactions table</h2>
        </div>
        <Table className="min-h-40 sm:min-h-96 md:min-h-[420px] ">
          <TableHeader>
            <TableRow>
              <TableHead className="ps-4 sm:ps-5 md:ps-7 lg:ps-10">
                Transaction ID{" "}
              </TableHead>
              <TableHead>Date </TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status </TableHead>
              <TableHead className="text-right pe-4 sm:pe-5 md:pe-7 lg:pe-10">
                Type
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="items-start">
            <TableRow>
              <TableCell className="font-medium"></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right text-green-500"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
