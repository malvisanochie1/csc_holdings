import React from "react";
import { FaCheck } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
//   DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  onCancel?: () => void;
  onContinue?: () => void;
  className?: string;
};

export default function PaymentSuccessful({
  onContinue,
  className = "",
}: Props) {
  return (
    <div
      className={` ${className}`}
      role="dialog"
      aria-labelledby="payment-success-title"
      aria-describedby="payment-success-desc"
    >
      <Dialog>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Withdraw</Button>
        </DialogTrigger> */}
        <DialogContent className="max-w-md w-full dark:bg-gray-800 dark:text-gray-300 bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-lg  dark:bg-slate-700 bg-green-50 flex items-center justify-center mb-6">
            <div className="w-10 h-10 rounded-md dark:bg-green-400 bg-green-200 flex items-center justify-center">
              <FaCheck
                size={20}
                className=" dark:text-green-800 text-green-600"
              />
            </div>
          </div>

          <h2
            id="payment-success-title"
            className="text-2xl font-semibold dark:text-gray-400 text-slate-900 mb-2"
          >
            Payment Successful
          </h2>

          <p
            id="payment-success-desc"
            className="text-sm text-slate-500 dark:text-gray-400/50 mb-6"
          >
            Your payment has been processed successfully.
          </p>

          <DialogFooter>
            <DialogClose
              asChild
              className="flex items-center justify-center gap-4"
            >
              <Button
                type="button"
                onClick={onContinue}
                className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none relative"
              >
                ok
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
