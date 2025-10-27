import React from "react";
import { VscDebugRestart } from "react-icons/vsc";

const recoveryPortal = () => {
  return (
    <>
      <div className="px-4">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 gradient text-white">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-white/20 rounded-full p-2">
                <VscDebugRestart size={14} />
              </div>
            </div>
            <div className="text-sm font-semibold">Recovery verification portal</div>
            <div className="mt-3">
              <button className="w-full inline-flex items-center justify-center gap-2 bg-white text-orange-600 rounded-md py-2 text-xs font-semibold">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 21h22L12 2 1 21z" fill="#FB923C" />
                  <path
                    d="M12 16v-4"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                UNVERIFIED ACCOUNT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default recoveryPortal;
