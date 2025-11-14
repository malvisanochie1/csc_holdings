import React from "react";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
const page = () => {
  return (
    <div className="p-3">
      <div className="max-w-md mx-auto card p-3 sm:p-5 py-10 sm:py-8  md:p-10 mt-20 ">
        <div className="w-full">
          <p className="text-gray-500 font-light mt-2 ">
            Forgot your password? No problem.
          </p>
          <p className="text-gray-500 font-light mb-8 sm:mb-10 lg:mb-12">
            Just let us know your email address and we will email you a password
            reset link that will allow you to choose a new one.
          </p>

          <FieldSet>
            <FieldGroup>
              <Field>
                <Input
                  className="focus-visible:ring-0 rounded bg-[#E8F0FE]"
                  type="email"
                  id="email"
                  placeholder="Your email address"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <div className="flex items-center gap-4 sm:gap-6 mt-4 sm:mt-auto">
            <button className="bg-gray-700 text-white px-4 sm:px-6 md:px-8 py-1.5 text-sm lato-bold rounded my-4 md:my-6">
              Email password Reset link{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
