import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/superbaseClient";
interface Item {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  tags?: string[];
  image_path?: string;
  created_at: string;
  updated_at: string;
}

export function useItems() {
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
