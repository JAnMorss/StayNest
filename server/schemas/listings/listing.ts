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

export type ListingRequest = z.infer<typeof listingRequestSchema>;
export type ListingQuery = z.infer<typeof listingQuerySchema>;
export type ListingImageUploadRequest = z.infer<typeof listingImageUploadSchema>;
