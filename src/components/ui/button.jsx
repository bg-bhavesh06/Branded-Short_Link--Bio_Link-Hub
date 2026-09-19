"use client";

import React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium text-sm outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        icon: "size-10",
        "icon-sm": "size-8",
        lg: "h-11 px-5 text-base rounded-xl",
        xl: "h-12 px-6 text-base font-semibold rounded-2xl",
        sm: "h-8 px-3 text-xs rounded-lg",
      },
      variant: {
        default:
          "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800",
        primary:
          "bg-slate-950 text-white shadow-md shadow-slate-950/10 hover:bg-slate-800 active:bg-black",
        outline:
          "border border-slate-200 bg-white text-slate-900 shadow-xs hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300",
        ghost:
          "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
        link:
          "text-blue-600 underline-offset-4 hover:underline p-0 h-auto",
      },
    },
  }
);

export function Button({
  className,
  variant,
  size,
  render,
  children,
  loading = false,
  disabled,
  ...props
}) {
  const defaultProps = {
    children,
    className: cn(buttonVariants({ className, size, variant })),
    "data-slot": "button",
    disabled: loading || disabled,
    type: render ? undefined : (props.type || "button"),
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps(defaultProps, props),
    render,
  });
}
