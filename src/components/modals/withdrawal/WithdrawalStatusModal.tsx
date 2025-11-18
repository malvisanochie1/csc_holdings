import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface WithdrawalStatusModalProps {
  status: "success" | "failed" | "pending";
  message: string;
  onClose: () => void;
}

const WithdrawalStatusModal: React.FC<WithdrawalStatusModalProps> = ({
  status,
  message,
  onClose,
}) => {
  const imageSrc = status === "success" ? "/check.gif" : "/loading.gif"; // Assuming a loading gif for pending/failed
  const title = status === "success" ? "Payment Successful" : (status === "failed" ? "Payment Failed" : "Withdrawal Pending");
  const buttonText = status === "success" ? "Done" : "Close";

  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <Image src={imageSrc} alt={title} width={180} height={180} className="h-32 w-32" />
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      </div>

      <Button
        type="button"
        className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500 w-full"
        onClick={onClose}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default WithdrawalStatusModal;
