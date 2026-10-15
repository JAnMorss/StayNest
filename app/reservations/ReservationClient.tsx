'use client';

import { useCurrentUser } from '@/app/hooks/useUser';
import Container from '../components/Container';
import Heading from '../components/Heading';
import EmptyState from '../components/EmptyState';
import { useCancelReservation, useHostReservations } from '../hooks/useTrips';
import ListingCard from '../components/listings/ListingCard';

export default function ReservationClient() {
  const user = useCurrentUser();
  const reservations = useHostReservations(user.data?.data.id);
  const cancel = useCancelReservation();

  if (user.isPending) {
    return <ReservationsLoading />;
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
        subtitle="Please login to view reservations."
      />
    );
  }

  if (reservations.isPending) {
    return <ReservationsLoading />;
  }

  if (reservations.error) {
    return (
      <EmptyState
        title="Unable to load reservations"
        subtitle={reservations.error.message}
      />
    );
  }

  if (reservations.data.length === 0) {
    return (
      <EmptyState
        title="No reservations found"
        subtitle="Looks like you have no reservations on your properties."
      />
    );
  }

  return (
    <Container>
      <Heading 
        title="Reservations" 
        subtitle="Bookings on your properties" 
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
        {reservations.data.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={cancel.mutate}
            disabled={cancel.isPending && cancel.variables === reservation.id}
            actionLabel="Cancel guest reservation"
          />
        ))}
      </div>
    </Container>
  );
}

function ReservationsLoading() {
  return (
    <Container>
      <p className="mt-10 text-center text-neutral-500" role="status">
        Loading reservations...
      </p>
    </Container>
  );
}