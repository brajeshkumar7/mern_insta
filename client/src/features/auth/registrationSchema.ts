import { z } from "zod";

export const schema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }).max(20),
    lastName: z.string(),
    email: z.string().min(1, { message: "Email is required" }).email(),
    password: z.string().min(6, { message: "Password must contain at least 6 character(s)" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password must contain at least 6 character(s)" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
