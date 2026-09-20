"use client";

import React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuPortal = MenuPrimitive.Portal;

export function DropdownMenuTrigger({ className, children, ...props }) {
  return (
    <MenuPrimitive.Trigger
      className={cn(
        "inline-flex items-center gap-1.5 outline-none cursor-pointer select-none transition-colors",
        className
      )}
      data-slot="menu-trigger"
      {...props}
    >
      {children}
    </MenuPrimitive.Trigger>
  );
}

export function DropdownMenuContent({
  children,
  className,
  sideOffset = 8,
  align = "start",
  side = "bottom",
  ...props
}) {
  return (
    <DropdownMenuPortal>
      <MenuPrimitive.Positioner
        align={align}
        className="z-50"
        data-slot="menu-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          className={cn(
            "min-w-48 rounded-xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-md text-slate-800 outline-none transition-all duration-150 animate-in fade-in-0 zoom-in-95",
            className
          )}
          data-slot="menu-popup"
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </DropdownMenuPortal>
  );
}

export function DropdownMenuItem({ className, ...props }) {
  return (
    <MenuPrimitive.Item
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 data-highlighted:bg-slate-100 data-highlighted:text-slate-900 data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      data-slot="menu-item"
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className, ...props }) {
  return (
    <MenuPrimitive.Separator
      className={cn("my-1 h-px bg-slate-100", className)}
      data-slot="menu-separator"
      {...props}
    />
  );
}

export const DropdownMenuGroup = MenuPrimitive.Group;
