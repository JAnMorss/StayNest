import { apiClient } from "./client";
import type {
  LoginUserRequest,
  RegisterUserRequest,
} from "@/server/schemas/user";

export interface RegisterUserResponseData {
  id: string;
  firstName: string;
  lastName: string;
  image: string | null;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface RegisterUserResponse {
  data: RegisterUserResponseData;
  message: string;
}

export interface LoginUserResponseData {
  accessToken: string;
}

export interface LoginUserResponse {
  data: LoginUserResponseData;
  message: string;
}

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
  return apiClient<LoginUserResponse, LoginUserRequest>("/api/v1/users/login", {
    method: "POST",
    body: payload,
  });
}
