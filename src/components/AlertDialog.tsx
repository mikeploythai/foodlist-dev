"use client";

import styles from "@/styles/components/Dialog.module.css";
import type { OmitClassname } from "@/utils/OmitClassname";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

export const AlertDialog = AlertDialogPrimitive.Root;

export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export const AlertDialogTitle = AlertDialogPrimitive.Title;

export const AlertDialogDescription = AlertDialogPrimitive.Description;

export const AlertDialogAction = AlertDialogPrimitive.Action;

export const AlertDialogCancel = AlertDialogPrimitive.Cancel;

type AlertDialogContentProps =
  OmitClassname<AlertDialogPrimitive.AlertDialogContentProps>;

export const AlertDialogContent = (props: AlertDialogContentProps) => (
  <AlertDialogPrimitive.Portal>
    <AlertDialogPrimitive.Overlay className={styles.overlay}>
      <AlertDialogPrimitive.Content className={styles.content} {...props} />
    </AlertDialogPrimitive.Overlay>
  </AlertDialogPrimitive.Portal>
);
