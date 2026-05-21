import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ItemGrid } from "@/components/ItemGrid";
import { AddItemPopUp } from "./components/AddItemPopUp";
import { Input } from "./components/ui/input";
import { useState } from "react";

const queryClient = new QueryClient();

export default function App() {
  const [search, setSearch] = useState("");
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">Item Search</h1>
        <Input
          placeholder="Search by name, brand, category or tag..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="max-w-sm"
          type={undefined}
        />
        <AddItemPopUp client={queryClient} />
      </div>
      <ItemGrid search={search} />
    </QueryClientProvider>
  );
}
