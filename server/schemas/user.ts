import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterUserRequest = z.infer<typeof registerSchema>;
export type LoginUserRequest = z.infer<typeof loginSchema>;
