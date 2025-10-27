import React from "react";

type Props = {
  onCancel?: () => void;
  onContinue?: () => void;
  className?: string;
};

export default function PaymentSuccessful({
  onCancel,
  onContinue,
  className = "",
}: Props) {
  return (
    <div
      className={`max-w-md w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center ${className}`}
      role="dialog"
      aria-labelledby="payment-success-title"
      aria-describedby="payment-success-desc"
    >
      <div className="mx-auto w-16 h-16 rounded-lg bg-green-50 flex items-center justify-center mb-6">
        <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v2m0 8v2"
            />
          </svg>
        </div>
      </div>

      <h2
        id="payment-success-title"
        className="text-2xl font-semibold text-slate-900 mb-2"
      >
        Payment Successful
      </h2>

      <p id="payment-success-desc" className="text-sm text-slate-500 mb-6">
        Your payment has been processed successfully.
      </p>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-200"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
