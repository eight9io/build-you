import { Platform } from "react-native";
export const LINKEDIN_LOGIN = {
  BASE_URL: "https://www.linkedin.com/oauth/v2",
  AUTHORIZATION_URL: "https://www.linkedin.com/oauth/v2/authorization",
  ACCESS_TOKEN_URL: "https://www.linkedin.com/oauth/v2/accessToken",
  LOGIN_CANCEL_URL: "https://www.linkedin.com/oauth/v2/login-cancel",
  SESSION_REDIRECT_URL: "https://www.linkedin.com/uas/login?session_redirect",
  AUTHORIZATION_ENDPOINT: "/authorization",
  ACCESS_TOKEN_ENDPOINT: "/accessToken",
  LOGIN_CANCEL_ENDPOINT: "/login-cancel",
};

export const GOOGLE_MAP_API = {
  BASE_URL: "https://maps.googleapis.com",
  NEARBY_SEARCH_ENDPOINT: "/maps/api/place/nearbysearch/json",
  API_KEY: Platform.select({
    ios: process.env.EXPO_IOS_GOOGLE_KEY,
    android: process.env.EXPO_ANDROID_GOOGLE_KEY,
  }),
  DEFAULT_RADIUS: 1500, // unit: meters
};
