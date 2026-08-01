const configuredApiBaseUrl = (
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || ''
).trim();
const apiBaseUrl = configuredApiBaseUrl.replace(/\/$/, '');

// With no configured URL, requests stay same-origin. On Netlify, _redirects
// proxies /api requests to Render; on Render and locally, Express serves them.
export const isApiAvailable = true;

export const apiRequest = (path: string, init?: RequestInit): Promise<Response> => {
  return fetch(`${apiBaseUrl}${path}`, init);
};
