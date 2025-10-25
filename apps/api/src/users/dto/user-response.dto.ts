export class UserResponseDto {
  id: string;
  gymId: string;
  name: string;
  role: 'admin' | 'trainer' | 'member';
  membershipType: 'Basic' | 'Premium' | 'VIP';
  email?: string;
  phone?: string;
  profileImageUrl?: string;
  achievements?: string[];
  favoriteWorkouts?: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Extended profile fields
  dob?: Date;
  gender?: 'male' | 'female' | 'other';
  heightCm?: number;
  weightKg?: number;
  goal?:
    | 'lose_weight'
    | 'gain_muscle'
    | 'maintain'
    | 'performance'
    | 'general_fitness';
  preferredTrainerId?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
  };
  profileImage?: {
    url: string;
    publicId?: string;
  };
  measurements?: Array<{
    _id?: string;
    date: Date;
    weightKg?: number;
    chestCm?: number;
    waistCm?: number;
    hipsCm?: number;
    notes?: string;
  }>;
  isProfileComplete?: boolean;
}
