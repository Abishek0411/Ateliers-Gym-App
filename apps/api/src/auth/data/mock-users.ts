import { User } from '../interfaces/user.interface';
import * as bcrypt from 'bcryptjs';

// Mock users data - in production, this would come from MongoDB
export const mockUsers: User[] = [
  {
    gymId: 'GYM001',
    name: 'Arasu Mounaguru',
    email: 'arasu@ateliersfitness.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    membershipType: 'vip',
    joinDate: '2020-01-15',
    isActive: true,
    lastLogin: '2024-01-15T10:30:00Z',
  },
  {
    gymId: 'GYM002',
    name: 'Rajesh Kumar',
    email: 'rajesh@ateliersfitness.com',
    password: bcrypt.hashSync('trainer2024', 10),
    role: 'trainer',
    membershipType: 'premium',
    joinDate: '2021-03-20',
    isActive: true,
    lastLogin: '2024-01-14T16:45:00Z',
  },
  {
    gymId: 'GYM003',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    password: bcrypt.hashSync('member123', 10),
    role: 'member',
    membershipType: 'basic',
    joinDate: '2023-06-10',
    isActive: true,
    lastLogin: '2024-01-13T09:15:00Z',
  },
  {
    gymId: 'GYM004',
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    password: bcrypt.hashSync('fitness2024', 10),
    role: 'member',
    membershipType: 'premium',
    joinDate: '2023-08-22',
    isActive: true,
    lastLogin: '2024-01-12T14:20:00Z',
  },
  {
    gymId: 'GYM005',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    password: bcrypt.hashSync('gymlife123', 10),
    role: 'member',
    membershipType: 'vip',
    joinDate: '2022-11-05',
    isActive: true,
    lastLogin: '2024-01-11T11:30:00Z',
  },
  {
    gymId: 'GYM006',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    password: bcrypt.hashSync('strongman2024', 10),
    role: 'member',
    membershipType: 'basic',
    joinDate: '2024-01-08',
    isActive: true,
    lastLogin: '2024-01-10T18:00:00Z',
  },
];

// Helper function to find user by gymId
export const findUserByGymId = (gymId: string): User | undefined => {
  return mockUsers.find(user => user.gymId === gymId && user.isActive);
};

// Helper function to validate password
export const validatePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
