"use client";

import { useMutation } from "@tanstack/react-query";

import { ApiError } from "@/server/api/client";
import {
  loginUser,
  registerUser,
  type LoginUserResponse,
  type RegisterUserResponse,
} from "@/server/api/users";
import type {
  LoginUserRequest,
  RegisterUserRequest,
} from "@/server/schemas/user";

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
