import { User } from '@/types/community';

const API_BASE_URL = 'http://localhost:3001';

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
    throw new ApiError(
      response.status,
      `API request failed: ${response.statusText}`
    );
  }

  return response.json();
}

async function apiRequestWithFile<T>(
  endpoint: string,
  file: File,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token');

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `API request failed: ${response.statusText}`
    );
  }

  return response.json();
}

export const usersApi = {
  // Get current user's profile
  getMyProfile: (): Promise<User> => apiRequest<User>('/users/me'),

  // Update current user's profile
  updateMyProfile: (data: Partial<User>): Promise<User> =>
    apiRequest<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Upload avatar
  uploadAvatar: (file: File): Promise<User> =>
    apiRequestWithFile<User>('/users/me/avatar', file),

  // Add measurement
  addMeasurement: (data: {
    date?: string;
    weightKg?: number;
    chestCm?: number;
    waistCm?: number;
    hipsCm?: number;
    notes?: string;
  }): Promise<User> =>
    apiRequest<User>('/users/me/measurements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update measurement
  updateMeasurement: (
    measurementId: string,
    data: {
      date?: string;
      weightKg?: number;
      chestCm?: number;
      waistCm?: number;
      hipsCm?: number;
      notes?: string;
    }
  ): Promise<User> =>
    apiRequest<User>(`/users/me/measurements/${measurementId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Delete measurement
  deleteMeasurement: (measurementId: string): Promise<{ message: string }> =>
    apiRequest<{ message: string }>(`/users/me/measurements/${measurementId}`, {
      method: 'DELETE',
    }),
};

export { ApiError };
