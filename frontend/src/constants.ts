const envUrl = import.meta.env.REACT_APP_LOCAL_BACKEND_URL;

const isProd = import.meta.env.PROD === true;
export const apiBaseUrl = isProd ? '/api' : envUrl;

export const USER_STORAGE_PATH = 'geo-quiz-app-user';
export const PREFERRED_THEME_PATH = 'geo-quiz-theme';
export const CURRENT_GAME_ID = 'geo-quiz-active-game';
