import { apiClient } from "../client";
import {
  currentUserResponseSchema,
  loginUserResponseSchema,
  registerUserResponseSchema,
} from "@/server/schemas/users/user";
import type {
  CurrentUserResponse,
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  UserImageUploadRequest,
} from "@/server/schemas/users/user";

export async function registerUser(
  payload: RegisterUserRequest,
): Promise<RegisterUserResponse> {
  const response = await apiClient<unknown, RegisterUserRequest>(
    "/api/v1/users/register",
    {
      method: "POST",
      body: payload,
    },
  );

  return registerUserResponseSchema.parse(response);
}

export async function loginUser(
  payload: LoginUserRequest,
): Promise<LoginUserResponse> {
  const response = await apiClient<unknown, LoginUserRequest>(
    "/api/v1/users/login",
    {
      method: "POST",
      body: payload,
    },
  );

  return loginUserResponseSchema.parse(response);
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const response = await apiClient<unknown>(
    "/api/v1/users/me",
    {
      method: "GET",
    },
  );

  return currentUserResponseSchema.parse(response);
}

export async function getUserImage<TResponse = Blob>(): Promise<TResponse> {
  return apiClient<TResponse>("/api/v1/users/image", {
    method: "GET",
    headers: { Accept: "image/*" },
  });
}

export async function uploadUserImage<TResponse = unknown>(
  payload: UserImageUploadRequest,
): Promise<TResponse> {
  const body = new FormData();
  body.append("File", payload.File);

  return apiClient<TResponse>("/api/v1/users/image", {
    method: "PUT",
    body,
  });
}
