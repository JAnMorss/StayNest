import ClientOnly from '../components/ClientOnly';
import TripsPageClient from './TripsClient';

export default function TripsPage() {
  return (
    <ClientOnly>
      <TripsPageClient />
    </ClientOnly>
  );
}
