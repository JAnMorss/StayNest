import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string()
});

export type RegisterUserRequest = z.infer<typeof registerSchema>;
