"use client";

import styles from "@/styles/components/Dialog.module.css";
import type { OmitClassname } from "@/utils/OmitClassname";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { IconX } from "@tabler/icons-react";

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogTitle = DialogPrimitive.Title;

export const DialogDescription = DialogPrimitive.Description;

export const DialogClose = DialogPrimitive.Close;

type DialogContentProps = OmitClassname<DialogPrimitive.DialogContentProps>;

export const DialogContent = ({ children, ...props }: DialogContentProps) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className={styles.overlay}>
      <DialogPrimitive.Content className={styles.content} {...props}>
        {children}

        <DialogPrimitive.Close
          aria-label="Close dialog"
          className={styles.closeBtn}
        >
          <IconX size={16} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Overlay>
  </DialogPrimitive.Portal>
);
