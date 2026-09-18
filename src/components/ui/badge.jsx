"use client";

import React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium tracking-wide transition-colors",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "px-3 py-1 text-xs rounded-full",
        sm: "px-2 py-0.5 text-[10px] rounded-full",
        lg: "px-3.5 py-1.5 text-sm rounded-full",
      },
      variant: {
        default:
          "bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold",
        primary:
          "bg-indigo-600 text-white",
        secondary:
          "bg-slate-100 text-slate-700 border border-slate-200/80",
        outline:
          "border border-slate-200 text-slate-700 bg-white",
        success:
          "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
      },
    },
  }
);

export function Badge({ className, variant, size, render, ...props }) {
  const defaultProps = {
    className: cn(badgeVariants({ className, size, variant })),
    "data-slot": "badge",
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps(defaultProps, props),
    render,
  });
}
