import { apiClient } from "../client";
import type {
  LoginUserRequest,
  RegisterUserRequest,
  UserImageUploadRequest,
} from "@/server/schemas/users/user";
import type {
  CurrentUserResponse,
  LoginUserResponse,
  RegisterUserResponse,
} from "@/server/types/users/user";

export type {
  CurrentUserResponse,
  LoginUserResponse,
  RegisterUserResponse,
} from "@/server/types/users/user";

export async function registerUser(
  payload: RegisterUserRequest,
): Promise<RegisterUserResponse> {
  return apiClient<RegisterUserResponse, RegisterUserRequest>(
    "/api/v1/users/register",
    {
      method: "POST",
      body: payload,
    },
  );
}

export async function loginUser(
  payload: LoginUserRequest,
): Promise<LoginUserResponse> {
  return apiClient<LoginUserResponse, LoginUserRequest>(
    "/api/v1/users/login",
    {
      method: "POST",
      body: payload,
    },
  );
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  return apiClient<CurrentUserResponse>(
    "/api/v1/users/me",
    {
      method: "GET",
    },
  );
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
