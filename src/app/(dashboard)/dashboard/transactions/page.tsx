"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navbar from "@/components/sections/navs/navbar";
import Sidebar from "@/components/sections/navs/sidebar";
import { useUserTransactions } from "@/lib/api/finance";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const TransactionsPage = () => {
  const { data: transactionsData, isLoading, error } = useUserTransactions();
  
  const transactions = transactionsData?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Processing</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
      case 'failed':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeDisplay = (method?: string) => {
    if (!method) return "Unknown";
    const normalized = method.trim();
    if (!normalized) return "Unknown";
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  return (
    <>
      <Navbar />
      <div className="flex home-bg lg:h-screen">
        <div className="max-w-[240px] w-full hidden xl:flex">
          <Sidebar />
        </div>
        <div className="w-full">
          <div className="w-full home-bg p-3 sm:px-5 md:px-7 lg:px-10">
            <div className="col-span-2 p-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Transaction Table</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track every inflow and outflow processed on your account.
                </p>
              </div>
            </div>
            <div className="gap-4 card mt-5 sm:mt-10">
              <div className="text-gray-400 font-bold flex items-center space-x-2 pt-3 sm:pt-5 px-4 sm:px-5 md:px-7 lg:px-10">
                <h2>Transaction inflow &amp; Outflow</h2>
              </div>
              <Table className="min-h-40 sm:min-h-96 md:min-h-[420px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="ps-4 sm:ps-5 md:ps-7 lg:ps-10">
                      Transaction ID
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pe-4 sm:pe-5 md:pe-7 lg:pe-10">
                      Type
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="items-start">
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading transactions...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        Error loading transactions. Please try again.
                      </TableCell>
                    </TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium ps-4 sm:ps-5 md:ps-7 lg:ps-10">
                          <span className="font-mono text-xs sm:text-sm">
                            {transaction.id.slice(0, 8)}...{transaction.id.slice(-8)}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {transaction.date}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {transaction.amount_formatted}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell className="text-right pe-4 sm:pe-5 md:pe-7 lg:pe-10">
                          <span className="text-xs sm:text-sm">
                            {getTypeDisplay(transaction.method)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionsPage;
