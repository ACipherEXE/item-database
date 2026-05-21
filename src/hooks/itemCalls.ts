import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/superbaseClient";
import { Item, NewItem } from "@/interfaces/itemInterface";

export function getItems() {
  return useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export async function addItem(queryClient: QueryClient, newItem: NewItem) {
  let image_path = null;

  if (newItem.image) {
    const ext = newItem.image.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("item-images")
      .upload(fileName, newItem.image);

    if (uploadError) throw uploadError;
    image_path = fileName;
  }

  const { error } = await supabase.from("items").insert({
    name: newItem.name,
    brand: newItem.brand || null,
    category: newItem.category || null,
    tags: newItem.tags ?? [],
    image_path,
  });

  if (error) throw error;

  await queryClient.invalidateQueries({ queryKey: ["items"] });
  await queryClient.refetchQueries({ queryKey: ["items"] });
}
