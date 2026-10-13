import { z } from "zod";

export const listingRequestSchema = z.object({
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  roomCount: z.number().int().optional(),
  bathroomCount: z.number().int().optional(),
  guestCount: z.number().int().optional(),
  locationValue: z.string().nullable().optional(),
  price: z.number().optional(),
});

export const listingFavoriteSchema = z.object({
  userId: z.string(),
  listingId: z.string(),
});

export const listingReservationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  listingId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  totalPrice: z.number(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export const listingResponseSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  createdBy: z.string().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  roomCount: z.number().int().optional(),
  bathroomCount: z.number().int().optional(),
  guestCount: z.number().int().optional(),
  location: z.string().nullable().optional(),
  locationValue: z.string().nullable().optional(),
  price: z.number().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
  imageUrls: z.array(z.string()).nullable().optional(),
  imageSrc: z.string().nullable().optional(),
  favorites: z.array(listingFavoriteSchema).optional(),
  reservations: z.array(listingReservationSchema).optional(),
});

export const listingPageResponseSchema = z.object({
  data: z.object({
    items: z.array(listingResponseSchema),
    totalCount: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
  }),
  message: z.string(),
});

export const reservationPageResponseSchema = z.object({
  data: z.object({
    items: z.array(listingReservationSchema),
    totalCount: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
  }),
  message: z.string(),
});

export const listingQuerySchema = z.object({
  SortBy: z.string().optional(),
  Descending: z.boolean().optional(),
  Page: z.number().int().optional(),
  PageSize: z.number().int().optional(),
});

export const listingImageUploadSchema = z.object({
  files: z.array(
    z.custom<File>(
      (value) => typeof File !== "undefined" && value instanceof File,
      "Each upload must be a file.",
    ),
  ),
});

export const reserveRequestSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
}).refine(
  ({ startDate, endDate }) => new Date(endDate) > new Date(startDate),
  {
    message: "End date must be after start date.",
    path: ["endDate"],
  },
);

export type ListingRequest = z.infer<typeof listingRequestSchema>;
export type ListingResponse = z.infer<typeof listingResponseSchema>;
export type ListingPageResponse = z.infer<typeof listingPageResponseSchema>;
export type ReservationPageResponse = z.infer<typeof reservationPageResponseSchema>;
export type ListingQuery = z.infer<typeof listingQuerySchema>;
export type ListingImageUploadRequest = z.infer<typeof listingImageUploadSchema>;
export type ReserveRequest = z.infer<typeof reserveRequestSchema>;
