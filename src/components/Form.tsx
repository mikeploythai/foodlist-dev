"use client";

import {
  dangerBtn,
  outlineBtn,
  secondaryBtn,
} from "@/styles/components/Button.module.css";
import { columns } from "@/styles/components/Dialog.module.css";
import { AlertDialogAction, AlertDialogCancel } from "./AlertDialog";
import { DialogClose } from "./Dialog";

type FormProps = {
  action: "Create" | "Update" | "Delete";
  handleAction: (formData: FormData) => void;
  isPending: boolean;
  children?: React.ReactNode;
};

export default function Form({
  action,
  handleAction,
  isPending,
  children,
}: FormProps) {
  const CloseButton = action !== "Delete" ? DialogClose : AlertDialogCancel;

  return (
    <form action={handleAction}>
      {children}

      <div className={columns}>
        <CloseButton disabled={isPending} className={outlineBtn}>
          Cancel
        </CloseButton>

        {action !== "Delete" ? (
          <button type="submit" disabled={isPending} className={secondaryBtn}>
            {action}
          </button>
        ) : (
          <AlertDialogAction
            type="submit"
            disabled={isPending}
            className={dangerBtn}
          >
            {action}
          </AlertDialogAction>
        )}
      </div>
    </form>
  );
}
