"use client";

import {
  foodQuantity,
  foodQuantityEmpty,
  foodQuantityLow,
} from "@/styles/app.module.css";
import { primaryBtn } from "@/styles/components/Button.module.css";
import { columns } from "@/styles/components/Dialog.module.css";
import { mono } from "@/styles/fonts";
import {
  createFood,
  decreaseQuantity,
  deleteFood,
  updateFood,
} from "@/utils/actions";
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
import type { Tables } from "@/utils/supabase/types";
import { validateFood } from "@/utils/validators";
import { IconPlus } from "@tabler/icons-react";
import clsx from "clsx";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "./AlertDialog";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./Dialog";
import Form from "./Form";

export function CreateFood({
  listId,
  listName,
}: {
  listId: string;
  listName: string;
}) {
  const label = "Add food";
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAction(formData: FormData) {
    startTransition(async () => {
      const data = Object.fromEntries(formData);
      const validated = validateFood.safeParse(data);

      if (!validated.success) {
        for (const { message: error } of validated.error.issues)
          toast.error(error);
        return;
      }

      const handleCreateFood = createFood.bind(null, listId);
      const res = await handleCreateFood(validated.data);
      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success(`Successfully created "${res.foodName}" in "${listName}"`);
      setIsOpen(false);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className={primaryBtn}>
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

export function EditFood({
  food,
  listName,
  children,
}: {
  food: Tables<"foods">;
  listName: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAction(formData: FormData) {
    startTransition(async () => {
      const data = Object.fromEntries(formData);

      // Check if data is different from og data later

      const validated = validateFood.safeParse(data);

      if (!validated.success) {
        for (const { message: error } of validated.error.issues)
          toast.error(error);
        return;
      }

      const handleUpdateFood = updateFood.bind(null, food.id, food.listId);
      const res = await handleUpdateFood(validated.data);
      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success(`Successfully updated "${res.foodName}" in "${listName}"`);
      setIsOpen(false);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}

      <DialogContent>
        <DialogTitle>Editing food</DialogTitle>

        <Form action="Update" handleAction={handleAction} isPending={isPending}>
          <FormFields food={food} isPending={isPending} />
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteFood({
  foodId,
  foodName,
  listId,
  listName,
  children,
}: {
  foodId: string;
  foodName: string;
  listId: string;
  listName: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAction(formData: FormData) {
    startTransition(async () => {
      const handleDeleteFood = deleteFood.bind(null, foodId, listId);
      const res = await handleDeleteFood();

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success(`Successfully deleted "${foodName}" from "${listName}"`);
      setIsOpen(false);
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}

      <AlertDialogContent>
        <hgroup>
          <AlertDialogTitle>
            Are you sure you want to delete "{foodName}"?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This food will be <strong>permanently deleted</strong> from the list
            and our database. You won&apos;t be able to recover it after.
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

export function FoodQuantity({
  quantity,
  foodId,
  listId,
}: {
  quantity: number;
  foodId: string;
  listId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticQuantity, decreaseOptimisticQuantity] = useOptimistic(
    quantity,
    (currentQuantity) => currentQuantity - 1
  );

  function handleAction() {
    startTransition(async () => {
      decreaseOptimisticQuantity(null);
      const handleDecreaseQuantity = decreaseQuantity.bind(
        null,
        quantity - 1,
        foodId,
        listId
      );

      const res = await handleDecreaseQuantity();
      if (res?.error) {
        toast.error(res.error);
        return;
      }
    });
  }

  return (
    <form action={handleAction}>
      <button
        disabled={isPending || optimisticQuantity === 0}
        className={foodQuantity}
      >
        <strong
          className={clsx(
            mono.className,
            optimisticQuantity <= 5 && foodQuantityLow,
            optimisticQuantity <= 1 && foodQuantityEmpty
          )}
        >
          {String(optimisticQuantity).padStart(2)}x
        </strong>
      </button>
    </form>
  );
}

function FormFields({
  food,
  isPending,
}: {
  food?: Tables<"foods">;
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
          placeholder="Apples"
          defaultValue={food?.name}
          disabled={isPending}
          required
        />
      </label>

      {/* {!!food?.listId && (
        <label>
          <small>List</small>

          <select name="listId" defaultValue={food.listId} disabled={isPending}>
            {lists?.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </label>
      )} */}

      <label>
        <small>Quantity</small>
        <input
          type="number"
          name="quantity"
          min={MIN_QUANTITY}
          max={MAX_QUANTITY}
          placeholder="3"
          defaultValue={food?.quantity}
          disabled={isPending}
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
          disabled={isPending}
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
            defaultValue={food?.price ?? undefined}
            disabled={isPending}
          />
        </label>

        <label>
          <small>Price Unit</small>
          <select
            name="price_unit"
            defaultValue={food?.price_unit}
            disabled={isPending}
          >
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
        <input
          type="date"
          name="expiration"
          defaultValue={food?.expiration}
          disabled={isPending}
        />
      </label>

      <label>
        <small>Note</small>
        <textarea
          name="note"
          rows={TEXTAREA_ROWS}
          maxLength={MAX_TEXTAREA_LENGTH}
          defaultValue={food?.note}
          disabled={isPending}
        />
      </label>
    </>
  );
}
