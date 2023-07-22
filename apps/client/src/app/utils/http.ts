import axios, { Axios } from 'axios';
import {
  checkRefreshTokenLocalValidation,
  logout,
  removeAuthTokensLocalOnLogout,
} from './checkAuth';
import GlobalDialogController from '../component/common/Dialog/GlobalDialogController';

const httpInstance = axios.create({
  timeout: 60000,
  baseURL: process.env.NX_API_URL,
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
          const newAuthToken = await checkRefreshTokenLocalValidation();
          console.log('newAuthToken', newAuthToken);
          if (!newAuthToken) {
            console.log('token is not valid');
            reject('token is not valid');
          } else {
            setAuthTokenToHttpHeader(newAuthToken);
            originalRequest.headers['Authorization'] = `Bearer ${newAuthToken}`;
            // call new request with new token
            try {
              console.log('call new request with new token');
              const res = await httpInstance(originalRequest);
              resolve(res);
            } catch (error) {
              handleError(error);
            }
          }
        } else {
          GlobalDialogController.showModal({
            title: 'Error',
            message: 'Session expires. Please login again',
            button: 'OK',
          });
          logout();
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
