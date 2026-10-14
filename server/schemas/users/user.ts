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

export const userImageUploadSchema = z.object({
  File: z.custom<File>(
    (value) => typeof File !== "undefined" && value instanceof File,
    "An image file is required.",
  ),
});

export const userProfileSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  image: z.string().nullable(),
  email: z.string().trim().email("Please enter a valid email address"),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export const currentUserResponseSchema = z.object({
  data: userProfileSchema,
  message: z.string(),
});

export const registerUserResponseSchema = currentUserResponseSchema;

export const loginUserResponseSchema = z.object({
  data: z.object({
    accessToken: z.string(),
  }),
  message: z.string(),
});

export type RegisterUserRequest = z.infer<typeof registerSchema>;
export type LoginUserRequest = z.infer<typeof loginSchema>;
export type UserImageUploadRequest = z.infer<typeof userImageUploadSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type CurrentUserResponse = z.infer<typeof currentUserResponseSchema>;
export type RegisterUserResponse = z.infer<typeof registerUserResponseSchema>;
export type LoginUserResponse = z.infer<typeof loginUserResponseSchema>;
