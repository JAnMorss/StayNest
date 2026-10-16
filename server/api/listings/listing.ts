import { apiClient } from "../client";
import {
  listingImageUploadSchema,
  listingPageResponseSchema,
  listingResponseSchema,
  type ListingImageUploadRequest,
  type ListingQuery,
  type ListingRequest,
  type ListingResponse,
  type ReservationPageResponse,
  type ReserveRequest,
  reservationPageResponseSchema,
  reserveRequestSchema,
} from "@/server/schemas/listings/listing";

export type Trip = ReservationPageResponse["data"]["items"][number] & {
  listing: ListingResponse;
};

export type HostReservation = Trip;

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

export async function getReservations(): Promise<ReservationPageResponse> {
  const response = await apiClient<unknown>("/api/v1/listing/reservations");
  return reservationPageResponseSchema.parse(response);
}

export async function getHostReservations(userId: string): Promise<HostReservation[]> {
  const pageSize = 100;
  const reservations: HostReservation[] = [];
  let page = 1;

  while (true) {
    const response = await listListings<unknown>({ Page: page, PageSize: pageSize });
    const { data } = listingPageResponseSchema.parse(response);

    for (const listing of data.items) {
      if (listing.userId !== userId && listing.createdBy !== userId) {
        continue;
      }

      for (const reservation of listing.reservations ?? []) {
        reservations.push({ ...reservation, listing });
      }
    }

    if (data.items.length === 0) {
      break;
    }

    if (data.pageSize <= 0) {
      throw new Error("Listing response page size must be greater than zero.");
    }

    if (page >= Math.ceil(data.totalCount / data.pageSize)) {
      break;
    }

    page += 1;
  }

  return reservations;
}

export async function getMyProperties(userId: string): Promise<ListingResponse[]> {
  const pageSize = 100;
  const properties: ListingResponse[] = [];
  let page = 1;

  while (true) {
    const response = await listListings<unknown>({ Page: page, PageSize: pageSize });
    const { data } = listingPageResponseSchema.parse(response);

    for (const listing of data.items) {
      if (listing.userId !== userId && listing.createdBy !== userId) {
        continue;
      }

      properties.push(listing);
    }

    if (data.items.length === 0) {
      break;
    }

    if (data.pageSize <= 0) {
      throw new Error("Listing response page size must be greater than zero.");
    }

    if (page >= Math.ceil(data.totalCount / data.pageSize)) {
      break;
    }

    page += 1;
  }

  return properties;
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

export async function cancelListingReservation<TResponse = unknown>(
  reservationId: string,
): Promise<TResponse> {
  return apiClient<TResponse>(
    `/api/v1/listing/reservations/${encodeURIComponent(reservationId)}`,
    { method: "DELETE" },
  );
}

function unwrapListing(payload: unknown): ListingResponse | undefined {
  const parsed = listingResponseSchema.safeParse(payload);
  if (parsed.success) return parsed.data;

  if (typeof payload === "object" && payload !== null) {
    for (const key of ["data", "listing", "item", "result"]) {
      const nested = (payload as Record<string, unknown>)[key];
      if (nested !== undefined) {
        const listing = unwrapListing(nested);
        if (listing) return listing;
      }
    }
  }

  return undefined;
}

export async function getTrips(): Promise<Trip[]> {
  const { data } = await getReservations();

  return Promise.all(
    data.items.map(async (reservation): Promise<Trip> => {
      const payload = await getListing<unknown>(reservation.listingId);
      const listing = unwrapListing(payload);

      if (!listing) {
        throw new Error(
          `Listing ${reservation.listingId} response did not match the listing schema.`,
        );
      }

      return { ...reservation, listing };
    }),
  );
}