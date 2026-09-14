"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/server/api/client";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  type CurrentUserResponse,
  type LoginUserResponse,
  type RegisterUserResponse,
} from "@/server/api/users/user";

import type {
  LoginUserRequest,
  RegisterUserRequest,
} from "@/server/schemas/users/user";

function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("accessToken");
}

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
  return useQuery<CurrentUserResponse | null, ApiError>({
    queryKey: ["current-user"],

    queryFn: async () => {
      const accessToken = getStoredAccessToken();

      if (!accessToken) {
        return null;
      }

      return getCurrentUser();
    },
  });
}

export function useLogoutUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("accessToken");
      }
    },

    onSuccess: () => {
      queryClient.setQueryData(["current-user"], null);
    },
  });
}
