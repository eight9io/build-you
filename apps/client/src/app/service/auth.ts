import { LoginForm, RegisterForm } from '../types/auth';
import axios from 'axios';

import http from '../utils/http';
import { LINKEDIN_LOGIN } from '../common/constants';

export const serviceLogin = (data: LoginForm) => {
  return http.post('/auth/login', data);
};
export const serviceRegister = (data: RegisterForm) => {
  return http.post('/user/create', data);
};

export const getLinkedInAccessToken = (code: string) => {
  return http.post(
    LINKEDIN_LOGIN.ACCESS_TOKEN_ENDPOINT,
    {
      grant_type: 'authorization_code',
      code,
      client_id: process.env.NX_LINKEDIN_CLIENT_ID,
      client_secret: process.env.NX_LINKEDIN_CLIENT_SECRET,
      redirect_uri: process.env.NX_LINKEDIN_REDIRECT_URI,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      baseURL: LINKEDIN_LOGIN.BASE_URL,
    }
  );
};

export const validateInAppToken = (token: string) => {
  return http.post('/auth/validate', { token });
}