const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/** Builds an API URL for either the local Express server or a separately hosted API. */
export const apiUrl = (path: string) => `${apiBaseUrl}${path}`;
