import { Property } from '@/api/types/property.type'

export interface PriceHistory {
  date: string
  price: number
  currency: string
}

export interface HostInfo {
  id: string
  name: string
  avatar?: string
  phone: string
  maskedPhone: string
  role: string
  isOnline?: boolean
}

export interface LocationData {
  coordinates?: {
    latitude: number
    longitude: number
  }
  nearbyPlaces?: {
    type: 'transport' | 'shopping' | 'education' | 'healthcare'
    name: string
    distance: string
    walkTime: string
  }[]
}

export interface ApartmentDetail extends Property {
  // Additional fields for apartment detail page
  direction?: string
  postDate?: string
  location?: LocationData
  priceIncrease?: {
    amount: number
    percentage: number
  }
  smartPriceScore?: number
  availability?: {
    status: 'available' | 'unavailable' | 'pending'
    message: string
  }
  host: HostInfo
  priceHistory: PriceHistory[]
  videoTour?: string
  fullDescription?: string
}

export interface SimilarProperty {
  id: string
  title: string
  address: string
  city: string
  price: number
  currency: string
  bedrooms: number
  area: number
  image: string
  district: string
}

// Mock data for the apartment detail page
export const mockApartmentDetail: ApartmentDetail = {
  id: '1',
  title: 'Modern Studio Apartment in City Center',
  description:
    'A beautifully designed studio apartment featuring contemporary furnishings, large windows with city views, and premium amenities in the heart of District 1.',
  fullDescription:
    'This stunning studio apartment offers the perfect blend of modern comfort and urban convenience. Located in the prestigious heart of District 1, this fully furnished unit features floor-to-ceiling windows that flood the space with natural light while providing breathtaking city views. The apartment boasts a sleek, open-plan design with a modern kitchen equipped with premium appliances, a comfortable living area with high-quality furniture, and a luxurious bathroom with contemporary fixtures. The building offers 24/7 security, elevator access, and is within walking distance of major shopping centers, restaurants, and business districts.',
  address: '123 Nguyễn Huệ Street, District 1',
  city: 'Ho Chi Minh City',
  property_type: 'Studio',
  bedrooms: 1,
  bathrooms: 1,
  price: 11250000,
  currency: 'VND',
  area: 35,
  direction: 'East',
  furnishing: 'Fully Furnished',
  verified: true,
  featured: true,
  views: 127,
  postDate: '3 days ago',
  location: {
    coordinates: {
      latitude: 10.7769,
      longitude: 106.7009,
    },
    nearbyPlaces: [
      {
        type: 'transport',
        name: 'Bến Thành Metro Station',
        distance: '0.8km',
        walkTime: '10 min walk',
      },
      {
        type: 'shopping',
        name: 'Saigon Centre',
        distance: '0.5km',
        walkTime: '6 min walk',
      },
    ],
  },
  images: [
    '/images/apartment1-main.jpg',
    '/images/apartment1-living.jpg',
    '/images/apartment1-kitchen.jpg',
    '/images/apartment1-bathroom.jpg',
    '/images/apartment1-bedroom.jpg',
  ],
  videoTour: '/videos/apartment1-tour.mp4',
  amenities: [
    'Air conditioning',
    'Balcony',
    'Parking',
    'Elevator',
    'Pet friendly',
    'Gym',
    'Swimming pool',
    'Security',
    'WiFi',
    'Laundry',
  ],
  priceIncrease: {
    amount: 250000,
    percentage: 2.3,
  },
  smartPriceScore: 8.5,
  availability: {
    status: 'available',
    message: 'Available now – Ready for immediate move-in',
  },
  host: {
    id: 'host1',
    name: 'Anh Nguyễn Văn Minh',
    phone: '+84123456789',
    maskedPhone: '841******89',
    role: 'Owner',
    isOnline: true,
  },
  priceHistory: [
    {
      date: '03/01/2024',
      price: 11250000,
      currency: 'VND',
    },
    {
      date: '02/01/2024',
      price: 11000000,
      currency: 'VND',
    },
    {
      date: '01/01/2024',
      price: 10750000,
      currency: 'VND',
    },
  ],
}

export const mockSimilarProperties: SimilarProperty[] = [
  {
    id: '2',
    title: '2-bedroom cozy apartment near university',
    address: 'Võ Văn Tần Street',
    city: 'Ho Chi Minh City',
    district: 'District 3',
    price: 9500000,
    currency: 'VND',
    bedrooms: 2,
    area: 50,
    image: '/images/similar1.jpg',
  },
  {
    id: '3',
    title: '3-bedroom luxury apartment with city view',
    address: 'Đồng Khởi Street',
    city: 'Ho Chi Minh City',
    district: 'District 1',
    price: 21250000,
    currency: 'VND',
    bedrooms: 3,
    area: 120,
    image: '/images/similar2.jpg',
  },
  {
    id: '4',
    title: '1-bedroom affordable apartment',
    address: 'Nguyễn Thị Minh Khai Street',
    city: 'Ho Chi Minh City',
    district: 'District 7',
    price: 4500000,
    currency: 'VND',
    bedrooms: 1,
    area: 25,
    image: '/images/similar3.jpg',
  },
  {
    id: '5',
    title: '1-bedroom modern apartment',
    address: 'Lê Văn Sỹ Street',
    city: 'Ho Chi Minh City',
    district: 'District 2',
    price: 8000000,
    currency: 'VND',
    bedrooms: 1,
    area: 40,
    image: '/images/similar4.jpg',
  },
]
