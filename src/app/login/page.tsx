import React from "react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
const page = () => {
  return (
    <div className="p-3">
      <div className="max-w-md mx-auto card p-3 sm:p-5 py-5 sm:py-8  md:p-10 mt-20 ">
        <div className="w-full">
          <h1 className="text-xl sm:text-2xl font-bold">
            <span className="text-lg sm:text-lg lg:text-xl">Login to </span> CSC
            ESCROW & <br /> SETTLEMENT UK LTD
          </h1>
          <p className="text-gray-500 font-light mt-2 mb-8 sm:mb-10 lg:mb-12">
            Reliable, Dependable.
          </p>

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="font-semibold">
                  Email
                </FieldLabel>
                <Input
                  className="focus-visible:ring-0 rounded bg-[#E8F0FE]"
                  type="email"
                  id="email"
                  placeholder="Your email address"
                />
              </Field>
              <Field className="mt-4 sm:mt-6">
                <FieldLabel htmlFor="password" className="font-semibold">
                  Password
                </FieldLabel>
                <Input
                  className="focus-visible:ring-0 rounded bg-[#E8F0FE]"
                  type="password"
                  id="password"
                  placeholder=""
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <div className="flex items-center gap-4 sm:gap-6 mt-6 sm:mt-auto">
            <button className="bg-gray-700 text-white px-4 sm:px-6 md:px-8 py-1 text-sm lato-bold rounded my-4 md:my-6">
              Login
            </button>
            <Link
              href="/forgot-password"
              className="text-xs sm:text-xs font-bold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 mt-2 sm:mt-auto">
            <Link
              href="/register"
              className="text-xs sm:text-xs font-semibold underline ring-offset-8 decoration-gray-200 underline-offset-10 decoration-2"
            >
              Register new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
