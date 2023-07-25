import {
  ChangePasswordForm,
  ILoginResponse,
  LoginForm,
  RegisterForm,
} from "../types/auth";

import http from "../utils/http";
import { LINKEDIN_LOGIN } from "../common/constants";

export const serviceLogin = (data: LoginForm) => {
  return http.post<ILoginResponse>("/auth/login", data);
};
export const serviceRegister = (data: RegisterForm) => {
  return http.post("/user/create", data);
};
export const serviceChangePassword = (data: ChangePasswordForm) => {
  return http.post("/auth/changePassword", data);
};

export const getLinkedInAccessToken = (code: string) => {
  return http.post(
    LINKEDIN_LOGIN.ACCESS_TOKEN_ENDPOINT,
    {
      grant_type: "authorization_code",
      code,
      client_id: process.env.EXPO_LINKEDIN_CLIENT_ID,
      client_secret: process.env.EXPO_LINKEDIN_CLIENT_SECRET,
      redirect_uri: process.env.EXPO_LINKEDIN_REDIRECT_URI,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      baseURL: LINKEDIN_LOGIN.BASE_URL,
    }
  );
};
export const serviceForgotPassword = (email: string) => {
  return http.get(`/auth/forgot/${email}`);
};

export const validateInAppToken = (token: string) => {
  return http.post("/auth/validate", { token });
};
export const serviceGetMyProfile = () => {
  return http.get("/user/me");
};

export const googleLogin = (token: string) => {
  return http.get<ILoginResponse>(`/auth/google/${token}`);
};

export const linkedInLogin = (token: string) => {
  return http.get<ILoginResponse>(`/auth/linkedin/${token}`);
};

export const appleLogin = (token: string) => {
  return http.get<ILoginResponse>(`/auth/apple/${token}`);
};
