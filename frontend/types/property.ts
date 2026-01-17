export type ListingType = 'SALE' | 'RENT';
export type PropertyType = 'VILLA' | 'APARTMENT' | 'PENTHOUSE' | 'HOUSE' | 'COTTAGE' | 'SUITE';

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  tags: string[];
  image: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: ListingType;
  propertyType: PropertyType;
  amenities: string[];
  images: string[];
  publishedAt: string; // ISO date string
}