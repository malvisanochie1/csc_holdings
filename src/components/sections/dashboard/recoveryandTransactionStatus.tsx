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

const RecoveryAndTransactionStatus = () => {
  return (
    <>
      <div className="recoveryandTransactionStatus">
        <div className="col-span-2 card p-4 max-h-[600px]">
          <div className="text-gray-400 font-bold flex items-center space-x-2 my-3 sm:my-5">
            <span>
              <RiExchangeFundsLine className="text-blue-500 me-2" />
            </span>{" "}
            Incoming funds reclaim history
          </div>

          <Table className="min-h-40 sm:min-h-96">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">DATE</TableHead>
                <TableHead>ENTITY</TableHead>
                <TableHead>ASSETS</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right">VALUE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="items-start">
              {Incoming_funds_reclaim_history.map((r) => (
                <TableRow key={r.date}>
                  <TableCell className="font-medium">{r.date}</TableCell>
                  <TableCell>{r.entity}</TableCell>
                  <TableCell>{r.assets}</TableCell>
                  <TableCell
                    className={
                      r.status === "completed"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }
                  >
                    {r.status}
                  </TableCell>
                  <TableCell className="text-right">{r.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile: compact disclosure list */}
        <div className="sm:hidden-">
          <div className="w-full px-4 pt-6">
            <div className="mx-auto w-full max-w-lg overflow-hidden rounded-xl bg-white/5 shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Incoming Orders
                  </h3>
                  <p className="text-xs text-white/50">
                    Open positions and recent activity
                  </p>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {Incoming_funds_reclaim_history.map((record, idx) => (
                  <Disclosure key={record.date + idx}>
                    <Disclosure.Button
                      as="div"
                      className="px-4 py-3 cursor-pointer"
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`text-xs font-medium text-white ${
                              record.status === "completed"
                                ? "bg-green-600"
                                : record.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-red-600"
                            } rounded-md px-2 py-1`}
                          >
                            {record.status?.toUpperCase()}
                          </span>
                          <span className="text-sm text-white">
                            {record.entity} • {record.assets}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-white">
                            {record.value}
                          </div>
                          <IoChevronDown className="w-4 h-4 text-white/60" />
                        </div>
                      </div>
                    </Disclosure.Button>

                    <Disclosure.Panel>
                      <div className="divide-y divide-white/5 bg-[#0b1220]">
                        <div className="px-4 py-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <span
                                className={`text-xs font-medium text-white ${
                                  record.status === "completed"
                                    ? "bg-green-600"
                                    : record.status === "pending"
                                    ? "bg-yellow-500"
                                    : "bg-red-600"
                                } rounded-md px-2 py-1`}
                              >
                                {record.status?.toUpperCase()}
                              </span>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-semibold text-white">
                                    {record.entity}
                                  </span>
                                  <span className="text-xs text-white/40">
                                    ID: {idx + 1}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-green-400">
                                ${record.value}
                              </div>
                              <div className="text-xs text-white/50">
                                Current
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 py-3">
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/80">
                            <dt className="text-white/60">DATE</dt>
                            <dd className="text-right text-white">
                              {record.date}
                            </dd>

                            <dt className="text-white/60">ENTITY</dt>
                            <dd className="text-right text-white">
                              {record.entity}
                            </dd>

                            <dt className="text-white/60">ASSETS</dt>
                            <dd className="text-right text-white">
                              {record.assets}
                            </dd>

                            <dt className="text-white/60">STATUS</dt>
                            <dd className="text-right text-white">
                              {record.status}
                            </dd>

                            <dt className="text-white/60">VALUE</dt>
                            <dd className="text-right text-white">
                              {record.value}
                            </dd>
                          </dl>
                        </div>

                        <div className="px-4 py-3">
                          <Disclosure.Button
                            as="button"
                            className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                          >
                            Close
                          </Disclosure.Button>
                        </div>
                      </div>
                    </Disclosure.Panel>
                  </Disclosure>
                ))}
              </div>
            </div>
          </div>
        </div>

        <RecoveryMap />
      </div>
    </>
  );
};

export default RecoveryAndTransactionStatus;
