import { getItems } from "@/hooks/itemCalls";
import { ItemCard } from "./ItemCard";
import { Item } from "@/interfaces/itemInterface";
import PlateDownloader from "@/tools/PlateDownloader";

export function ItemGrid({ search }: { search: string }) {
  const { data: items, isLoading, error } = getItems();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!items?.length) return <p>No items yet.</p>;

  const userInput = search.trim().toLowerCase();

  const filtered = userInput
    ? items.filter((item: Item) => {
        return (
          item.name?.toLowerCase().includes(userInput) ||
          item.brand?.toLowerCase().includes(userInput) ||
          item.category?.toLowerCase().includes(userInput) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(userInput))
        );
      })
    : items;
  return (
    <>
      <div className="gap-4 p-4">Total items: {items.length}</div>
      <PlateDownloader />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 p-4">
        {filtered.map((item: Item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
