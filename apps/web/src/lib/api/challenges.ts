import {
  Challenge,
  Participation,
  LeaderboardResponse,
  ChallengeListResponse,
  ChallengeFilters,
} from '@/types/challenge';

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

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || `HTTP ${response.status}`
    );
  }

  return response.json();
}

export const challengesApi = {
  // Get all challenges with filters
  async getChallenges(
    filters: ChallengeFilters = {}
  ): Promise<ChallengeListResponse> {
    const params = new URLSearchParams();

    if (filters.active !== undefined)
      params.append('active', filters.active.toString());
    if (filters.type) params.append('type', filters.type);
    if (filters.upcoming) params.append('upcoming', 'true');
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.cursor) params.append('cursor', filters.cursor);

    const queryString = params.toString();
    const url = `/challenges${queryString ? `?${queryString}` : ''}`;

    return fetchWithAuth(url);
  },

  // Get single challenge
  async getChallenge(id: string): Promise<Challenge> {
    return fetchWithAuth(`/challenges/${id}`);
  },

  // Join challenge
  async joinChallenge(id: string, startAt?: string): Promise<Participation> {
    return fetchWithAuth(`/challenges/${id}/join`, {
      method: 'POST',
      body: JSON.stringify({ startAt }),
    });
  },

  // Get user's participation in challenge
  async getParticipation(id: string): Promise<Participation> {
    return fetchWithAuth(`/challenges/${id}/participation`);
  },

  // Mark progress for a day
  async markProgress(
    id: string,
    day: number,
    completed: boolean
  ): Promise<Participation> {
    return fetchWithAuth(`/challenges/${id}/progress`, {
      method: 'POST',
      body: JSON.stringify({ day, completed }),
    });
  },

  // Get leaderboard
  async getLeaderboard(
    id: string,
    limit: number = 10
  ): Promise<LeaderboardResponse> {
    return fetchWithAuth(`/challenges/${id}/leaderboard?limit=${limit}`);
  },

  // Get user's challenges
  async getUserChallenges(gymId: string): Promise<Challenge[]> {
    return fetchWithAuth(`/challenges/user/${gymId}`);
  },

  // Leave challenge
  async leaveChallenge(id: string): Promise<{ message: string }> {
    return fetchWithAuth(`/challenges/${id}/leave`, {
      method: 'POST',
    });
  },

  // Admin endpoints (for future use)
  async createChallenge(data: any): Promise<Challenge> {
    return fetchWithAuth('/challenges', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateChallenge(id: string, data: any): Promise<Challenge> {
    return fetchWithAuth(`/challenges/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteChallenge(id: string): Promise<{ message: string }> {
    return fetchWithAuth(`/challenges/${id}`, {
      method: 'DELETE',
    });
  },
};

export { ApiError };
