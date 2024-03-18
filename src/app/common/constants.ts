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
