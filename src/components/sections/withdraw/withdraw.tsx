import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import BankTransfer from "./bankTransfer";
import BitcoinTransfer from "./cryptoTranfer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BsBank } from "react-icons/bs";
import { BsCurrencyBitcoin } from "react-icons/bs";

interface WithdrawProps {
  triggerText?: string;
}

export function Withdraw({ triggerText = "Withdraw" }: WithdrawProps) {
  return (
    <Dialog>
      <DialogTrigger asChild className="w-fit p-0 border-0 shadow-0">
        <span className="cursor-pointer">{triggerText}</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl p-0 overflow-y-auto max-h-[100vh]">
        <div className="mb-4 w-full border-b border-gray-300 p-4">
          <h1 className="sm:text-xl font-semibold text-gray-700">
            FIAT Withdrawal
          </h1>
        </div>
        <Tabs
          defaultValue="account"
          className="w-full p-4 pb-6 sm:pb-8 md:pb-10 scroll-auto"
        >
          <TabsList>
            <TabsTrigger value="account">
              <div className="">
                <BsCurrencyBitcoin size={40} className="text-center mx-auto" />
                <h2 className="text-center text-lg sm:text-xl  font-light mt-2 ">
                  Bitcoin Transfer
                </h2>
              </div>
            </TabsTrigger>
            <TabsTrigger value="password">
              <div className="">
                <BsBank size={40} className="text-center mx-auto" />
                <h2 className="text-center text-lg sm:text-xl  font-light mt-2 ">
                  Bank Tranfer
                </h2>
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <BitcoinTransfer />
          </TabsContent>{" "}
          <TabsContent value="password">
            {" "}
            <BankTransfer />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
