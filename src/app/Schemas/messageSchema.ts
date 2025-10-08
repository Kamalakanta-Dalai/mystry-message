import { z } from "zod";

export const messageSchema = z.object({
  context: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(300, "Message mustn't be more than 300 characters"),
});
