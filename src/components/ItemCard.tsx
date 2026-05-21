import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/superbaseClient";
import { Item } from "@/interfaces/itemInterface";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { EditItemPopUp } from "./EditItemPopUp";
import { useQueryClient } from "@tanstack/react-query";

export function ItemCard({ item }: { item: Item }) {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const imageUrl = item.image_path
    ? supabase.storage.from("item-images").getPublicUrl(item.image_path).data
        .publicUrl
    : null;

  useEffect(() => {
    if (!lightboxOpen) setZoom(1);
  }, [lightboxOpen]);

  // Scroll to zoom
  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    setZoom((z) => Math.min(5, Math.max(0.5, z - e.deltaY * 0.001)));
  }

  return (
    <>
      <Card className="overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-48 object-cover"
            onClick={() => setLightboxOpen(true)}
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground text-sm">
            No Image
          </div>
        )}
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{item.name}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 text-xs h-7 px-2"
            onClick={() => setEditOpen(true)}
          >
            Edit
          </Button>
          {item.brand && (
            <p className="text-sm text-muted-foreground">{item.brand}</p>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {item.category && (
            <Badge variant="secondary" className={undefined}>
              {item.category}
            </Badge>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline" className={undefined}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {lightboxOpen && imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxOpen(false)}
          onWheel={handleWheel}
        >
          {/* Zoom controls */}
          <div
            className="absolute top-4 right-4 flex items-center gap-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              className={undefined}
            >
              −
            </Button>
            <span className="text-white text-sm w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setZoom((z) => Math.min(5, z + 0.25))}
              className={undefined}
            >
              +
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setZoom(1)}
              className={undefined}
            >
              Reset
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLightboxOpen(false)}
              className={undefined}
            >
              ✕
            </Button>
          </div>

          <img
            src={imageUrl}
            alt={item.name}
            style={{
              transform: `scale(${zoom})`,
              transition: "transform 0.15s ease",
            }}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <EditItemPopUp
        item={item}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        client={queryClient}
      />
    </>
  );
}
