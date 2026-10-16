import ClientOnly from "../components/ClientOnly";
import FavoritesClient from "./FavoritesClient";

export default function FavoritesPage() {
  return (
    <ClientOnly>
      <FavoritesClient />
    </ClientOnly>
  );
}