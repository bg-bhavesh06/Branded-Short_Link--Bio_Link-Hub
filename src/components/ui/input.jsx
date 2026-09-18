"use client";

import React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

export function Input({
  className,
  size = "default",
  unstyled = false,
  nativeInput = false,
  style,
  ...props
}) {
  const inputClassName = cn(
    "h-10 w-full min-w-0 rounded-[inherit] px-3.5 text-slate-800 text-sm outline-none placeholder:text-slate-400 bg-transparent",
    size === "sm" && "h-8 px-2.5 text-xs",
    size === "lg" && "h-12 px-4 text-base",
  );

  return (
    <span
      className={
        cn(
          !unstyled &&
            "relative inline-flex w-full items-center rounded-xl border border-slate-200 bg-white text-base shadow-xs transition-all duration-150 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 sm:text-sm",
          className,
        ) || undefined
      }
      data-size={size}
      data-slot="input-control"
    >
      {nativeInput ? (
        <input
          className={inputClassName}
          data-slot="input"
          style={style}
          {...props}
        />
      ) : (
        <InputPrimitive
          className={inputClassName}
          data-slot="input"
          style={style}
          {...props}
        />
      )}
    </span>
  );
}
