import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ItemGrid } from "@/components/ItemGrid";
import { AddItemPopUp } from "./components/AddItemPopUp";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">My Items</h1>
        <AddItemPopUp client={queryClient} />
      </div>
      <ItemGrid />
    </QueryClientProvider>
  );
}
