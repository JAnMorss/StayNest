import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cancelListingReservation, getTrips } from '@/server/api/listings/listing';

export const tripKeys = {
  all: ['trips'] as const,
  list: (userId?: string) => [...tripKeys.all, userId] as const,
};

export function useTrips(userId?: string) {
  return useQuery({
    queryKey: tripKeys.list(userId),
    queryFn: getTrips,
    enabled: Boolean(userId),
  });
}

export function useCancelTrip() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (reservationId) => cancelListingReservation(reservationId),
    onSuccess: () => toast.success('Reservation cancelled'),
    onError: (error) => toast.error(error.message || 'Unable to cancel reservation.'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: tripKeys.all }),
  });
}