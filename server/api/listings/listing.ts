import { apiClient } from "../client";
import type {
  ListingImageUploadRequest,
  ListingQuery,
  ListingRequest,
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
  return apiClient<TResponse>(`/api/v1/listing/my/${encodeURIComponent(id)}`);
}

export async function getListingImages<TResponse = unknown>(id: string): Promise<TResponse> {
  return apiClient<TResponse>(`/api/v1/listing/${encodeURIComponent(id)}/image`);
}

export async function uploadListingImages<TResponse = unknown>(
  id: string,
  payload: ListingImageUploadRequest,
): Promise<TResponse> {
  const body = new FormData();
  payload.files.forEach((file) => body.append("files", file));

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
