import React from "react";
import { steps } from "@/components/text/csc";

const RecoveryMap: React.FC = () => {
  return (
    <div className="card p-4 w-full">
      <div className="text-gray-400 font-medium text-lg mb-3">
        <h1 className="text-gray-700 text-lg font-semibold mb-2">
          Recovery Map Reference
        </h1>
        <div className="text-[15px] text-gray-500">
          Procedural Reclaim Methodology
        </div>
      </div>

      <div className="mt-2">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full">
            <div className="relative">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start mb-6 sm:mb-8">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${step.bg} shadow-sm`}
                    >
                      {step.icon}
                    </div>
                    {idx !== steps.length - 1 && (
                      <div
                        className="w-px bg-gray-200 mt-2"
                        style={{ height: 40 }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-gray-700 font-medium mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-snug">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryMap;
