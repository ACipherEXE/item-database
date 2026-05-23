import { QueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/superbaseClient";
import { Item, NewItem } from "@/interfaces/itemInterface";
import { v4 as uuidv4 } from "uuid";
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
    console.log("Yesp");
    const fileName = `${uuidv4()}.${newItem.image.name.split(".").pop()}`;
    const { error: uploadError } = await supabase.storage
      .from("item-images")
      .upload(fileName, newItem.image);

    if (uploadError) throw { uploadError };
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

export async function updateItem(
  queryClient: QueryClient,
  existing: Item,
  updates: Item,
) {
  let image_path = existing.image_path ?? null;

  if (updates.image) {
    // Upload new image
    const fileName = `${crypto.randomUUID()}.${updates.image.name.split(".").pop()}`;
    const { error: uploadError } = await supabase.storage
      .from("item-images")
      .upload(fileName, updates.image);

    if (uploadError) throw uploadError;

    if (existing.image_path) {
      await supabase.storage.from("item-images").remove([existing.image_path]);
    }

    image_path = fileName;
  }

  const { error } = await supabase
    .from("items")
    .update({
      name: updates.name,
      brand: updates.brand || null,
      category: updates.category || null,
      tags: updates.tags ?? [],
      image_path,
    })
    .eq("id", existing.id);

  if (error) throw error;

  await queryClient.invalidateQueries({ queryKey: ["items"] });
  await queryClient.refetchQueries({ queryKey: ["items"] });
}
