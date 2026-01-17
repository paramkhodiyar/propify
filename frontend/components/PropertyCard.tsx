'use client';

import { Property } from '@/types/property';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import Link from 'next/link';
import SavedListingButton from './SavedListingButton';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'fast-filling':
        return 'bg-orange-100 text-orange-800';
      case 'sold-out':
        return 'bg-red-100 text-red-800';
      case 'trending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagText = (tag: string) => {
    switch (tag) {
      case 'fast-filling':
        return 'Fast Filling';
      case 'sold-out':
        return 'Sold Out';
      default:
        return tag.charAt(0).toUpperCase() + tag.slice(1);
    }
  };

  return (
    <Link href={`/property/${property.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        {/* Image */}
        <div className="relative">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          {/* Tags */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {property.tags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-1 rounded-full text-xs font-medium ${getTagStyle(tag)}`}
              >
                {getTagText(tag)}
              </span>
            ))}
          </div>
          <div className="absolute top-3 right-3 z-10">
            <SavedListingButton listingId={parseInt(property.id)} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-amber-600 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.area} sq ft</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-amber-600">
              {formatPrice(property.price)}
            </div>
            <div className="text-sm text-gray-500">
              {property.type}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}