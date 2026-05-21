import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/superbaseClient";
import { Item } from "@/interfaces/itemInterface";

export function ItemCard({ item }: { item: Item }) {
  const imageUrl = item.image_path
    ? supabase.storage.from("item-images").getPublicUrl(item.image_path).data
        .publicUrl
    : null;

  return (
    <Card className="overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground text-sm">
          No Image
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{item.name}</CardTitle>
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
  );
}
