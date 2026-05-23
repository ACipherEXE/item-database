import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/superbaseClient";
import { Item } from "@/interfaces/itemInterface";
import { EditItemPopUp } from "./EditItemPopUp";
import { useQueryClient } from "@tanstack/react-query";

export function ItemCard({ item }: { item: Item }) {
  const [editOpen, setEditOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const queryClient = useQueryClient();

  // Pinch state
  const lastPinchDistance = useRef<number | null>(null);

  // Drag state
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetAtDragStart = useRef({ x: 0, y: 0 });

  // Touch pan state (single finger)
  const lastTouchPos = useRef<{ x: number; y: number } | null>(null);

  // Ref for the lightbox overlay div (needed for non-passive touch listener)
  const lightboxRef = useRef<HTMLDivElement | null>(null);

  // Mutable refs to hold latest zoom/offset so the non-passive listener can use them
  const zoomRef = useRef(zoom);
  const offsetRef = useRef(offset);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  const imageUrl = item.image_path
    ? supabase.storage.from("item-images").getPublicUrl(item.image_path).data
        .publicUrl
    : null;

  useEffect(() => {
    if (!lightboxOpen) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [lightboxOpen]);

  // Attach a non-passive touchmove listener directly on the lightbox element.
  // React's synthetic onTouchMove is passive by default in modern browsers,
  // so calling e.preventDefault() inside it has no effect — the browser still
  // zooms the page. Attaching with { passive: false } gives us real control.
  useEffect(() => {
    const el = lightboxRef.current;
    if (!el) return;

    function onTouchMove(e: TouchEvent) {
      e.preventDefault(); // blocks browser pinch-zoom and scroll on the page

      if (e.touches.length === 2) {
        // Pinch to zoom
        lastTouchPos.current = null;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (lastPinchDistance.current !== null) {
          const delta = distance - lastPinchDistance.current;
          setZoom((z) => Math.min(5, Math.max(0.5, z + delta * 0.005)));
        }
        lastPinchDistance.current = distance;
      } else if (e.touches.length === 1) {
        // Single finger pan
        const touch = e.touches[0];
        if (lastTouchPos.current) {
          const dx = touch.clientX - lastTouchPos.current.x;
          const dy = touch.clientY - lastTouchPos.current.y;
          setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
        }
        lastTouchPos.current = { x: touch.clientX, y: touch.clientY };
      }
    }

    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, [lightboxOpen]); // re-bind whenever lightbox opens/closes

  function handleTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) lastPinchDistance.current = null;
    if (e.touches.length === 0) lastTouchPos.current = null;
  }

  // Desktop: scroll to zoom
  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    setZoom((z) => Math.min(5, Math.max(0.5, z - e.deltaY * 0.001)));
  }

  // Desktop: drag to pan
  function handleMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetAtDragStart.current = offset;
    e.preventDefault();
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({
      x: offsetAtDragStart.current.x + dx,
      y: offsetAtDragStart.current.y + dy,
    });
  }

  function handleMouseUp() {
    isDragging.current = false;
  }

  return (
    <>
      <Card className="overflow-hidden group relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-48 object-cover cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground text-sm">
            No Image
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{item.name}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 text-xs h-7 px-2"
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
          </div>
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

      {/* Lightbox */}
      {lightboxOpen && imageUrl && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 overflow-hidden"
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchEnd={handleTouchEnd}
          onClick={() => setLightboxOpen(false)}
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
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
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
            draggable={false}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transition: isDragging.current ? "none" : "transform 0.1s ease",
              cursor: isDragging.current ? "grabbing" : "grab",
            }}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
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
