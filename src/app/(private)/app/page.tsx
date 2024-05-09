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
import ReloadPage from "@/components/ReloadPage";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import styles from "@/styles/app.module.css";
import { ghostBtn, outlineBtn } from "@/styles/components/Button.module.css";
import { mono } from "@/styles/fonts";
import { getFoods, getList, getLists, getUser } from "@/utils/supabase/server";
import type { Tables } from "@/utils/supabase/types";
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
  if (!searchParams?.id) return;

  const { data: list, error } = await getList(searchParams?.id);
  if (error || !list) return;

  return { title: list.name };
}

export default async function App({ searchParams }: Props) {
  await getUser();

  return (
    <div className={styles.root}>
      <Sidebar listId={searchParams?.id}>
        <SidebarNav listId={searchParams?.id} />
      </Sidebar>

      <List listId={searchParams?.id} />
    </div>
  );
}

// Sidebar
type SidebarProps = {
  listId?: string;
  children: React.ReactNode;
};

async function Sidebar({ listId, children }: SidebarProps) {
  return (
    <aside className={clsx(styles.sidebar, !!listId && styles.hideSidebar)}>
      <h2>My lists</h2>

      <div className={styles.actionBar}>
        <CreateList />
      </div>

      {children}
    </aside>
  );
}

async function SidebarNav({ listId }: { listId?: string }) {
  const { data: lists, error } = await getLists();

  if (error) {
    return (
      <div className={styles.error}>
        <hgroup>
          <h3>Error</h3>

          <p>
            <small>{error.message}</small>
          </p>
        </hgroup>

        <ReloadPage />
      </div>
    );
  }

  if (!lists?.length) {
    return (
      <div className={styles.empty}>
        <hgroup>
          <h3>You have no lists... yet!</h3>

          <p>
            <small>Make a list and start managing your food with ease 😎</small>
          </p>
        </hgroup>
      </div>
    );
  }

  return (
    <nav>
      {lists.map((list) => (
        <Link
          key={list.id}
          href={`/app?id=${list.id}`}
          className={list.id !== listId ? ghostBtn : styles.activeList}
        >
          <span className={styles.truncate}>{list.name}</span>
        </Link>
      ))}
    </nav>
  );
}

// Current List
async function List({ listId }: { listId?: string }) {
  if (!listId) return;

  const { data: list, error } = await getList(listId);

  if (error) {
    return (
      <main key={listId} className={styles.list}>
        <div className={styles.error}>
          <hgroup>
            <h3>Error</h3>

            <p>
              <small>{error.message}</small>
            </p>
          </hgroup>

          <ReloadPage />
        </div>
      </main>
    );
  }

  return (
    <main key={listId} className={styles.list}>
      <div className={styles.listContainer}>
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

        <FoodList listId={listId} />
      </div>
    </main>
  );
}

// Food List
async function FoodList({ listId }: { listId: string }) {
  const { data: foods, error } = await getFoods(listId);

  if (error) {
    return (
      <div className={styles.error}>
        <hgroup>
          <h3>Error</h3>

          <p>
            <small>{error.message}</small>
          </p>
        </hgroup>

        <ReloadPage />
      </div>
    );
  }

  if (!foods?.length) {
    return (
      <div className={styles.empty}>
        <hgroup>
          <h3>Your list is empty 🥺</h3>

          <p>
            <small>Let&apos;s change that by adding some food!</small>
          </p>
        </hgroup>
      </div>
    );
  }

  return (
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
  );
}

dayjs.extend(relativeTime);
const daysUntilExpired = (date: string) => dayjs(date).diff(dayjs(), "day");

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

function ViewFood({ food }: { food: Tables<"foods"> }) {
  const expiredNotice = `${
    daysUntilExpired(food.expiration) < 0 ? "Expired" : "Expires"
  } ${dayjs(food.expiration).fromNow()}`;

  const details = [
    {
      Icon: IconCashBanknote,
      value: !!food.price
        ? `${formatCurrency(food.price)} ${food.price_unit}`
        : "N/A",
    },
    {
      Icon: IconBuildingStore,
      value: food.market.length ? food.market : "N/A",
    },
    {
      Icon: IconClock,
      value: !!food.expiration ? expiredNotice : "N/A",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger className={styles.foodDialogTrigger}>
        <span className={styles.truncate}>{food.name}</span>

        {!!food.expiration && daysUntilExpired(food.expiration) <= 7 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <IconClock
                size={16}
                className={clsx(
                  styles.foodExpiring,
                  daysUntilExpired(food.expiration) <= 1 && styles.foodExpired
                )}
              />
            </TooltipTrigger>

            <TooltipContent>
              <p>
                <small>{expiredNotice}</small>
              </p>
            </TooltipContent>
          </Tooltip>
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
