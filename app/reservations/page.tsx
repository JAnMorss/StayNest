import ClientOnly from '../components/ClientOnly';
import ReservationClient from './ReservationClient';

export default function ReservationPage() {
  return (
    <ClientOnly>
      <ReservationClient />
    </ClientOnly>
  );
}