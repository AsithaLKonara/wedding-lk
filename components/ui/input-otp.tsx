"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    index: number
  }
>(({ index, className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "relative h-10 w-10 appearance-none rounded-md border border-input bg-background text-center text-base transition-all first:ml-0 last:mr-0 focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 [&:not(:disabled):focus]:border-ring",
      className
    )}
    maxLength={1}
    {...props}
  />
))
InputOTPSlot.displayName = "InputOTPSlot"

export { InputOTP, InputOTPGroup, InputOTPSlot }