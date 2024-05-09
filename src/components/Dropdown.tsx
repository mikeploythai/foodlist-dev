"use client";

import styles from "@/styles/components/Dropdown.module.css";
import type { OmitClassname } from "@/utils/OmitClassname";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";

export const Dropdown = DropdownPrimitive.Root;

export const DropdownTrigger = DropdownPrimitive.Trigger;

type DropdownContentProps =
  OmitClassname<DropdownPrimitive.DropdownMenuContentProps>;

export const DropdownContent = (props: DropdownContentProps) => (
  <DropdownPrimitive.Portal>
    <DropdownPrimitive.Content className={styles.content} {...props} />
  </DropdownPrimitive.Portal>
);

type DropdownItemProps = Omit<
  DropdownPrimitive.DropdownMenuItemProps,
  "onSelect"
>;

export const DropdownItem = (props: DropdownItemProps) => (
  <DropdownPrimitive.Item onSelect={(e) => e.preventDefault()} {...props} />
);
