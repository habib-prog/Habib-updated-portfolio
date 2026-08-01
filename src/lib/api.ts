const configuredApiBaseUrl = (
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || ''
).trim();
const apiBaseUrl = configuredApiBaseUrl.replace(/\/$/, '');

// Render serves both the portfolio and Express API from the same origin, so it
// does not need a public API URL. Netlify requires VITE_API_URL instead.
const usesSameOriginApi = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.endsWith('.onrender.com')
);

export const isApiAvailable = Boolean(configuredApiBaseUrl) || usesSameOriginApi;

export const apiRequest = (path: string, init?: RequestInit): Promise<Response> => {
  if (!isApiAvailable) {
    return Promise.resolve(new Response(null, {
      status: 503,
      statusText: 'API is not configured for this deployment',
    }));
  }

  return fetch(`${apiBaseUrl}${path}`, init);
};
