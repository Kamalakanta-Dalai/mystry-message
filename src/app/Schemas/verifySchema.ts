import { z } from "zod";

export const verifySchema = z.object({
  verifyCode: z.string().length(6, "Verify Code must be of 6 digits"),
});
