import ClientOnly from '../components/ClientOnly';
import PropertiesClient from './PropertiesClient';

export default function PropertiesPage() {
  return (
    <ClientOnly>
      <PropertiesClient />
    </ClientOnly>
  );
}