import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/app/components/Container";
import { resolveAssetUrl } from "@/server/api/client";
import { getListing } from "@/server/api/listings/listing";

type Listing = {
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
};

function unwrapListing(payload: unknown): Listing | null {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const record = payload as Record<string, unknown>;
  if (typeof record.id === "string") {
    return record as Listing;
  }

  for (const key of ["data", "listing", "item", "result"]) {
    const listing = unwrapListing(record[key]);
    if (listing) {
      return listing;
    }
  }

  return null;
}

export default async function ListingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getListing<unknown>(id);
  const listing = unwrapListing(response);

  if (!listing) {
    notFound();
  }

  const imageSrc = resolveAssetUrl(listing.imageUrls?.[0] ?? listing.imageSrc);

  return (
    <main className="pb-16 pt-28">
      <Container>
        <Link href="/" className="mb-6 inline-block text-sm font-semibold hover:underline">
          Back to stays
        </Link>
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-neutral-100">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={listing.title || "Listing"}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                No photo available
              </div>
            )}
          </div>

          <section className="flex flex-col gap-5">
            <div>
              {listing.category && (
                <p className="mb-2 text-sm font-semibold uppercase text-neutral-500">
                  {listing.category}
                </p>
              )}
              <h1 className="text-3xl font-semibold">{listing.title || "Stay"}</h1>
              <p className="mt-2 text-neutral-600">
                {listing.location || listing.locationValue || "Location unavailable"}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 border-y border-neutral-200 py-4 text-sm text-neutral-700">
              {listing.guestCount != null && <span>{listing.guestCount} guests</span>}
              {listing.roomCount != null && <span>{listing.roomCount} rooms</span>}
              {listing.bathroomCount != null && <span>{listing.bathroomCount} bathrooms</span>}
            </div>

            {listing.price != null && (
              <p className="text-lg font-semibold">Price: {listing.price.toLocaleString()}</p>
            )}
            {listing.description && (
              <p className="whitespace-pre-line leading-7 text-neutral-700">
                {listing.description}
              </p>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}