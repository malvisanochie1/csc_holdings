import React from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

const BitcoinTransfer = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 md:pt-8 lg:pt-10 p-2 sm:px-6 py-4 md:px-8">
        <Field>
          <FieldLabel htmlFor="username">
            {" "}
            Transaction Amount <span className="">(฿) </span>{" "}
          </FieldLabel>
          <Input
            id="username"
            type="number"
            autoComplete="off"
            placeholder="Enter Tranction amount"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="username">Bitcoin Address</FieldLabel>
          <Input
            id="username"
            type="text"
            autoComplete="off"
            placeholder="Enter Bitcoin Wallet Address"
          />
        </Field>
        <div className="h-20 sm:h-32 md:h-40 w-full" />
      </div>
    </div>
  );
};

export default BitcoinTransfer;
