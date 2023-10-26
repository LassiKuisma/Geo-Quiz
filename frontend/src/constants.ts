const envUrl = process.env.REACT_APP_LOCAL_BACKEND_URL;

export const apiBaseUrl =
  process.env.NODE_ENV === 'production' ? '/api' : envUrl;

export const USER_STORAGE_PATH = 'geo-quiz-app-user';
export const PREFERRED_THEME_PATH = 'geo-quiz-theme';
export const CURRENT_GAME_ID = 'geo-quiz-active-game';
