"use client";

import styles from "@/styles/components/Tooltip.module.css";
import type { OmitClassname } from "@/utils/OmitClassname";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export const TooltipTrigger = TooltipPrimitive.Trigger;

type TooltipProps = OmitClassname<TooltipPrimitive.TooltipProps>;

export const Tooltip = (props: TooltipProps) => (
  <TooltipPrimitive.Provider>
    <TooltipPrimitive.Root {...props} />
  </TooltipPrimitive.Provider>
);

type TooltipContentProps = OmitClassname<TooltipPrimitive.TooltipContentProps>;

export const TooltipContent = (props: TooltipContentProps) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content className={styles.content} {...props} />
  </TooltipPrimitive.Portal>
);
