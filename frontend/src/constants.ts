const envUrl = process.env.REACT_APP_LOCAL_BACKEND_URL;

export const apiBaseUrl =
  process.env.NODE_ENV === 'production' ? '/api' : envUrl;
