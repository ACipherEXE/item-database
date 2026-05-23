import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addItem } from "@/hooks/itemCalls";
import { QueryClient } from "@tanstack/react-query";

export function AddItemPopUp({ client }: { client: QueryClient }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    tags: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.name) return;
    setLoading(true);
    setError(null);
    try {
      await addItem(client, {
        name: form.name,
        brand: form.brand,
        category: form.category,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        image,
      });
      setForm({ name: "", brand: "", category: "", tags: "" });
      setImage(null);
      setOpen(false);
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={undefined}>Add Item</Button>
      </DialogTrigger>
      <DialogContent className={undefined}>
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Add New Item</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label className={undefined}>Name *</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Item name"
              className={undefined}
              type={undefined}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className={undefined}>Brand</Label>
            <Input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand"
              className={undefined}
              type={undefined}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className={undefined}>Category</Label>
            <Input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className={undefined}
              type={undefined}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className={undefined}>Tags</Label>
            <Input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Comma separated e.g. cool, rare"
              className={undefined}
              type={undefined}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className={undefined}>Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e: any) => setImage(e.target.files?.[0] ?? null)}
              className={undefined}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className={undefined}
          >
            {loading ? "Saving..." : "Save Item"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
