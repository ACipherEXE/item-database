import { getItems } from "@/hooks/itemCalls";
import { ItemCard } from "./ItemCard";

export function ItemGrid() {
  const { data: items, isLoading, error } = getItems();

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
