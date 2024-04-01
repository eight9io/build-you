export const LINKEDIN_LOGIN = {
  BASE_URL: "https://www.linkedin.com/oauth/v2",
  AUTHORIZATION_URL: "https://www.linkedin.com/oauth/v2/authorization",
  ACCESS_TOKEN_URL: "https://www.linkedin.com/oauth/v2/accessToken",
  LOGIN_CANCEL_URL: "https://www.linkedin.com/oauth/v2/login-cancel",
  SESSION_REDIRECT_URL: "https://www.linkedin.com/uas/login?session_redirect",
  AUTHORIZATION_ENDPOINT: "/authorization",
  ACCESS_TOKEN_ENDPOINT: "/accessToken",
  LOGIN_CANCEL_ENDPOINT: "/login-cancel",
  CLIENT_ID: process.env.EXPO_LINKEDIN_CLIENT_ID,
  REDIRECT_URI: process.env.EXPO_LINKEDIN_REDIRECT_URI,
};

export const GOOGLE_MAP_API = {
  API_KEY: process.env.EXPO_GOOGLE_API_KEY,
};

export const LAYOUT_THRESHOLD = 870;
export const MAIN_SCREEN_MAX_WIDTH = 630;
export const DRAWER_MAX_WIDTH = 240;
export const MODAL_MAX_WIDTH = 630;
export const DIALOG_MAX_WIDTH = 582;
export const SCREEN_WITHOUT_DRAWER_MAX_WIDTH = 768;
export const SCREEN_WITHOUT_DRAWER_CONTENT_MAX_WIDTH = 500;

export const ASSET_MAX_SIZE = 100 * 1024 * 1024; // 100MB
export const ASSET_MAX_SIZE_TO_DISPLAY = 100; // 100MB
