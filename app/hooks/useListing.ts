"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/server/api/client";
import {
  addListingToFavorites,
  getFavoriteListings,
  removeListingFromFavorites,
} from "@/server/api/listings/listing";

const favoriteListingsQueryKey = ["favorite-listings"];

function toFavoriteIds(payload: unknown): string[] {
  if (Array.isArray(payload)) {
    return payload.flatMap((favorite) => {
      if (typeof favorite === "string") return [favorite];
      if (typeof favorite !== "object" || favorite === null) return [];

      const record = favorite as { id?: unknown; listingId?: unknown };
      const id = typeof record.listingId === "string" ? record.listingId : record.id;
      return typeof id === "string" ? [id] : [];
    });
  }

  if (typeof payload === "object" && payload !== null) {
    const response = payload as {
      data?: unknown;
      favorites?: unknown;
      favoriteIds?: unknown;
      listings?: unknown;
    };
    const nested = response.favoriteIds ?? response.favorites ?? response.listings ?? response.data;
    if (nested !== undefined) return toFavoriteIds(nested);
  }

  return [];
}

export function useFavoriteListings(enabled = true) {
  return useQuery<string[], ApiError>({
    queryKey: favoriteListingsQueryKey,
    queryFn: async () => toFavoriteIds(await getFavoriteListings<unknown>()),
    enabled,
  });
}

export function useAddListingToFavorites() {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, string>({
    mutationFn: addListingToFavorites,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: favoriteListingsQueryKey }),
  });
}

export function useRemoveListingFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, string>({
    mutationFn: removeListingFromFavorites,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: favoriteListingsQueryKey }),
  });
}