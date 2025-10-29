"use client";
import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TransactionRecord {
  date: string;
  entity: string;
  assets: string;
  status: string;
  value: string;
}

const assetTransactions: Record<string, TransactionRecord[]> = {
  Gold: [
    {
      date: "2025-10-09 13:16:58",
      entity: "NB LTD",
      assets: "Gold",
      status: "completed",
      value: "10,000",
    },
  ],
  Bitcoin: [
    {
      date: "2025-10-07 13:16:58",
      entity: "NB LTD",
      assets: "Bitcoin",
      status: "failed",
      value: "2,500",
    },
  ],
  XRP: [],
  Solana: [
    {
      date: "2025-10-09 04:16:58",
      entity: "NB LTD",
      assets: "Solana",
      status: "completed",
      value: "1,000",
    },
  ],
  Ethereum: [
    {
      date: "2025-10-08 13:16:58",
      entity: "NB LTD",
      assets: "Ethereum",
      status: "pending",
      value: "5,000",
    },
  ],
};

const assetIcons: Record<string, string> = {
  Gold: "/dashboard/account_overview/gold.png",
  Bitcoin: "/dashboard/account_overview/btc.png",
  XRP: "/dashboard/account_overview/XRP.png",
  Solana: "/dashboard/account_overview/solana.png",
  Ethereum: "/dashboard/account_overview/Etherum.png",
};

const chartData = [
  { month: "Jan", recovered: 0 },
  { month: "Feb", recovered: 2000 },
  { month: "Mar", recovered: 3500 },
  { month: "Apr", recovered: 5000 },
  { month: "May", recovered: 7500 },
  { month: "Jun", recovered: 10000 },
];

const chartConfig = {
  recovered: {
    label: "Recovered",
    color: "hsl(142.1 76.2% 36.3%)",
  },
} satisfies ChartConfig;

const IncomingFundsReclaims = () => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const assets = ["Gold", "Bitcoin", "XRP", "Solana", "Ethereum"];

  const handleAssetClick = (asset: string) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Incoming Funds Reclaims - Left Side */}
        <div className="lg:col-span-2 card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-2">
              Incoming Funds Reclaims
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              (Tap to explore transaction history)
            </p>
          </div>

          <div className="space-y-3">
            {assets.map((asset) => (
              <button
                key={asset}
                onClick={() => handleAssetClick(asset)}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={assetIcons[asset]}
                    alt={asset}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium text-gray-700 dark:text-white">
                    {asset} Transaction Record
                  </span>
                </div>
                <FaChevronRight className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats - Right Side */}
        <div className="card p-5 flex flex-col h-full">
          <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">Recovery Summary</h3>

          {/* Recovery Chart */}
          <div className="flex-1 mb-4">
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="recovered"
                  type="natural"
                  fill="hsl(142.1 76.2% 36.3%)"
                  fillOpacity={0.4}
                  stroke="hsl(142.1 76.2% 36.3%)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Stats Summary */}
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-600 dark:text-gray-400">Total Recovered</span>
              <span className="text-xl font-bold text-gray-800 dark:text-white">$10,000</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">2</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
              </div>
              <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">1</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
              </div>
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                <div className="text-lg font-bold text-red-600 dark:text-red-400">1</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Failed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              {selectedAsset && (
                <>
                  <Image
                    src={assetIcons[selectedAsset]}
                    alt={selectedAsset}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  {selectedAsset} Transaction Record
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedAsset && assetTransactions[selectedAsset].length > 0 ? (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DATE</TableHead>
                    <TableHead>ENTITY</TableHead>
                    <TableHead>ASSETS</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead className="text-right">VALUE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetTransactions[selectedAsset].map((record, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {record.date}
                      </TableCell>
                      <TableCell>{record.entity}</TableCell>
                      <TableCell>{record.assets}</TableCell>
                      <TableCell className={getStatusColor(record.status)}>
                        {record.status}
                      </TableCell>
                      <TableCell className="text-right">
                        ${record.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No transaction records found for {selectedAsset}.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IncomingFundsReclaims;
