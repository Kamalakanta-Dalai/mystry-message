import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "username must be at least 3 characters")
  .max(20, "username mustn't be more than 20 characters")
  .regex(/^[a-zA-Z0-9]+$/, "username must be alphanumeric")
  .trim()
  .toLowerCase();

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(6, { message: "Password must be more than 6 characters" })
    .max(8, { message: "Password mustn't be more than 8 characters" }),
});
