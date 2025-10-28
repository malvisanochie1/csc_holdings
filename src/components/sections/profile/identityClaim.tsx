import React from "react";

const identityClaim = () => {
  return (
    <>
      <div className="card p-4 pb-16">
        <div className="flex justify-between items-center">
          <h2 className="text-gray-600 dark:text-gray-200 text-[14px] font-bold mb-5 uppercase">
            {" "}
            Identity Claim
          </h2>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap justify-between items-center">
            <h2
              id="identity"
              className="text-gray-500 text-base sm:text-base font-semibold mb-2 "
            >
              {" "}
              Proof Of Identity
            </h2>
            <label
              htmlFor="identity"
              className="text-[15px]  bg-red-500 rounded-3xl text-white font-semibold px-4"
            >
              Not submitted
            </label>
          </div>
          <div className="flex flex-wrap justify-between items-center">
            <h2
              id="identity"
              className="text-gray-500 text-base sm:text-base font-semibold mb-2 "
            >
              {" "}
              Proof Of Address
            </h2>
            <label
              htmlFor="identity"
              className="text-[15px]  bg-red-500 rounded-3xl text-white font-semibold px-4"
            >
              Not submitted
            </label>
          </div>
          <h2
            id="identity"
            className="text-red-500 text-base sm:text-lg font-semibold mb-2 mt-4"
          >
            {" "}
            Your account isn&#39;t verified.
          </h2>
        </div>
      </div>
    </>
  );
};

export default identityClaim;
