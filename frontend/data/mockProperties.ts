import { Property } from '@/types/property';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Villa in Raipur',
    price: 8500000,
    location: 'Raipur, Chhattisgarh',
    tags: ['new', 'trending'],
    image: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg',
    description: 'Beautiful luxury villa with modern amenities in the heart of Raipur. Perfect for families looking for spacious living.',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    type: 'Villa',
    amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security', 'Gym'],
    images: [
      'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg'
    ],
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  },
  {
    id: '2',
    title: 'Modern Apartment Complex',
    price: 3200000,
    location: 'Bilaspur, Chhattisgarh',
    tags: ['fast-filling'],
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    description: 'Contemporary apartment with all modern facilities. Great investment opportunity in growing Bilaspur.',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: 'Apartment',
    amenities: ['Elevator', 'Parking', 'Security', 'Power Backup'],
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg',
      'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg'
    ],
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
  },
  {
    id: '3',
    title: 'Premium Penthouse',
    price: 12000000,
    location: 'Raipur, Chhattisgarh',
    tags: ['sold-out'],
    image: 'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg',
    description: 'Exclusive penthouse with panoramic city views. Sold out due to high demand.',
    bedrooms: 3,
    bathrooms: 3,
    area: 2000,
    type: 'Penthouse',
    amenities: ['Terrace Garden', 'City View', 'Premium Fittings', 'Parking'],
    images: [
      'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg',
      'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'
    ],
    publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString() // 21 days ago
  },
  {
    id: '4',
    title: 'Family Home in Durg',
    price: 4500000,
    location: 'Durg, Chhattisgarh',
    tags: ['new'],
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    description: 'Spacious family home perfect for growing families. New construction with modern amenities.',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    type: 'House',
    amenities: ['Garden', 'Parking', 'Storage', 'Balcony'],
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'
    ],
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: '5',
    title: 'Riverside Cottage',
    price: 2800000,
    location: 'Korba, Chhattisgarh',
    tags: ['trending'],
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    description: 'Charming cottage by the river with peaceful surroundings. Perfect for nature lovers.',
    bedrooms: 2,
    bathrooms: 1,
    area: 1000,
    type: 'Cottage',
    amenities: ['River View', 'Garden', 'Peaceful Location', 'Natural Light'],
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg',
      'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg'
    ],
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  },
  {
    id: '6',
    title: 'Executive Suite',
    price: 6200000,
    location: 'Raipur, Chhattisgarh',
    tags: ['fast-filling', 'trending'],
    image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg',
    description: 'Premium executive suite in prime location. High-end finishes and luxury amenities.',
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    type: 'Suite',
    amenities: ['Premium Location', 'Luxury Fittings', 'Concierge', 'Parking'],
    images: [
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg'
    ],
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  }
];