"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/server/api/client";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "@/server/api/users/user";

function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("accessToken");
}

export function useRegisterUser() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useLoginUser() {
  return useMutation({
    mutationFn: loginUser,
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],

    queryFn: async () => {
      const accessToken = getStoredAccessToken();

      if (!accessToken) {
        return null;
      }

      try {
        return await getCurrentUser();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          window.localStorage.removeItem("accessToken");
          return null;
        }

        throw error;
      }
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
      queryClient.setQueryData<string[]>(["favorite-listings"], []);
    },
  });
}
