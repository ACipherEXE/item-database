export interface Item {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  tags?: string[];
  image_path?: string;
  created_at: string;
  updated_at: string;
}
export interface NewItem {
  name: string;
  brand?: string;
  category?: string;
  tags?: string[];
  image?: File | null;
}
