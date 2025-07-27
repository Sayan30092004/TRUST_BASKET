export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  area: string;
  city: string;
}

export interface BusinessDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  documentType: 'business_license' | 'trade_license' | 'gst_certificate' | 'shop_establishment' | 'other';
  verificationNotes?: string;
}

export interface UserPreferences {
  language: 'en' | 'hi' | 'bn' | 'ta';
  location: Location;
  phone: string;
  name: string;
  userType?: 'regular' | 'trusted' | 'verified';
  businessDocuments?: BusinessDocument[];
  isPhoneVerified?: boolean;
  verificationRequestedAt?: Date;
  verificationApprovedAt?: Date;
}

export interface OTPVerification {
  phone: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  isVerified: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  thumbsUp: number;
  thumbsDown: number;
  isVerified: boolean;
  isTrusted?: boolean;
  location: Location;
  distance?: number; // calculated distance from user
  businessDocuments?: BusinessDocument[];
  userType?: 'regular' | 'trusted' | 'verified';
}

export interface Post {
  id: string;
  content: string;
  category: string;
  authorName: string;
  authorPhone: string;
  authorUserType?: 'regular' | 'trusted' | 'verified';
  supplierName?: string;
  likes: number;
  dislikes: number;
  comments: number;
  timestamp: Date;
  location: Location;
  distance?: number;
}

export interface Vote {
  id: string;
  postId: string;
  userId: string; // user's phone number as ID
  type: 'up' | 'down';
  timestamp: Date;
  postContent: string; // for display in voting history
  postCategory: string;
}

export interface UserVote {
  postId: string;
  type: 'up' | 'down' | null;
}

export interface BusinessModel {
  trustedMembershipFee: {
    oneTime: number;
    annual: number;
    currency: string;
  };
  documentVerificationFee: number;
  features: {
    regular: string[];
    trusted: string[];
    verified: string[];
  };
  benefits: {
    trusted: string[];
    verified: string[];
  };
}