export type Listing = {
  id: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  location?: string | null;
  locationValue?: string | null;
  price?: number | null;
  guestCount?: number | null;
  roomCount?: number | null;
  bathroomCount?: number | null;
  imageUrls?: string[] | null;
  imageSrc?: string | null;
  userId?: string | null;
  createdBy?: string | null;
};