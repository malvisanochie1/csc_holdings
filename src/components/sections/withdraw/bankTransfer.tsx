"use client";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

// const COUNTRIES = [
//   "Select country",
//   "United States",
//   "United Kingdom",
//   "Germany",
//   "United Arab Emirates",
//   "Bahrain",
//   "Japan",
// ];

const BankTransfer = () => {
  return (
    <div>
      <form className="mt-4 space-y-6 sm:space-y-8 md:space-y-10 p-2 sm:px-6 py-4 md:px-8">
        <div>
          {" "}
          <Field>
            <FieldLabel htmlFor="username">Transaction Amount</FieldLabel>
            <Input
              id="username"
              type="number"
              autoComplete="off"
              placeholder="Enter Full Amount"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Field>
            <FieldLabel htmlFor="username">
              {" "}
              Account Holder&#39;s Name
            </FieldLabel>
            <Input
              id="username"
              type="text"
              autoComplete="off"
              placeholder="Enter Full Name "
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="username">Account Number</FieldLabel>
            <Input
              id="username"
              type="text"
              autoComplete="off"
              placeholder="Enter Account Number"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="username">IBAN Number</FieldLabel>
            <Input
              id="username"
              type="text"
              autoComplete="off"
              placeholder="Enter IBAN Number"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
          <Field className="col-span-2">
            <FieldLabel htmlFor="username"> Bank Name </FieldLabel>
            <Input
              id="username"
              type="text"
              autoComplete="off"
              placeholder="Enter Full Name "
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="username">Account Number</FieldLabel>
            <Input
              id="username"
              type="text"
              autoComplete="off"
              placeholder="Enter Account Number"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="username">Swift Code</FieldLabel>
            <Input
              id="username"
              type="text"
              autoComplete="off"
              placeholder="Enter Bank Swift Code"
            />
          </Field>
        </div>
      </form>
    </div>
  );
};

export default BankTransfer;
