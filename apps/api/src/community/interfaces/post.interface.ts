export interface Post {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
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
}

export interface UploadResponseDto {
  url: string;
  publicId: string;
}
