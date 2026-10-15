import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  cancelListingReservation,
  getHostReservations,
  getTrips,
} from '@/server/api/listings/listing';

export const tripKeys = {
  all: ['trips'] as const,
  list: (userId?: string) => [...tripKeys.all, userId] as const,
};

export const hostReservationKeys = {
  all: ['host-reservations'] as const,
  list: (userId?: string) => [...hostReservationKeys.all, userId] as const,
};

export function useTrips(userId?: string) {
  return useQuery({
    queryKey: tripKeys.list(userId),
    queryFn: getTrips,
    enabled: Boolean(userId),
  });
}

export function useHostReservations(userId?: string) {
  return useQuery({
    queryKey: hostReservationKeys.list(userId),
    queryFn: () => {
      if (!userId) {
        throw new Error('A user ID is required to load host reservations.');
      }

      return getHostReservations(userId);
    },
    enabled: Boolean(userId),
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (reservationId) => cancelListingReservation(reservationId),
    onSuccess: () => toast.success('Reservation cancelled'),
    onError: (error) => toast.error(error.message || 'Unable to cancel reservation.'),
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: tripKeys.all }),
        queryClient.invalidateQueries({ queryKey: hostReservationKeys.all }),
      ]),
  });
}

export function useCancelTrip() {
  return useCancelReservation();
}