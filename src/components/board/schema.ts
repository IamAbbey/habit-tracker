import { z } from "zod";
import { priorities } from "./data";

const PrioritySchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.any()
});
export type Priority = z.infer<typeof PrioritySchema>;

export const TaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  priority: z.preprocess((val, ctx) => {
    const priorityIsString = typeof val === "string"

    if (priorityIsString) {
      const priority = priorities.find(
        (priority) => priority.value === val
      );

      if (!priority) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Not a valid priority",
        });

        // This is a special symbol you can use to
        // return early from the transform function.
        // It has type `never` so it does not affect the
        // inferred return type.
        return z.NEVER;
      }

      return priority
    }

    return val;

  }, PrioritySchema.default(priorities[1])),
  goal: z.number().default(31),
  taskState: z.array(z.boolean()).default(Array(31).fill(false)),
});

export type Task = z.infer<typeof TaskSchema>;
