"use client";

import React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@/lib/utils";

export function Card({ className, render, ...props }) {
  const defaultProps = {
    className: cn(
      "relative flex flex-col rounded-2xl border border-slate-200/80 bg-white text-slate-900 shadow-sm transition-all duration-200",
      className
    ),
    "data-slot": "card",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}

export function CardHeader({ className, render, ...props }) {
  const defaultProps = {
    className: cn("flex flex-col space-y-1.5 p-6", className),
    "data-slot": "card-header",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}

export function CardTitle({ className, render, ...props }) {
  const defaultProps = {
    className: cn("font-semibold text-lg leading-none tracking-tight text-slate-900", className),
    "data-slot": "card-title",
  };

  return useRender({
    defaultTagName: "h3",
    props: mergeProps(defaultProps, props),
    render,
  });
}

export function CardDescription({ className, render, ...props }) {
  const defaultProps = {
    className: cn("text-sm text-slate-500 leading-relaxed", className),
    "data-slot": "card-description",
  };

  return useRender({
    defaultTagName: "p",
    props: mergeProps(defaultProps, props),
    render,
  });
}

export function CardContent({ className, render, ...props }) {
  const defaultProps = {
    className: cn("p-6 pt-0", className),
    "data-slot": "card-content",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}

export function CardFooter({ className, render, ...props }) {
  const defaultProps = {
    className: cn("flex items-center p-6 pt-0", className),
    "data-slot": "card-footer",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}
