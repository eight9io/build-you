import axios from 'axios';
// import { checkRefreshTokenLocalValidation, logout } from './checkAuth';
// import GlobalDialogController from '../component/common/Dialog/GlobalDialogController';

const httpInstance = axios.create({
  timeout: 60000,
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleError = (error: any) => console.log(error);

export const setAuthTokenToHttpHeader = (token: string | null) => {
  if (token) {
    httpInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete httpInstance.defaults.headers.common['Authorization'];
  }
};

export default httpInstance;
