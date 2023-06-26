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
    return new Promise(async (resolve, reject) => {
      const status = error.response ? error.response.status : null;
      if ([401].includes(status)) {
        const originalRequest = error.config;
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          const canRefreshToken = await checkRefreshTokenLocalValidation();
          if (!canRefreshToken) {
            reject('token is not valid');
          } else {
            // change token in orqinal request
            const newRequest = {
              ...originalRequest,
              headers: {
                ...originalRequest.headers,
                Authorization: `Bearer ${localStorage.getItem(
                  '@access_token'
                )}`,
              },
            };
            resolve(httpInstance(newRequest));
          }
        } else {
          // add gobal modal
          reject('token is not valid');
        }
      } else if ([500, 501, 502, 503].includes(status)) {
        GlobalDialogController.showModal({
          title: 'Error',
          message: 'Something went wrong',
          button: 'OK',
        });
        reject('Server error');
      }
      reject(error);
    });
  }
);

export default httpInstance;
