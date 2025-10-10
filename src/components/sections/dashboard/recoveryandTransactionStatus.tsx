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
        <div className="">
          <RecoveryMap />
        </div>
      </div>
    </>
  );
};

export default recoveryandTransactionStatus;
