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
  gymId: string;
  name: string;
  role: 'member' | 'trainer' | 'admin';
  membershipType: 'basic' | 'premium' | 'vip';
  joinDate: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
