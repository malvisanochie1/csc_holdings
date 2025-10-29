"use client";
import React from "react";
import { IoChevronDown } from "react-icons/io5";
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
import { Disclosure } from "@headlessui/react";
import { Incoming_funds_reclaim_history } from "@/components/text/csc";
import IncomingFundsReclaims from "./incomingFundsReclaims";

const RecoveryAndTransactionStatus = () => {
  return (
    <>
      <IncomingFundsReclaims />

    </>
  );
};

export default RecoveryAndTransactionStatus;
