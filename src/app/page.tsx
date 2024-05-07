import {
  ghostBtn,
  outlineBtn,
  primaryBtn,
  secondaryBtn,
} from "@/styles/components/Button.module.css";
import { mono } from "@/styles/fonts";
import styles from "@/styles/page.module.css";
import { tempFoods, tempLists } from "@/utils/temp-db";
import { IconDots, IconPlus } from "@tabler/icons-react";
import clsx from "clsx";
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
        <button className={secondaryBtn}>
          New list <IconPlus size={16} />
        </button>
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

          <button aria-label="List options" className={outlineBtn}>
            <IconDots size={16} />
          </button>
        </div>

        <ul className={styles.foodActions}>
          {foods.map((food) => (
            <li key={food.id} className={styles.foodAction}>
              <button className={ghostBtn}>
                <strong className={mono.className}>
                  {String(food.quantity).padStart(2)}x
                </strong>
              </button>

              <button className={styles.foodDialogAction}>
                <span className={styles.actionLabel}>{food.name}</span>
                {/* <IconHourglassLow size={16} /> */}
              </button>

              <button aria-label="Food options" className={ghostBtn}>
                <IconDots size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
