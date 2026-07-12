import API from '../config/api';
import { getToken } from './storage';

interface FetchOptions {
  method?: string;
  body?: object;
  headers?: Record<string, string>;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(
      `API Error: ${response.statusText}`,
      response.status
    );
  }

  return response.json();
}

export async function login(mobile: string, password: string) {
  return apiFetch<{ token: string; user: { id: string; name: string; mobile: string; role: 'admin' | 'guest' } }>(
    API.LOGIN,
    { method: 'POST', body: { mobile, password } }
  );
}

export async function verifyToken() {
  return apiFetch<{ valid: boolean; user: { id: string; name: string; mobile: string; role: 'admin' | 'guest' } }>(
    API.VERIFY
  );
}

export async function fetchBatches() {
  return apiFetch<{ batches: Array<{ id: string; name: string; description?: string; icon?: string; subjects: Array<{ id: string; name: string; icon?: string; batchId: string; lectures: Array<{ id: string; title: string; description?: string; thumbnail?: string; duration?: string; servers: Array<{ id: string; name: string }>; subjectId: string; batchId: string; order: number }> }> }> }>(
    API.BATCHES
  );
}

export async function fetchLecture(id: string) {
  return apiFetch<{ lecture: { id: string; title: string; description?: string; thumbnail?: string; duration?: string; servers: Array<{ id: string; name: string; embedUrl: string }>; subjectId: string; batchId: string; order: number } }>(
    API.LECTURE(id)
  );
}

export { ApiError };
