
import { supabase } from '../config/supabase';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(path, options = {}) {
  if (!API_URL) {
    throw new Error('VITE_API_URL is not configured.');
  }

  const {
    method = 'GET',
    body,
    headers = {},
    signal,
  } = options;

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  // Get the current Supabase access token.
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message || 'Unable to retrieve authentication session.');
  }

  if (session?.access_token) {
    requestHeaders.Authorization = `Bearer ${session.access_token}`;
  }

  const config = {
    method,
    headers: requestHeaders,
    credentials: 'include',
    signal,
  };

  if (body instanceof FormData) {
    config.body = body;
  } else if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, config);

  if (response.status === 204) {
    if (!response.ok) {
      throw new ApiError('Request failed.', response.status);
    }

    return null;
  }

  const contentType = response.headers.get('content-type') || '';

  const data = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      (typeof data === 'string' && data) ||
      `Request failed with status ${response.status}.`;

    throw new ApiError(message, response.status, data);
  }

  return data;
}

export const api = {
  get: (path, options = {}) =>
    request(path, { ...options, method: 'GET' }),

  post: (path, body, options = {}) =>
    request(path, { ...options, method: 'POST', body }),

  put: (path, body, options = {}) =>
    request(path, { ...options, method: 'PUT', body }),

  patch: (path, body, options = {}) =>
    request(path, { ...options, method: 'PATCH', body }),

  delete: (path, options = {}) =>
    request(path, { ...options, method: 'DELETE' }),
};

export default api;
