import { Post, CreatePostData, User } from '@/types/community';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.103:3001';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(response.status, errorData.message || 'Request failed');
  }

  return response.json();
}

// Community API functions
export const communityApi = {
  // Get all posts (feed)
  async getFeed(): Promise<Post[]> {
    return apiRequest<Post[]>('/community/feed');
  },

  // Get user's own posts with pagination
  async getMyPosts(
    limit = 20,
    cursor?: string
  ): Promise<{
    posts: Post[];
    hasMore: boolean;
    nextCursor?: string;
  }> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append('cursor', cursor);

    return apiRequest<{
      posts: Post[];
      hasMore: boolean;
      nextCursor?: string;
    }>(`/community/my-posts?${params}`);
  },

  // Create a new post
  async createPost(postData: CreatePostData): Promise<Post> {
    return apiRequest<Post>('/community/post', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  // Update a post
  async updatePost(
    postId: string,
    updateData: Partial<CreatePostData>
  ): Promise<Post> {
    return apiRequest<Post>(`/community/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  // Delete a post
  async deletePost(postId: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/community/${postId}`, {
      method: 'DELETE',
    });
  },

  // Toggle like on a post
  async toggleLike(
    postId: string
  ): Promise<{ likesCount: number; liked: boolean }> {
    return apiRequest<{ likesCount: number; liked: boolean }>(
      `/community/${postId}/like`,
      {
        method: 'POST',
      }
    );
  },

  // Add a comment to a post
  async addComment(
    postId: string,
    text: string
  ): Promise<{
    _id: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: string;
  }> {
    return apiRequest<{
      _id: string;
      userId: string;
      userName: string;
      text: string;
      createdAt: string;
    }>(`/community/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  // Delete a comment
  async deleteComment(
    postId: string,
    commentId: string
  ): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `/community/${postId}/comment/${commentId}`,
      {
        method: 'DELETE',
      }
    );
  },

  // Upload media file
  async uploadMedia(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('access_token');

    const response = await fetch(`${API_BASE_URL}/community/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Upload failed' }));
      throw new ApiError(response.status, errorData.message || 'Upload failed');
    }

    return response.json();
  },
};

export { ApiError };
