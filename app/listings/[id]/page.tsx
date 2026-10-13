import { getListing } from "@/server/api/listings/listing";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import { Listing } from "@/server/types/listings/listing";


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
    return (
        <ClientOnly>
            <EmptyState />
        </ClientOnly>
    )
  }

  return (
    <ClientOnly>
        <ListingClient
          listing={listing}
          reservations={listing.reservations}
        />
    </ClientOnly>
  );
}