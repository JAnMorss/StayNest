import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";


export default function FavoritesPage() {
  return (
    <ClientOnly>
      <EmptyState
        title="No favorites found"
        subtitle="Looks like you have no favorite listings."
      />
    </ClientOnly>
  )
}