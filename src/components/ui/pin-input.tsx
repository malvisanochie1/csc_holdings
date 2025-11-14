"use client";

import * as React from "react";
import { PinInput as PinInputPrimitive } from "@ark-ui/react/pin-input";
import { cn } from "@/lib/utils";

const PinInput = PinInputPrimitive.Root;

const PinInputGroup = React.forwardRef<
  React.ElementRef<typeof PinInputPrimitive.Control>,
  React.ComponentPropsWithoutRef<typeof PinInputPrimitive.Control>
>(({ className, ...props }, ref) => (
  <PinInputPrimitive.Control
    ref={ref}
    className={cn("flex items-center justify-center gap-2", className)}
    {...props}
  />
));
PinInputGroup.displayName = PinInputPrimitive.Control.displayName;

const PinInputInput = React.forwardRef<
  React.ElementRef<typeof PinInputPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof PinInputPrimitive.Input>
>(({ className, ...props }, ref) => (
  <PinInputPrimitive.Input
    ref={ref}
    className={cn(
      "flex h-12 w-10 items-center justify-center rounded border border-gray-300 bg-white text-xl font-semibold font-mono leading-none text-center text-gray-900 transition caret-transparent",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:border-indigo-400",
      "data-[focus=true]:border-indigo-500",
      "data-[filled=true]:border-indigo-500 data-[filled=true]:text-indigo-600",
      "dark:border-white/20 dark:bg-gray-900 dark:text-white dark:focus-visible:ring-indigo-500/40",
      className
    )}
    {...props}
  />
));
PinInputInput.displayName = PinInputPrimitive.Input.displayName;

export { PinInput, PinInputGroup, PinInputInput };
