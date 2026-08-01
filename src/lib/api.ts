const configuredApiBaseUrl = (
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || ''
).trim();
const apiBaseUrl = configuredApiBaseUrl.replace(/\/$/, '');

export const isApiAvailable = Boolean(configuredApiBaseUrl);

export const apiRequest = (path: string, init?: RequestInit): Promise<Response> => {
  if (!isApiAvailable) {
    return Promise.resolve(new Response(null, {
      status: 503,
      statusText: 'API is not configured for this deployment',
    }));
  }

  return fetch(`${apiBaseUrl}${path}`, init);
};
