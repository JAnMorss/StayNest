"use client";

import { useMutation } from "@tanstack/react-query";

import { ApiError } from "@/server/api/client";
import { registerUser, type RegisterUserResponse } from "@/server/api/users";
import type { RegisterUserRequest } from "@/server/schemas/user";

export function useRegisterUser() {
  return useMutation<RegisterUserResponse, ApiError, RegisterUserRequest>({
    mutationFn: registerUser,
  });
}
