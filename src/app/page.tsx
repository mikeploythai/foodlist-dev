import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
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
  DropdownItem,
  DropdownTrigger,
} from "@/components/Dropdown";
import {
  dangerBtn,
  ghostBtn,
  outlineBtn,
  primaryBtn,
  secondaryBtn,
} from "@/styles/components/Button.module.css";
import { mono } from "@/styles/fonts";
import styles from "@/styles/page.module.css";
import { tempFoods, tempLists } from "@/utils/temp-db";
import {
  IconClock,
  IconDots,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

export default function Home({
  searchParams,
}: {
  searchParams?: { id?: string };
}) {
  return (
    <div className={styles.root}>
      <Sidebar currentListId={searchParams?.id} />
      <CurrentList currentListId={searchParams?.id} />
    </div>
  );
}

function Sidebar({ currentListId }: { currentListId?: string }) {
  return (
    <aside className={clsx(styles.sidebar, !!currentListId && styles.hidden)}>
      <h2>My lists</h2>

      <div className={styles.actions}>
        <NewListAction />
      </div>

      <nav>
        {tempLists.map((list) => (
          <Link
            key={list.id}
            href={`/?id=${list.id}`}
            className={list.id !== currentListId ? ghostBtn : styles.activeList}
          >
            <span className={styles.actionLabel}>{list.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function NewListAction() {
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

          <div form-container="actions">
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

function ListFields({ list }: { list?: (typeof tempLists)[0] }) {
  return (
    <>
      <label>
        <small>Name</small>

        <input
          type="text"
          minLength={2}
          maxLength={80}
          placeholder="My list"
          defaultValue={list?.name}
          required
        />
      </label>

      <label>
        <small>Note</small>

        <textarea rows={6} maxLength={320} defaultValue={list?.note} />
      </label>
    </>
  );
}

dayjs.extend(relativeTime);
const daysUntilExpired = (date: string) => dayjs(date).diff(dayjs(), "day");

function CurrentList({ currentListId }: { currentListId?: string }) {
  if (!currentListId) return;

  const list = tempLists.filter(({ id }) => id === currentListId)[0];
  const foods = tempFoods.filter(({ list_id }) => list_id === currentListId);

  return (
    <main key={currentListId} className={styles.currentList}>
      <div className={styles.currentListContainer}>
        <hgroup>
          <h1>{list.name}</h1>
          {!!list.note && <p>{list.note}</p>}
        </hgroup>

        <div className={styles.actions}>
          <button className={primaryBtn}>
            Add food <IconPlus size={16} />
          </button>

          <ListActionMenu>
            <EditListAction currentListId={currentListId}>
              <DropdownItem className={ghostBtn} asChild>
                <DialogTrigger>
                  Edit list <IconPencil size={16} />
                </DialogTrigger>
              </DropdownItem>
            </EditListAction>

            <DeleteListAction currentListId={currentListId}>
              <DropdownItem className={ghostBtn} asChild>
                <AlertDialogTrigger>
                  Delete list <IconTrash size={16} />
                </AlertDialogTrigger>
              </DropdownItem>
            </DeleteListAction>
          </ListActionMenu>
        </div>

        <ol className={styles.foodActions}>
          {foods.map((food) => (
            <li key={food.id} className={styles.foodAction}>
              <button className={ghostBtn}>
                <strong
                  className={clsx(
                    mono.className,
                    food.quantity <= 5 && styles.foodLow,
                    food.quantity <= 1 && styles.foodEmpty
                  )}
                >
                  {String(food.quantity).padStart(2)}x
                </strong>
              </button>

              <button className={styles.foodDialogAction}>
                <span className={styles.actionLabel}>{food.name}</span>
                {!!food.expires_at &&
                  daysUntilExpired(food.expires_at) <= 7 && (
                    <IconClock
                      size={16}
                      className={clsx(
                        styles.foodExpiring,
                        daysUntilExpired(food.expires_at) <= 1 &&
                          styles.foodExpired
                      )}
                    />
                  )}
              </button>

              <button aria-label="Food options" className={ghostBtn}>
                <IconDots size={16} />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}

function ListActionMenu({ children }: { children: React.ReactNode }) {
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

function EditListAction({
  currentListId,
  children,
}: {
  currentListId: string;
  children: React.ReactNode;
}) {
  const list = tempLists.filter(({ id }) => id === currentListId)[0];

  return (
    <Dialog>
      {children}

      <DialogContent>
        <DialogTitle>Edit list</DialogTitle>

        <form>
          <ListFields list={list} />

          <div form-container="actions">
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

function DeleteListAction({
  currentListId,
  children,
}: {
  currentListId: string;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      {children}

      <AlertDialogContent>
        <hgroup>
          <AlertDialogTitle>
            Are you sure you want to delete this list?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This list, and the food in it, will be{" "}
            <strong>permanently deleted</strong> from our servers. You
            won&apos;t be able to recover it after.
          </AlertDialogDescription>
        </hgroup>

        <form>
          <div form-container="actions">
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
