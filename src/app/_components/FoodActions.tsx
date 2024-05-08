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
  DialogDescription,
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
  primaryBtn,
  secondaryBtn,
} from "@/styles/components/Button.module.css";
import { columns } from "@/styles/components/Dialog.module.css";
import { mono } from "@/styles/fonts";
import styles from "@/styles/food.module.css";
import {
  MAX_INPUT_LENGTH,
  MAX_PRICE,
  MAX_QUANTITY,
  MAX_TEXTAREA_LENGTH,
  MIN_INPUT_LENGTH,
  MIN_PRICE,
  MIN_QUANTITY,
  PRICE_UNITS,
  TEXTAREA_ROWS,
} from "@/utils/constants";
import { daysUntilExpired } from "@/utils/daysUntilExpired";
import { tempFoods, tempLists } from "@/utils/temp-db";
import {
  IconBuildingStore,
  IconCashBanknote,
  IconClock,
  IconDots,
  IconPlus,
} from "@tabler/icons-react";
import clsx from "clsx";
import dayjs from "dayjs";

export function AddFoodAction() {
  const actionLabel = "Add food";

  return (
    <Dialog>
      <DialogTrigger className={primaryBtn}>
        {actionLabel} <IconPlus size={16} />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>{actionLabel}</DialogTitle>

        <form>
          <FoodFields />

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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export function ViewFoodAction({
  food,
  children,
}: {
  food: (typeof tempFoods)[0];
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      {children}

      <DialogContent>
        <hgroup>
          <DialogTitle>
            <strong
              className={clsx(
                mono.className,
                food.quantity <= 5 && styles.foodLow,
                food.quantity <= 1 && styles.foodEmpty
              )}
            >
              {String(food.quantity).padStart(2)}x
            </strong>{" "}
            {food.name}
          </DialogTitle>
          {!!food.note && <DialogDescription>{food.note}</DialogDescription>}
        </hgroup>

        <div className={styles.foodDialogDetails}>
          <h3>
            <small>Details</small>
          </h3>

          <ul>
            <li>
              <IconCashBanknote size={16} />
              <p>
                {!!food.price
                  ? `${formatCurrency(food.price)} ${food.price_unit}`
                  : "N/A"}
              </p>
            </li>

            <li>
              <IconBuildingStore size={16} />
              <p>{food.market ?? "N/A"}</p>
            </li>

            <li>
              <IconClock size={16} />{" "}
              <p>
                {!!food.expiration
                  ? `${
                      daysUntilExpired(food.expiration) < 0
                        ? "Expired"
                        : "Expires"
                    } ${dayjs(food.expiration).fromNow()}`
                  : "N/A"}
              </p>
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EditFoodAction({
  food,
  children,
}: {
  food: (typeof tempFoods)[0];
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      {children}

      <DialogContent>
        <DialogTitle>Edit food</DialogTitle>

        <form>
          <FoodFields food={food} />

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

export function DeleteFoodAction({
  foodId,
  foodName,
  children,
}: {
  foodId: string;
  foodName: string;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      {children}

      <AlertDialogContent>
        <hgroup>
          <AlertDialogTitle>
            Are you sure you want to delete "{foodName}"?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This food will be <strong>permanently deleted</strong> from this
            list and our database. You won&apos;t be able to recover it after.
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

export function FoodActionMenu({ children }: { children: React.ReactNode }) {
  return (
    <Dropdown>
      <DropdownTrigger
        aria-label="Food action menu"
        className={styles.foodMenuTrigger}
      >
        <IconDots size={16} />
      </DropdownTrigger>

      <DropdownContent>{children}</DropdownContent>
    </Dropdown>
  );
}

function FoodFields({ food }: { food?: (typeof tempFoods)[0] }) {
  return (
    <>
      <label>
        <small>Name</small>

        <input
          type="text"
          name="name"
          minLength={MIN_INPUT_LENGTH}
          maxLength={MAX_INPUT_LENGTH}
          placeholder="Apples"
          defaultValue={food?.name}
          required
        />
      </label>

      {!!food?.list_id && (
        <label>
          <small>List</small>

          <select name="list_id" defaultValue={food.list_id}>
            {tempLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <label>
        <small>Quantity</small>

        <input
          type="number"
          name="quantity"
          min={MIN_QUANTITY}
          max={MAX_QUANTITY}
          placeholder="3"
          defaultValue={food?.quantity}
          required
        />
      </label>

      <label>
        <small>Market</small>

        <input
          type="text"
          name="market"
          maxLength={MAX_INPUT_LENGTH}
          placeholder="Trader Bros."
          defaultValue={food?.market}
        />
      </label>

      <div className={columns}>
        <label>
          <small>Price (USD)</small>

          <input
            type="number"
            name="price"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={0.01}
            defaultValue={food?.price}
          />
        </label>

        <label>
          <small>Price Unit</small>

          <select name="price_unit" defaultValue={food?.price_unit}>
            {PRICE_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        <small>Expiration</small>

        <input type="date" name="expiration" defaultValue={food?.expiration} />
      </label>

      <label>
        <small>Note</small>

        <textarea
          name="note"
          rows={TEXTAREA_ROWS}
          maxLength={MAX_TEXTAREA_LENGTH}
          defaultValue={food?.note}
        />
      </label>
    </>
  );
}
