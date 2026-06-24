export type Lang = 'ru' | 'uz';

export type Condition = 'new' | 'used';

export interface Seller {
  name: string;
  rating: number | null;
  is_verified: boolean | null;
  username?: string | null;
}

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string | null;
  condition: Condition | null;
  brand: string | null;
  model: string | null;
  memory: string | null;
  city: string | null;
  district: string | null;
  status: string | null;
  is_promoted: boolean | null;
  views: number | null;
  created_at: string;
  category?: string | null;
  subcategory?: string | null;
  attributes?: Record<string, string> | null;
  seller: Seller | null;
  images?: { url: string; sort: number | null }[] | null;
}

export function allImages(item: Listing): string[] {
  if (!item.images) return [];
  return [...item.images]
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((x) => x.url);
}

export function firstImage(item: Listing): string | null {
  return allImages(item)[0] ?? null;
}

export interface Category {
  id: string;
  slug: string;
  name_ru: string;
  name_uz: string;
  parent_id: string | null;
  icon: string | null;
  sort: number | null;
}
