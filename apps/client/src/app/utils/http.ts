import axios from 'axios';
import { checkRefreshTokenLocalValidation } from './checkAuth';
import GlobalDialogController from '../component/common/Dialog/GlobalDialogController';

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

httpInstance.interceptors.response.use(
  function (res) {
    return res;
  },
  function (error) {
    const status = error.response ? error.response.status : null;
    if ([401].includes(status)) {
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const canRefreshToken = checkRefreshTokenLocalValidation();
        if (!canRefreshToken) {
          return Promise.reject('token is not valid');
        } else {
          return httpInstance(originalRequest);
        }
      } else {
        // add gobal modal
        return Promise.reject('token is not valid');
      }
    } else if ([500, 501, 502, 503].includes(status)) {
      GlobalDialogController.showModal(
        'Something went wrong. Please try again laters.'
      );
      return Promise.reject('Server error');
    }
    return Promise.reject(error);
  }
);

export default httpInstance;
