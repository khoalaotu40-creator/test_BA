export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  bio?: string;
  university?: string;
  studentId?: string;
  studentCardImage?: string; // base64 or sample URL
  isVerified: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationData {
  university: string;
  studentId: string;
  cardImage: string | null;
  cardImageName?: string;
  notes?: string;
  submittedAt?: string;
  status: 'draft' | 'pending' | 'verified';
}

export interface RideShareItem {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userUniversity: string;
  isVerified: boolean;
  type: 'driver' | 'passenger';
  departure: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  priceNote: string;
  createdAt: string;
}

export interface AppSyncData {
  version: number;
  lastSyncedAt: string;
  currentUser: UserProfile | null;
  users: UserProfile[];
  verification: VerificationData;
  rides: RideShareItem[];
}

export type ScreenId = 'login' | 'register' | 'verify' | 'verified-profile';
export type ViewMode = 'interactive' | 'mockup-preview';
