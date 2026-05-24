import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ItemGrid } from "@/components/ItemGrid";
import { AddItemPopUp } from "./components/AddItemPopUp";
import { Input } from "./components/ui/input";
import { useState } from "react";
import PlateDownloader from "./tools/PlateDownloader";

const queryClient = new QueryClient();

export default function App() {
  const [search, setSearch] = useState("");
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex items-center justify-between p-4 gap-4 border-b shrink-0">
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

        <div className="flex-1 overflow-y-auto">
          <ItemGrid search={search} />
        </div>
      </div>
    </QueryClientProvider>
  );
}
