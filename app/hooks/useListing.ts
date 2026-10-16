"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  addListingToFavorites,
  deleteListing,
  getFavoriteListings,
  getMyProperties,
  removeListingFromFavorites,
} from "@/server/api/listings/listing";
import { favoriteListingsResponseSchema } from "@/server/schemas/listings/listing";

const favoriteListingsQueryKey = ["favorite-listings"];
export const propertyKeys = {
  all: ["my-properties"] as const,
  list: (userId?: string) => [...propertyKeys.all, userId] as const,
};

export function useFavoriteListings(enabled = true) {
  return useQuery({
    queryKey: favoriteListingsQueryKey,
    queryFn: async () =>
      favoriteListingsResponseSchema.parse(await getFavoriteListings()),
    enabled,
  });
}

export function useMyProperties(userId?: string) {
  return useQuery({
    queryKey: propertyKeys.list(userId),
    queryFn: () => {
      if (!userId) {
        throw new Error("A user ID is required to load your properties.");
      }

      return getMyProperties(userId);
    },
    enabled: Boolean(userId),
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteListing(id),
    onSuccess: (_, id) => {
      toast.success("Property deleted");
      queryClient.setQueryData(propertyKeys.all, (current: unknown) => {
        if (!Array.isArray(current)) {
          return current;
        }

        return current.filter((listing: { id?: string }) => listing.id !== id);
      });
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
    onError: (error: Error) => {
      const message = error.message || "Unable to delete property.";
      const isReservationConflict = /association between entity types|required relationship|cancel the guest reservation/i.test(message);

      toast.error(
        isReservationConflict
          ? "This property has active guest reservations. Cancel the reservation first before deleting it."
          : message,
      );
    },
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