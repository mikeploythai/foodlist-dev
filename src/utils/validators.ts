import { z } from "zod";
import {
  MAX_INPUT_LENGTH,
  MAX_TEXTAREA_LENGTH,
  MIN_INPUT_LENGTH,
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
      `List name must be less than ${MAX_INPUT_LENGTH} characters`
    ),
  note: z
    .string()
    .max(
      MAX_TEXTAREA_LENGTH,
      `List note must be less than ${MAX_TEXTAREA_LENGTH} characters`
    ),
});
