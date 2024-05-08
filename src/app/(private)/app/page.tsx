import { AlertDialogTrigger } from "@/components/AlertDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  CreateFood,
  DeleteFood,
  EditFood,
  FoodQuantity,
} from "@/components/FoodActions";
import { CreateList, DeleteList, EditList } from "@/components/ListActions";
import styles from "@/styles/app.module.css";
import { ghostBtn, outlineBtn } from "@/styles/components/Button.module.css";
import { mono } from "@/styles/fonts";
import { tempFoods, tempLists } from "@/utils/temp-db";
import {
  IconBuildingStore,
  IconCashBanknote,
  IconClock,
  IconDots,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

type Props = {
  searchParams?: { id?: string };
};

export async function generateMetadata({ searchParams }: Props) {
  const list = tempLists.filter(({ id }) => id === searchParams?.id)[0];
  if (!list) return;

  return { title: list.name };
}

export default function App({ searchParams }: Props) {
  return (
    <div className={styles.root}>
      <aside
        className={clsx(
          styles.sidebar,
          !!searchParams?.id && styles.hideSidebar
        )}
      >
        <h2>My lists</h2>

        <div className={styles.actionBar}>
          <CreateList />
        </div>

        <nav>
          {tempLists.map((list) => (
            <Link
              key={list.id}
              href={`/app?id=${list.id}`}
              className={
                list.id !== searchParams?.id ? ghostBtn : styles.activeList
              }
            >
              <span className={styles.truncate}>{list.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <List listId={searchParams?.id} />
    </div>
  );
}

function List({ listId }: { listId?: string }) {
  if (!listId) return;

  const list = tempLists.filter(({ id }) => id === listId)[0];
  const foods = tempFoods.filter(({ list_id }) => list_id === listId);

  return (
    <main key={listId} className={styles.list}>
      <hgroup>
        <h1>{list.name}</h1>
        {!!list.note && <p>{list.note}</p>}
      </hgroup>

      <div className={styles.actionBar}>
        <CreateFood />

        <Dropdown>
          <DropdownTrigger aria-label="List menu" className={outlineBtn}>
            <IconDots size={16} />
          </DropdownTrigger>

          <DropdownContent>
            <EditList list={list}>
              <DropdownItem className={ghostBtn} asChild>
                <DialogTrigger>
                  Edit list <IconPencil size={16} />
                </DialogTrigger>
              </DropdownItem>
            </EditList>

            <DeleteList listId={list.id} listName={list.name}>
              <DropdownItem className={ghostBtn} asChild>
                <AlertDialogTrigger>
                  Delete list <IconTrash size={16} />
                </AlertDialogTrigger>
              </DropdownItem>
            </DeleteList>
          </DropdownContent>
        </Dropdown>
      </div>

      <ol className={styles.foodList}>
        {foods.map((food) => (
          <li key={food.id}>
            <FoodQuantity quantity={food.quantity} />
            <ViewFood food={food} />

            <Dropdown>
              <DropdownTrigger
                aria-label="Food actions dropdown"
                className={ghostBtn}
              >
                <IconDots size={16} />
              </DropdownTrigger>

              <DropdownContent>
                <EditFood food={food}>
                  <DropdownItem className={ghostBtn} asChild>
                    <DialogTrigger>
                      Edit food <IconPencil size={16} />
                    </DialogTrigger>
                  </DropdownItem>
                </EditFood>

                <DeleteFood foodId={food.id} foodName={food.name}>
                  <DropdownItem className={ghostBtn} asChild>
                    <AlertDialogTrigger>
                      Delete food <IconTrash size={16} />
                    </AlertDialogTrigger>
                  </DropdownItem>
                </DeleteFood>
              </DropdownContent>
            </Dropdown>
          </li>
        ))}
      </ol>
    </main>
  );
}

dayjs.extend(relativeTime);
const daysUntilExpired = (date: string) => dayjs(date).diff(dayjs(), "day");

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

function ViewFood({ food }: { food: (typeof tempFoods)[0] }) {
  const details = [
    {
      Icon: IconCashBanknote,
      value: !!food.price
        ? `${formatCurrency(food.price)} ${food.price_unit}`
        : "N/A",
    },
    {
      Icon: IconBuildingStore,
      value: food.market ?? "N/A",
    },
    {
      Icon: IconClock,
      value: !!food.expiration
        ? `${
            daysUntilExpired(food.expiration) < 0 ? "Expired" : "Expires"
          } ${dayjs(food.expiration).fromNow()}`
        : "N/A",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger className={styles.foodDialogTrigger}>
        <span className={styles.truncate}>{food.name}</span>

        {!!food.expiration && daysUntilExpired(food.expiration) <= 7 && (
          <IconClock
            size={16}
            className={clsx(
              styles.foodExpiring,
              daysUntilExpired(food.expiration) <= 1 && styles.foodExpired
            )}
          />
        )}
      </DialogTrigger>

      <DialogContent>
        <hgroup>
          <DialogTitle>
            <strong
              className={clsx(
                mono.className,
                food.quantity <= 5 && styles.foodQuantityLow,
                food.quantity <= 1 && styles.foodQuantityEmpty
              )}
            >
              {String(food.quantity).padStart(2)}x
            </strong>{" "}
            {food.name}
          </DialogTitle>

          {!!food.note && <DialogDescription>{food.note}</DialogDescription>}
        </hgroup>

        <div className={styles.foodDetails}>
          <h3>
            <small>Details</small>
          </h3>

          <ul>
            {details.map(({ Icon, value }, i) => (
              <li key={`details-${i}`}>
                <Icon size={16} /> {value}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
