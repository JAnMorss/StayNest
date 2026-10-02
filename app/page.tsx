import { listListings } from "@/server/api/listings/listing";
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listings/ListingCard";

type ListingData = {
  id: string;
  [key: string]: unknown;
};

function getListings(response: unknown): ListingData[] {
  if (Array.isArray(response)) {
    return response as ListingData[];
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

export default async function Home() {
  const response = await listListings<unknown>();
  const listings = getListings(response);

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
          {listings.map((listing: any) => {
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
