import { apiClient } from "./client";
import type { RegisterUserRequest } from "@/server/schemas/user";

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
