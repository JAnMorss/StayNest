import { apiClient } from "../client";
import {
  listingImageUploadSchema,
  type ListingImageUploadRequest,
  type ListingQuery,
  type ListingRequest,
  type ReservationPageResponse,
  type ReserveRequest,
  reserveRequestSchema,
} from "@/server/schemas/listings/listing";

function withQuery(path: string, query: ListingQuery): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  const serializedQuery = searchParams.toString();
  return serializedQuery ? `${path}?${serializedQuery}` : path;
}

export async function listListings<TResponse = unknown>(
  query: ListingQuery = {},
): Promise<TResponse> {
  return apiClient<TResponse>(withQuery("/api/v1/listing", query));
}

export async function createListing<TResponse = unknown>(
  payload: ListingRequest,
): Promise<TResponse> {
  return apiClient<TResponse, ListingRequest>("/api/v1/listing", {
    method: "POST",
    body: payload,
  });
}

export async function getListing<TResponse = unknown>(id: string): Promise<TResponse> {
  return apiClient<TResponse>(`/api/v1/listing/${encodeURIComponent(id)}`);
}

export async function updateListing<TResponse = unknown>(
  id: string,
  payload: ListingRequest,
): Promise<TResponse> {
  return apiClient<TResponse, ListingRequest>(
    `/api/v1/listing/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export async function deleteListing<TResponse = unknown>(id: string): Promise<TResponse> {
  return apiClient<TResponse>(`/api/v1/listing/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getMyListing<TResponse = unknown>(id: string): Promise<TResponse> {
  return apiClient<TResponse>(`/api/v1/listing/my/${encodeURIComponent(id)}`, {
    auth: false,
  });
}

export async function getListingImages<TResponse = unknown>(id: string): Promise<TResponse> {
  return apiClient<TResponse>(`/api/v1/listing/${encodeURIComponent(id)}/image`, {
    auth: false,
  });
}

export async function uploadListingImages<TResponse = unknown>(
  id: string,
  payload: ListingImageUploadRequest,
): Promise<TResponse> {
  const parsed = listingImageUploadSchema.safeParse(payload);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((issue) => issue.message).join(", "));
  }

  const body = new FormData();
  parsed.data.files.forEach((file) => body.append("files", file));

  return apiClient<TResponse>(`/api/v1/listing/${encodeURIComponent(id)}/image`, {
    method: "POST",
    body,
  });
}

export async function deleteListingImages<TResponse = unknown>(
  id: string,
  imageUrls: string,
): Promise<TResponse> {
  const query = new URLSearchParams({ imageUrls });
  return apiClient<TResponse>(
    `/api/v1/listing/${encodeURIComponent(id)}/image?${query.toString()}`,
    { method: "DELETE" },
  );
}

export async function getFavoriteListings<TResponse = unknown>(): Promise<TResponse> {
  return apiClient<TResponse>("/api/v1/listing/favorites");
}

export async function addListingToFavorites<TResponse = unknown>(
  id: string,
): Promise<TResponse> {
  return apiClient<TResponse>(
    `/api/v1/listing/${encodeURIComponent(id)}/favorites`,
    { method: "POST" },
  );
}

export async function removeListingFromFavorites<TResponse = unknown>(
  id: string,
): Promise<TResponse> {
  return apiClient<TResponse>(
    `/api/v1/listing/${encodeURIComponent(id)}/favorites`,
    { method: "DELETE" },
  );
}

export async function reserveListing<TResponse = unknown>(
  id: string,
  payload: ReserveRequest,
): Promise<TResponse> {
  const parsed = reserveRequestSchema.safeParse(payload);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((issue) => issue.message).join(", "));
  }

  return apiClient<TResponse, ReserveRequest>(
    `/api/v1/listing/${encodeURIComponent(id)}/reserve`,
    {
      method: "POST",
      body: parsed.data,
    },
  );
}

export async function getReservations<TResponse = ReservationPageResponse>(): Promise<TResponse> {
  return apiClient<TResponse>("/api/v1/listing/reservations");
}

export async function cancelListingReservation<TResponse = unknown>(
  id: string,
): Promise<TResponse> {
  return apiClient<TResponse>(
    `/api/v1/listing/${encodeURIComponent(id)}/cancel-reservation`,
    { method: "POST" },
  );
}
