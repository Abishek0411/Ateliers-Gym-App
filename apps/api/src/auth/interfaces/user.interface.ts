export interface User {
  gymId: string;
  name: string;
  email: string;
  password: string;
  role: 'member' | 'trainer' | 'admin';
  membershipType: 'basic' | 'premium' | 'vip';
  joinDate: string;
  isActive: boolean;
  lastLogin?: string;
}
