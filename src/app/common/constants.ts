import { Platform } from "react-native";

const isAnroid = Platform.OS === "android";

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
  BASE_URL: "https://maps.googleapis.com",
  NEARBY_SEARCH_ENDPOINT: "/maps/api/geocode/json",
  API_KEY: isAnroid
    ? process.env.EXPO_ANDROID_GOOGLE_KEY
    : process.env.EXPO_IOS_GOOGLE_KEY,
  DEFAULT_RADIUS: 1500, // unit: meters
};
