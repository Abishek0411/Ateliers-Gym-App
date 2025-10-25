export interface Comment {
  _id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  authorId: string;
  authorName: string;
  authorRole: 'member' | 'trainer' | 'admin';
  text: string;
  workoutSplit:
    | 'Push'
    | 'Pull'
    | 'Legs'
    | 'Full Body'
    | 'Upper'
    | 'Lower'
    | 'Cardio'
    | 'Other';
  musclesWorked: string[];
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  cloudinaryPublicId?: string;
  cloudinaryResourceType?: 'image' | 'video';
  likes: string[]; // Array of gymIds who liked the post
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  text: string;
  workoutSplit: string;
  musclesWorked: string[];
  mediaUrl?: string;
}

export interface UploadResponse {
  url: string;
  publicId: string;
}

export interface User {
  id?: string;
  gymId: string;
  name: string;
  role: 'member' | 'trainer' | 'admin';
  membershipType: 'Basic' | 'Premium' | 'VIP';
  email?: string;
  phone?: string;
  profileImageUrl?: string;
  achievements?: string[];
  favoriteWorkouts?: string[];
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;

  // Extended profile fields
  dob?: string;
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
    date: string;
    weightKg?: number;
    chestCm?: number;
    waistCm?: number;
    hipsCm?: number;
    notes?: string;
  }>;
  isProfileComplete?: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
