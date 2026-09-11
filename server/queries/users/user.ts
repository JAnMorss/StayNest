"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiError } from "@/server/api/client";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  type CurrentUserResponse,
  type LoginUserResponse,
  type RegisterUserResponse,
} from "@/server/api/users";
import type {
  LoginUserRequest,
  RegisterUserRequest,
} from "@/server/schemas/users";

export function useRegisterUser() {
  return useMutation<RegisterUserResponse, ApiError, RegisterUserRequest>({
    mutationFn: registerUser,
  });
}

export function useLoginUser() {
  return useMutation<LoginUserResponse, ApiError, LoginUserRequest>({
    mutationFn: loginUser,
  });
}

export function useCurrentUser() {
  return useQuery<CurrentUserResponse, ApiError>({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });
}
