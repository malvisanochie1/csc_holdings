import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { account_overview } from "@/components/text/csc";
const insufficientBalance = () => {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>
          {account_overview[0].option[0].option2}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <div
            role="alert"
            aria-live="assertive"
            className="w-full flex flex-col space-y-6"
          >
            <div className="mx-auto w-20 h-20 rounded-full border-4 border-[#F8BB86] flex items-center justify-center mb-6">
              <span className="text-[#F8BB86] text-4xl font-bold leading-none">
                !
              </span>
            </div>

            <p className="text-white text-lg sm:text-2xl ms:text-3xl font-semibold">
              Sorry, balance is insufficient.
            </p>
            <div className="flex w-ful justify-end">
              <AlertDialogAction className="right-6 bottom-6 bg-red-500 hover:bg-red-500 cursor-pointer text-white px-6  py-2 text-sm rounded shadow-sm">
                ok
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default insufficientBalance;
