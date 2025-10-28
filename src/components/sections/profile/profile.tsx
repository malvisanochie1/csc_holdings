import React from "react";

const profile = () => {
  return (
    <>
      <div className="card p-4">
        <div className="text-gray-400 font-medium text-lg mb-3">
          <h1 className="text-gray-700 dark:text-gray-200 text-lg font-semibold mb-2">
            Profile Information
          </h1>
          <div className="text-[15px] text-gray-500 font-light">
            Hi, Please make sure you review the details below and make the
            necessary changes.
          </div>
        </div>
        <section className="p-3 sm:p-5 flex flex-col space-y-3">
          <div className="flex flex-wrap justify-between items-center">
            <h2 className="text-gray-600 text-[15px] font-bold mb-2">
              {" "}
              Username:
            </h2>
            <p className="text-[15px] text-gray-500 font-[400]">John</p>
          </div>
          <div className="flex flex-wrap justify-between items-center">
            <h2 className="text-gray-600 text-[15px] font-bold mb-2">
              {" "}
              First Name:
            </h2>
            <p className="text-[15px] text-gray-500 font-[400]">John</p>
          </div>
          <div className="flex flex-wrap justify-between items-center">
            <h2 className="text-gray-600 text-[15px] font-bold mb-2">
              {" "}
              Last Name:
            </h2>
            <p className="text-[15px] text-gray-500 font-[400]"></p>
          </div>
          <div className="flex flex-wrap justify-between items-center ">
            <h2 className="text-gray-600 text-[15px] font-bold mb-2">
              {" "}
              Email:
            </h2>
            <p className="text-[15px] text-gray-500 font-[400]">
              johnstonphil2019@gmail.com
            </p>
          </div>
          <div className="flex flex-wrap justify-between items-center ">
            <h2 className="text-gray-600 text-[15px] font-bold mb-2">
              {" "}
              Email:
            </h2>
            <p className="text-[15px] text-gray-500 font-[400]">
              johnstonphil2019@gmail.com
            </p>
          </div>
          <div className="flex flex-wrap justify-between items-center ">
            <h2 className="text-gray-600 text-[15px] font-bold mb-2">
              {" "}
              Address:
            </h2>
            <p className="text-[15px] text-gray-500 font-[400]"></p>
          </div>
          <div className="flex flex-wrap justify-between items-center ">
            <h2 className="text-gray-600 text-[15px] font-bold mb-2"> City:</h2>
            <p className="text-[15px] text-gray-500 font-[400]"></p>
          </div>
          <div className="flex flex-wrap justify-between items-center ">
            <h2 className="text-gray-600 text-[15px] font-bold mb-2">
              {" "}
              Country:
            </h2>
            <p className="text-[15px] text-gray-500 font-[400]">
              United Kingdom
            </p>
          </div>
          <div className="flex flex-wrap justify-between items-center ">
            <h2 className="text-gray-600 text-[15px] font-bold mb-2">
              {" "}
              Ph. Number:
            </h2>
            <p className="text-[15px] text-gray-500 font-[400]">
              +4487654321234
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default profile;
