"use client";

import React from "react";
import Image from "next/image";
import FlowModal from "@/components/modals/flow/flowModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConversionSuccessModalProps
  extends Omit<React.ComponentProps<typeof FlowModal>, "title" | "subtitle" | "eyebrow" | "children"> {
  message: string;
  heading?: string;
  description?: string;
}

const ConversionSuccessModal = ({
  message,
  heading = "Conversion Update",
  description = "We've received your confirmation.",
  contentClassName,
  dialogClassName,
  ...flowModalProps
}: ConversionSuccessModalProps) => {
  const handleClose = () => {
    flowModalProps.onOpenChange?.(false);
  };

  const { trigger, open, onOpenChange, ...rest } = flowModalProps;

  return (
    <FlowModal
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      title={heading}
      subtitle={description}
      dialogClassName={cn("sm:max-w-md", dialogClassName)}
      contentClassName={cn("max-w-md", contentClassName)}
      {...rest}
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <Image
          src="/check.gif"
          alt="Success"
          width={140}
          height={140}
          className="h-28 w-28 object-contain"
        />
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{message}</p>
        <Button
          type="button"
          className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500"
          onClick={handleClose}
        >
          Continue
        </Button>
      </div>
    </FlowModal>
  );
};

export default ConversionSuccessModal;
