/**
 * Tara Typing API Client
 *
 * Configured for real backend integration at http://localhost:5000/api
 * Supports HTTP-only cookie authentication via credentials: 'include'.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiRequest = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...options.headers,
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  } else {
    delete headers['Content-Type'];
    delete headers['content-type'];
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Essential for sending and receiving HTTP-only accessToken cookies
    body: isFormData
      ? options.body
      : options.body && typeof options.body === 'object'
        ? JSON.stringify(options.body)
        : options.body,
  };

  try {
    const response = await fetch(url, config);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const isBlocked =
        response.status === 403 &&
        typeof data === 'object' &&
        (data?.message?.includes('blocked') || data?.message?.includes('deactivated') || data?.message?.includes('suspended'));

      if ((response.status === 401 || isBlocked) && !endpoint.includes('/auth/login')) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
      }

      const message =
        (typeof data === 'object' && data?.message) ||
        (typeof data === 'string' && data) ||
        `Request failed with status ${response.status}`;

      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const netErr = new Error('Cannot reach server. Please make sure the backend is running at http://localhost:5000');
      netErr.status = 0;
      throw netErr;
    }
    throw err;
  }
};

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default apiRequest;

