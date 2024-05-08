import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/AlertDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/Dropdown";
import {
  dangerBtn,
  outlineBtn,
  secondaryBtn,
} from "@/styles/components/Button.module.css";
import { columns } from "@/styles/components/Dialog.module.css";
import styles from "@/styles/list.module.css";
import {
  MAX_INPUT_LENGTH,
  MAX_TEXTAREA_LENGTH,
  MIN_INPUT_LENGTH,
  TEXTAREA_ROWS,
} from "@/utils/constants";
import { tempLists } from "@/utils/temp-db";
import { IconDots, IconPlus } from "@tabler/icons-react";

export function NewListAction() {
  const actionLabel = "New list";

  return (
    <Dialog>
      <DialogTrigger className={secondaryBtn}>
        {actionLabel} <IconPlus size={16} />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>{actionLabel}</DialogTitle>

        <form>
          <ListFields />

          <div className={columns}>
            <DialogClose className={outlineBtn}>Cancel</DialogClose>

            <button type="submit" className={secondaryBtn}>
              Create
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditListAction({
  list,
  children,
}: {
  list: (typeof tempLists)[0];
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      {children}

      <DialogContent>
        <DialogTitle>Edit list</DialogTitle>

        <form>
          <ListFields list={list} />

          <div className={columns}>
            <DialogClose className={outlineBtn}>Cancel</DialogClose>

            <button type="submit" className={secondaryBtn}>
              Update
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteListAction({
  listId,
  listName,
  children,
}: {
  listId: string;
  listName: string;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      {children}

      <AlertDialogContent>
        <hgroup>
          <AlertDialogTitle>
            Are you sure you want to delete "{listName}"?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This list, and the food in it, will be{" "}
            <strong>permanently deleted</strong> from our database. You
            won&apos;t be able to recover it after.
          </AlertDialogDescription>
        </hgroup>

        <form>
          <div className={columns}>
            <AlertDialogCancel className={outlineBtn}>Cancel</AlertDialogCancel>

            <AlertDialogAction type="submit" className={dangerBtn}>
              Delete
            </AlertDialogAction>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ListActionMenu({ children }: { children: React.ReactNode }) {
  return (
    <Dropdown>
      <DropdownTrigger
        aria-label="List action menu"
        className={styles.listActionTrigger}
      >
        <IconDots size={16} />
      </DropdownTrigger>

      <DropdownContent>{children}</DropdownContent>
    </Dropdown>
  );
}

function ListFields({ list }: { list?: (typeof tempLists)[0] }) {
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
        />
      </label>
    </>
  );
}
