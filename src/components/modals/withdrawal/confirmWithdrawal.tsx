import React from "react";
import { Withdraw } from "@/components/sections/withdraw/withdraw";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TiWarningOutline } from "react-icons/ti";

const confirmWithdrawal = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Withdraw</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto">
          <section className="">
            <div className="text-center mb-6">
              <div className="mb-4">
                <TiWarningOutline className="text-orange-400 h-8 w-8 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Warning</h2>
              <p className="mt-2 text-gray-600">
                Are you sure you want to withdraw now?
              </p>
            </div>
          </section>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button className="bg-[#00D0C2] hover:bg-[#00D0C2]/80 text-white">
              <Withdraw triggerText="OK" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default confirmWithdrawal;
