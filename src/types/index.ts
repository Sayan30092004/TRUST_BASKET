export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  area: string;
  city: string;
}

export interface UserPreferences {
  language: 'en' | 'hi' | 'bn' | 'ta';
  location: Location;
  phone: string;
  name: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  thumbsUp: number;
  thumbsDown: number;
  isVerified: boolean;
  location: Location;
  distance?: number; // calculated distance from user
}

export interface Post {
  id: string;
  content: string;
  category: string;
  authorName: string;
  authorPhone: string;
  supplierName?: string;
  likes: number;
  dislikes: number;
  comments: number;
  timestamp: Date;
  location: Location;
  distance?: number;
}