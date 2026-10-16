'use client';

import toast from 'react-hot-toast';
import { useCurrentUser } from '@/app/hooks/useUser';
import { useDeleteListing, useMyProperties } from '@/app/hooks/useListing';
import Container from '../components/Container';
import EmptyState from '../components/EmptyState';
import Heading from '../components/Heading';
import ListingCard from '../components/listings/ListingCard';

export default function PropertiesClient() {
  const user = useCurrentUser();
  const properties = useMyProperties(user.data?.data.id);
  const deleteProperty = useDeleteListing();

  const hasActiveReservations = (listing: { reservations?: Array<unknown> }) =>
    Array.isArray(listing.reservations) && listing.reservations.length > 0;

  if (user.isPending || properties.isPending) {
    return (
      <Container>
        <p className="mt-10 text-center text-neutral-500" role="status">
          Loading your properties...
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
        subtitle="Please login to view your properties."
      />
    );
  }

  if (properties.error) {
    return (
      <EmptyState
        title="Unable to load properties"
        subtitle={properties.error.message}
      />
    );
  }

  if (properties.data.length === 0) {
    return (
      <EmptyState
        title="No properties found"
        subtitle="Looks like you haven't created any properties yet."
      />
    );
  }

  return (
    <Container>
      <Heading
        title="My properties"
        subtitle="List of your properties"
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
        {properties.data.map((listing) => {
          const blocked = hasActiveReservations(listing);

          return (
            <ListingCard
              key={listing.id}
              data={listing}
              actionId={listing.id}
              onAction={blocked ? () => toast.error('This property has active guest reservations. Cancel the reservation first before deleting it.') : deleteProperty.mutate}
              disabled={blocked || (deleteProperty.isPending && deleteProperty.variables === listing.id)}
              actionLabel={blocked ? 'Cancel reservations first' : 'Delete property'}
            />
          );
        })}
      </div>
    </Container>
  );
}