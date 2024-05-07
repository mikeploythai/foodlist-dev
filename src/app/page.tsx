import styles from "@/styles/page.module.css";
import { tempFoods, tempLists } from "@/utils/temp-db";
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
        <button>New list</button>
      </div>

      <nav>
        {tempLists.map((list) => (
          <Link key={list.id} href={`/?id=${list.id}`}>
            {list.name}
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
          <button>New list</button>
          <button>Edit list</button>
        </div>

        <ul>
          {foods.map((food) => (
            <li key={food.id}>
              <button>
                <strong>{food.quantity}x</strong>
              </button>

              <button>
                <span>{food.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
