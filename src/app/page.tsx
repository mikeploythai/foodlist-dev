import { AlertDialogTrigger } from "@/components/AlertDialog";
import { DialogTrigger } from "@/components/Dialog";
import { DropdownItem } from "@/components/Dropdown";
import { ghostBtn } from "@/styles/components/Button.module.css";
import { mono } from "@/styles/fonts";
import {
  foodAction,
  foodActions,
  foodDialogAction,
  foodEmpty,
  foodExpired,
  foodExpiring,
  foodLow,
} from "@/styles/food.module.css";
import styles from "@/styles/page.module.css";
import { daysUntilExpired } from "@/utils/daysUntilExpired";
import { tempFoods, tempLists } from "@/utils/temp-db";
import { IconClock, IconPencil, IconTrash } from "@tabler/icons-react";
import clsx from "clsx";
import Link from "next/link";
import {
  AddFoodAction,
  DeleteFoodAction,
  EditFoodAction,
  FoodActionMenu,
  ViewFoodAction,
} from "./_components/FoodActions";
import {
  DeleteListAction,
  EditListAction,
  ListActionMenu,
  NewListAction,
} from "./_components/ListActions";

export default function Home({
  searchParams,
}: {
  searchParams?: { id?: string };
}) {
  return (
    <div className={styles.root}>
      <Sidebar listId={searchParams?.id} />
      <CurrentList listId={searchParams?.id} />
    </div>
  );
}

function Sidebar({ listId }: { listId?: string }) {
  return (
    <aside className={clsx(styles.sidebar, !!listId && styles.hidden)}>
      <h2>My lists</h2>

      <div className={styles.actions}>
        <NewListAction />
      </div>

      <nav>
        {tempLists.map((list) => (
          <Link
            key={list.id}
            href={`/?id=${list.id}`}
            className={list.id !== listId ? ghostBtn : styles.activeList}
          >
            <span className={styles.actionLabel}>{list.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function CurrentList({ listId }: { listId?: string }) {
  if (!listId) return;

  const list = tempLists.filter(({ id }) => id === listId)[0];
  const foods = tempFoods.filter(({ list_id }) => list_id === listId);

  return (
    <main key={listId} className={styles.currentList}>
      <hgroup>
        <h1>{list.name}</h1>
        {!!list.note && <p>{list.note}</p>}
      </hgroup>

      <div className={styles.actions}>
        <AddFoodAction />

        <ListActionMenu>
          <EditListAction list={list}>
            <DropdownItem className={ghostBtn} asChild>
              <DialogTrigger>
                Edit list <IconPencil size={16} />
              </DialogTrigger>
            </DropdownItem>
          </EditListAction>

          <DeleteListAction listId={listId} listName={list.name}>
            <DropdownItem className={ghostBtn} asChild>
              <AlertDialogTrigger>
                Delete list <IconTrash size={16} />
              </AlertDialogTrigger>
            </DropdownItem>
          </DeleteListAction>
        </ListActionMenu>
      </div>

      <ol className={foodActions}>
        {foods.map((food) => (
          <li key={food.id} className={foodAction}>
            <button className={ghostBtn}>
              <strong
                className={clsx(
                  mono.className,
                  food.quantity <= 5 && foodLow,
                  food.quantity <= 1 && foodEmpty
                )}
              >
                {String(food.quantity).padStart(2)}x
              </strong>
            </button>

            <ViewFoodAction food={food}>
              <DialogTrigger className={foodDialogAction}>
                <span className={styles.actionLabel}>{food.name}</span>
                {!!food.expiration &&
                  daysUntilExpired(food.expiration) <= 7 && (
                    <IconClock
                      size={16}
                      className={clsx(
                        foodExpiring,
                        daysUntilExpired(food.expiration) <= 1 && foodExpired
                      )}
                    />
                  )}
              </DialogTrigger>
            </ViewFoodAction>

            <FoodActionMenu>
              <EditFoodAction food={food}>
                <DropdownItem className={ghostBtn} asChild>
                  <DialogTrigger>
                    Edit food <IconPencil size={16} />
                  </DialogTrigger>
                </DropdownItem>
              </EditFoodAction>

              <DeleteFoodAction foodId={food.id} foodName={food.name}>
                <DropdownItem className={ghostBtn} asChild>
                  <AlertDialogTrigger>
                    Delete food <IconTrash size={16} />
                  </AlertDialogTrigger>
                </DropdownItem>
              </DeleteFoodAction>
            </FoodActionMenu>
          </li>
        ))}
      </ol>
    </main>
  );
}
