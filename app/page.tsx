import { listListings } from "@/server/api/listings/listing";
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listings/ListingCard";
import {
  listingResponseSchema,
  type ListingResponse,
} from "@/server/schemas/listings/listing";

type SearchParams = Record<string, string | string[] | undefined>;

function getListings(response: unknown): ListingResponse[] {
  if (Array.isArray(response)) {
    return response.map((listing) => listingResponseSchema.parse(listing));
  }

  if (typeof response !== "object" || response === null) {
    return [];
  }

  const envelope = response as Record<string, unknown>;
  for (const key of ["data", "listings", "items", "results"]) {
    const listings = getListings(envelope[key]);
    if (listings.length > 0) {
      return listings;
    }
  }

  return [];
}

function getSingleValue(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getPositiveInteger(value: string | undefined): number | undefined {
  if (!value || !/^\d+$/.test(value)) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : undefined;
}

function getDateOnly(value: string | undefined): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : value.slice(0, 10);
}

function hasDateConflict(
  reservations: ListingResponse["reservations"],
  startDate: string,
  endDate: string,
): boolean {
  return reservations?.some((reservation) => {
    const status = reservation.status.toLowerCase();

    if (/cancel|reject|declin/.test(status)) {
      return false;
    }

    const bookedStart = getDateOnly(reservation.startDate);
    const bookedEnd = getDateOnly(reservation.endDate);

    return Boolean(
      bookedStart &&
        bookedEnd &&
        bookedStart < endDate &&
        bookedEnd > startDate,
    );
  }) ?? false;
}

function filterListings(
  listings: ListingResponse[],
  params: SearchParams,
): ListingResponse[] {
  const category = getSingleValue(params.category)?.trim().toLowerCase();
  const locationValue = getSingleValue(params.locationValue)?.toLowerCase();
  const guestCount = getPositiveInteger(getSingleValue(params.guestCount));
  const roomCount = getPositiveInteger(getSingleValue(params.roomCount));
  const bathroomCount = getPositiveInteger(getSingleValue(params.bathroomCount));
  const startDate = getDateOnly(getSingleValue(params.startDate));
  const endDate = getDateOnly(getSingleValue(params.endDate));

  return listings.filter((listing) => {
    if (
      category &&
      (typeof listing.category !== "string" ||
        listing.category.trim().toLowerCase() !== category)
    ) {
      return false;
    }

    const listingLocation = listing.locationValue ?? listing.location;

    if (
      locationValue &&
      (typeof listingLocation !== "string" ||
        listingLocation.toLowerCase() !== locationValue)
    ) {
      return false;
    }

    if (
      (guestCount !== undefined &&
        (typeof listing.guestCount !== "number" ||
          listing.guestCount < guestCount)) ||
      (roomCount !== undefined &&
        (typeof listing.roomCount !== "number" ||
          listing.roomCount < roomCount)) ||
      (bathroomCount !== undefined &&
        (typeof listing.bathroomCount !== "number" ||
          listing.bathroomCount < bathroomCount))
    ) {
      return false;
    }

    if (
      startDate &&
      endDate &&
      endDate > startDate &&
      hasDateConflict(listing.reservations, startDate, endDate)
    ) {
      return false;
    }

    return true;
  });
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const response = await listListings<unknown>();
  const listings = filterListings(getListings(response), params);

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div className="
          pt-24
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        ">
          {listings.map((listing) => {
            return (
              <ListingCard
                key={listing.id}
                data={listing}
              />
            );
          })}
        </div>
      </Container>
    </ClientOnly>
  );
}
