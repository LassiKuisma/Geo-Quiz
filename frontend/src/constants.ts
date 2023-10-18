const envUrl = process.env.REACT_APP_LOCAL_BACKEND_URL;

export const apiBaseUrl =
  process.env.NODE_ENV === 'production' ? '/api' : envUrl;

export const USER_STORAGE_PATH = 'geo-quiz-app-user';
