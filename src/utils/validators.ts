import { z } from "zod";
import {
  MAX_INPUT_LENGTH,
  MAX_PRICE,
  MAX_QUANTITY,
  MAX_TEXTAREA_LENGTH,
  MIN_INPUT_LENGTH,
  MIN_PRICE,
  MIN_QUANTITY,
  PRICE_UNITS,
} from "./constants";

export const validateList = z.object({
  name: z
    .string()
    .min(
      MIN_INPUT_LENGTH,
      `List name must be at least ${MIN_INPUT_LENGTH} characters`
    )
    .max(
      MAX_INPUT_LENGTH,
      `List name must be at most ${MAX_INPUT_LENGTH} characters`
    ),
  note: z
    .string()
    .max(
      MAX_TEXTAREA_LENGTH,
      `List note must be at most ${MAX_TEXTAREA_LENGTH} characters`
    ),
});

export const validateFood = z.object({
  name: z
    .string()
    .min(
      MIN_INPUT_LENGTH,
      `Food name must be at least ${MIN_INPUT_LENGTH} characters`
    )
    .max(
      MAX_INPUT_LENGTH,
      `Food name must be at most ${MAX_INPUT_LENGTH} characters`
    ),
  quantity: z.coerce
    .number()
    .int()
    .min(MIN_QUANTITY, `Food quantity must be at least ${MIN_QUANTITY}`)
    .max(MAX_QUANTITY, `Food quantity must be at most ${MAX_QUANTITY}`),
  market: z
    .string()
    .max(
      MAX_INPUT_LENGTH,
      `Food market must be at most ${MAX_INPUT_LENGTH} characters`
    ),
  price: z.coerce
    .number()
    .multipleOf(0.01)
    .min(MIN_PRICE, `Food prices must be at least $${MIN_PRICE}`)
    .max(MAX_PRICE, `Food prices must be at most $${MAX_PRICE}`)
    .transform((price) => (price === 0 ? null : price)),
  price_unit: z.enum(PRICE_UNITS),
  expiration: z.string().length(0).or(z.string().date()),
  note: z
    .string()
    .max(
      MAX_TEXTAREA_LENGTH,
      `Food note must be at most ${MAX_TEXTAREA_LENGTH} characters`
    ),
});
