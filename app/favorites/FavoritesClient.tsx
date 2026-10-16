'use client';

import { useQuery } from '@tanstack/react-query';
import { useFavoriteListings } from '@/app/hooks/useListing';
import { useCurrentUser } from '@/app/hooks/useUser';
import { getListing } from '@/server/api/listings/listing';
import { listingResponseSchema, type ListingResponse } from '@/server/schemas/listings/listing';
import Container from '../components/Container';
import EmptyState from '../components/EmptyState';
import Heading from '../components/Heading';
import ListingCard from '../components/listings/ListingCard';

function unwrapListing(payload: unknown): ListingResponse | undefined {
  const parsed = listingResponseSchema.safeParse(payload);

  if (parsed.success) {
    return parsed.data;
  }

  if (typeof payload === 'object' && payload !== null) {
    for (const key of ['data', 'listing', 'item', 'result']) {
      const nested = (payload as Record<string, unknown>)[key];
      if (nested !== undefined) {
        const listing = unwrapListing(nested);
        if (listing) {
          return listing;
        }
      }
    }
  }

  return undefined;
}

export default function FavoritesClient() {
  const user = useCurrentUser();
  const favoriteIds = useFavoriteListings(Boolean(user.data));

  const favoriteListings = useQuery({
    queryKey: ['favorite-listings-details', favoriteIds.data ?? []],
    queryFn: async () => {
      const ids = favoriteIds.data ?? [];

      const payloads = await Promise.all(
        ids.map((id) => getListing<unknown>(id)),
      );

      return payloads.map((payload, index) => {
        const listing = unwrapListing(payload);

        if (!listing) {
          throw new Error(
            `Listing ${ids[index]} response did not match the listing schema.`,
          );
        }

        return listing;
      });
    },
    enabled: Boolean(user.data) && favoriteIds.status === 'success',
  });

  if (user.isPending || favoriteIds.isPending || favoriteListings.isPending) {
    return (
      <Container>
        <p className="mt-10 text-center text-neutral-500" role="status">
          Loading favorites...
        </p>
      </Container>
    );
  }

  if (user.error) {
    return (
      <EmptyState
        title="Unable to load your account"
        subtitle={user.error.message}
      />
    );
  }

  if (!user.data) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login to view your saved favorites."
      />
    );
  }

  if (favoriteIds.error) {
    return (
      <EmptyState
        title="Unable to load favorites"
        subtitle={favoriteIds.error.message}
      />
    );
  }

  if (favoriteListings.error) {
    return (
      <EmptyState
        title="Unable to load favorites"
        subtitle={favoriteListings.error.message}
      />
    );
  }

  if (!favoriteListings.data || favoriteListings.data.length === 0) {
    return (
      <EmptyState
        title="No favorites found"
        subtitle="Looks like you have no favorite listings."
      />
    );
  }

  return (
    <Container>
      <Heading
        title="Favorites"
        subtitle="List of places you have favorited!"
      />
      <div
        className="
          mt-10
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {favoriteListings.data.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
    </Container>
  );
}