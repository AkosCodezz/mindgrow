import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * API client for calling the NestJS backend.
 * Automatically attaches the Supabase JWT token to every request.
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = getSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  return headers;
}

async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `API error: ${res.status}`);
  }

  // Handle 204 No Content
  if (res.status === 204) return null as T;

  return res.json();
}

// ── Auth ─────────────────────────────────────────────
export const authApi = {
  getProfile: () => apiFetch('/auth/profile'),
};

// ── Journals ─────────────────────────────────────────
export const journalsApi = {
  getAll: () => apiFetch('/journals'),
  getOne: (id: string) => apiFetch(`/journals/${id}`),
  create: (data: { date: string; content: string; mood?: string; tags?: string[] }) =>
    apiFetch('/journals', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    apiFetch(`/journals/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) =>
    apiFetch(`/journals/${id}`, { method: 'DELETE' }),
};

// ── Goals ────────────────────────────────────────────
export const goalsApi = {
  getAll: () => apiFetch('/goals'),
  getOne: (id: string) => apiFetch(`/goals/${id}`),
  create: (data: { title: string; description?: string; deadline?: string }) =>
    apiFetch('/goals', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    apiFetch(`/goals/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) =>
    apiFetch(`/goals/${id}`, { method: 'DELETE' }),
};

// ── Habits ───────────────────────────────────────────
export const habitsApi = {
  getAll: () => apiFetch('/habits'),
  getOne: (id: string) => apiFetch(`/habits/${id}`),
  create: (data: { title: string; description?: string }) =>
    apiFetch('/habits', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    apiFetch(`/habits/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) =>
    apiFetch(`/habits/${id}`, { method: 'DELETE' }),
};

// ── Courses ──────────────────────────────────────────
export const coursesApi = {
  getAll: () => apiFetch('/courses'),
  enroll: (courseId: string) =>
    apiFetch(`/courses/${courseId}/enroll`, { method: 'POST' }),
  getMyEnrollments: () => apiFetch('/courses/me/enrollments'),
};

// ── Users ────────────────────────────────────────────
export const usersApi = {
  getMe: () => apiFetch('/users/me'),
};
