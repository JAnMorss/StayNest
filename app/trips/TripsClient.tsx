'use client';

import { useCurrentUser } from '@/app/hooks/useUser';
import { useCancelTrip, useTrips } from '@/app/hooks/useTrips';
import Container from '../components/Container';
import Heading from '../components/Heading';
import EmptyState from '../components/EmptyState';
import ListingCard from '../components/listings/ListingCard';

export default function TripsClient() {
  const user = useCurrentUser();
  const trips = useTrips(user.data?.data.id);
  const cancel = useCancelTrip();

  if (user.isPending) 
    return <TripsLoading />;

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
        subtitle="Please login to view your trips." 
      />
    );
  }

  if (trips.isPending)
    return <TripsLoading />;

  if (trips.error) {
    return (
      <EmptyState 
        title="Unable to load trips" 
        subtitle={trips.error.message} 
      />
    );
  }
  
  if (trips.data.length === 0) {
    return (
      <EmptyState
        title="No trips found"
        subtitle="Looks like you haven't reserved any trips."
      />
    );
  }

  return (
    <Container>
      <Heading
        title="Trips"
        subtitle="Where you've been and where you're going"
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
        {trips.data.map((trip) => (
          <ListingCard
            key={trip.id}
            data={trip.listing}
            reservation={trip}
            actionId={trip.id}
            onAction={cancel.mutate}
            disabled={cancel.isPending && cancel.variables === trip.id}
            actionLabel="Cancel reservation"
          />
        ))}
      </div>
    </Container>
  );
}

function TripsLoading() {
  return (
    <Container>
      <p 
        className="
          mt-10 
          text-center 
          text-neutral-500
        " 
        role="status"
      >
        Loading trips...
      </p>
    </Container>
  );
}