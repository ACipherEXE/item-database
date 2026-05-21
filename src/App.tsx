import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useItems } from "@/hooks/useItems";
import { ItemCard } from "@/components/ItemCard";

const queryClient = new QueryClient();

function ItemGrid() {
  const { data: items, isLoading, error } = useItems();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!items?.length) return <p>No items yet.</p>;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 p-4">
      {items.map((item: any) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1 className="text-2xl font-bold p-4">My Items</h1>
      <ItemGrid />
    </QueryClientProvider>
  );
}
