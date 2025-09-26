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
}
