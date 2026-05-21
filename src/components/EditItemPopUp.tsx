import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateItem } from "@/hooks/itemCalls";
import { Item } from "@/interfaces/itemInterface";
import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/superbaseClient";

interface EditItemPopUpProps {
  item: Item;
  open: boolean;
  onClose: () => void;
  client: QueryClient;
}

export function EditItemPopUp({ item, open, onClose, client }: EditItemPopUpProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: item.name,
    brand: item.brand ?? "",
    category: item.category ?? "",
    tags: item.tags?.join(", ") ?? "",
  });

  const existingImageUrl = item.image_path
    ? supabase.storage.from("item-images").getPublicUrl(item.image_path).data.publicUrl
    : null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.name) return;
    setLoading(true);
    setError(null);
    try {
      await updateItem(client, item, {
        name: form.name,
        brand: form.brand,
        category: form.category,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        image: image ?? undefined,
      });
      onClose();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={undefined}>
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Edit Item</DialogTitle>
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
          <div className="flex flex-col gap-2">
            <Label className={undefined}>Image</Label>
            {existingImageUrl && !image && (
              <img
                src={existingImageUrl}
                alt="Current"
                className="w-full h-32 object-cover rounded-md"
              />
            )}
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="New preview"
                className="w-full h-32 object-cover rounded-md"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e: any) => setImage(e.target.files?.[0] ?? null)}
              className={undefined}
            />
            {existingImageUrl && (
              <p className="text-xs text-muted-foreground">
                Pick a new file to replace the current image.
              </p>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleSubmit} disabled={loading} className={undefined}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
