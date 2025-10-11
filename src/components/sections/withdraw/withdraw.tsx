import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import BankTransfer from "./bankTransfer";
import BitcoinTransfer from "./bitcoinTransfer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BsBank } from "react-icons/bs";
import { BsCurrencyBitcoin } from "react-icons/bs";

export function Withdraw() {
  return (
    <Dialog>
      <DialogTrigger asChild className="w-fit p-0 border-0 shadow-0">
        <span className="cursor-pointer">Withdraw</span>
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
        {/* <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
