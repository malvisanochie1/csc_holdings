import React from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
const editAccount = () => {
  return (
    <>
      {" "}
      <div className="card p-4">
        <FieldSet>
          <FieldLegend className="text-lg sm:text-xl md:text-2xl">
            Edit Account
          </FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" autoComplete="off" placeholder="John" />
            </Field>
            <Field>
              <FieldLabel htmlFor="firstname">First name</FieldLabel>
              <Input id="firstname" autoComplete="off" placeholder="John" />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastname">Last name</FieldLabel>
              <Input id="lastname" type="text" autoComplete="off" />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="off"
                placeholder="johnstonphil2019@gmail.com"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Input id="address" type="text" autoComplete="off" />
            </Field>
            <Field>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input id="city" type="text" autoComplete="off" />
            </Field>
            <Field>
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <Input
                id="country"
                type="text"
                autoComplete="off"
                placeholder="United Kingdom"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input
                id="phone"
                type="tel"
                autoComplete="off"
                placeholder="876543123"
              />
            </Field>

            <button className="bg-[#17C1E8] text-gray-100 font-bold px-4 md:px-6 py-1 lg:px-8 sm:py-2  text-xs w-fit rounded-md my-2 mb-3 sm:mb-4 md:mb-5">
              UP-DATE PROFILE
            </button>
          </FieldGroup>
        </FieldSet>
      </div>
    </>
  );
};

export default editAccount;
