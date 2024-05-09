"use client";

import button from "@/styles/components/Button.module.css";
import { createList, deleteList, updateList } from "@/utils/actions";
import {
  MAX_INPUT_LENGTH,
  MAX_TEXTAREA_LENGTH,
  MIN_INPUT_LENGTH,
  TEXTAREA_ROWS,
} from "@/utils/constants";
import type { Tables } from "@/utils/supabase/types";
import { validateList } from "@/utils/validators";
import { IconPlus } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "./AlertDialog";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./Dialog";
import Form from "./Form";

export function CreateList() {
  const label = "New list";
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAction(formData: FormData) {
    startTransition(async () => {
      const data = Object.fromEntries(formData);
      const validated = validateList.safeParse(data);

      if (!validated.success) {
        for (const { message: error } of validated.error.issues)
          toast.error(error);
        return;
      }

      const res = await createList(validated.data);
      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success(`Successfully created "${res.listName}"`);
      setIsOpen(false);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className={button.secondaryBtn}>
        {label} <IconPlus size={16} />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>{label}</DialogTitle>

        <Form action="Create" handleAction={handleAction} isPending={isPending}>
          <FormFields isPending={isPending} />
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function EditList({
  list,
  children,
}: {
  list: Tables<"lists">;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAction(formData: FormData) {
    startTransition(async () => {
      const data = Object.fromEntries(formData);

      // Check if data is different from og data later

      const validated = validateList.safeParse(data);

      if (!validated.success) {
        for (const { message: error } of validated.error.issues)
          toast.error(error);
        return;
      }

      const handleUpdateList = updateList.bind(null, list.id);
      const res = await handleUpdateList(validated.data);
      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success(`Successfully updated "${res.listName}"`);
      setIsOpen(false);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}

      <DialogContent>
        <DialogTitle>Editing list</DialogTitle>

        <Form action="Update" handleAction={handleAction} isPending={isPending}>
          <FormFields list={list} isPending={isPending} />
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteList({
  listId,
  listName,
  children,
}: {
  listId: string;
  listName: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAction() {
    startTransition(async () => {
      const handleDeleteList = deleteList.bind(null, listId);
      const res = await handleDeleteList();

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success(`Successfully deleted "${listName}"`);
      setIsOpen(false);
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}

      <AlertDialogContent>
        <hgroup>
          <AlertDialogTitle>
            Are you sure you want to delete &quot;{listName}&quot;?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This list, and the food in it, will be{" "}
            <strong>permanently deleted</strong> from our database. You
            won&apos;t be able to recover it after.
          </AlertDialogDescription>
        </hgroup>

        <Form
          action="Delete"
          handleAction={handleAction}
          isPending={isPending}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function FormFields({
  list,
  isPending,
}: {
  list?: Tables<"lists">;
  isPending: boolean;
}) {
  return (
    <>
      <label>
        <small>Name</small>
        <input
          type="text"
          name="name"
          minLength={MIN_INPUT_LENGTH}
          maxLength={MAX_INPUT_LENGTH}
          placeholder="My list"
          defaultValue={list?.name}
          disabled={isPending}
          required
        />
      </label>

      <label>
        <small>Note</small>
        <textarea
          name="note"
          rows={TEXTAREA_ROWS}
          maxLength={MAX_TEXTAREA_LENGTH}
          defaultValue={list?.note}
          disabled={isPending}
        />
      </label>
    </>
  );
}
