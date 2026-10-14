"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addListingToFavorites,
  getFavoriteListings,
  removeListingFromFavorites,
} from "@/server/api/listings/listing";
import { favoriteListingsResponseSchema } from "@/server/schemas/listings/listing";

const favoriteListingsQueryKey = ["favorite-listings"];

export function useFavoriteListings(enabled = true) {
  return useQuery({
    queryKey: favoriteListingsQueryKey,
    queryFn: async () =>
      favoriteListingsResponseSchema.parse(await getFavoriteListings()),
    enabled,
  });
}

export function useAddListingToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addListingToFavorites(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: favoriteListingsQueryKey }),
  });
}

export function useRemoveListingFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeListingFromFavorites(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: favoriteListingsQueryKey }),
  });
}