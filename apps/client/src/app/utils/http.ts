import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkRefreshTokenLocalValidation } from './checkAuth';

const httpInstance = axios.create({
  timeout: 60000,
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// if repsone status is 401, refresh token and retry
// httpInstance.interceptors.request.use(
//   async function (config) {
//     const isTokenValid = await checkAuthTokenLocalValidation();
//     if (isTokenValid) {
//       return config;
//     } else {
//       // add gobal modal
//       return Promise.reject('token is not valid');
//     }
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

const handleError = (error: any) => console.log(error);

export const setAuthTokenToHttpHeader = (token: string | null) => {
  if (token) {
    httpInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete httpInstance.defaults.headers.common['Authorization'];
  }
};

// export function setupInterceptor() {
//   httpInstance.interceptors.request.use(
//     function (config) {
//       return config;
//     },
//     function (error) {
//       handleError(error);
//       return Promise.reject(error);
//     }
//   );

  httpInstance.interceptors.response.use(
    function (res) {
      if ([200, 201, 203, 204 ].includes(res.status)) {
        return res;
      } else if ([400, 401].includes(res.status)) {
        const result = res.data;
        handleError(result);
        return result;
      } else if ([401].includes(res.status)) {
        const originalRequest = res.config;
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          return checkRefreshTokenLocalValidation().then((res) => {
            if (res) {
              return httpInstance(originalRequest);
            } else {
              // add gobal modal
              return Promise.reject('token is not valid');
            }
          });
        } else {
          // add gobal modal
          return Promise.reject('token is not valid');
        }
      }
      return;
    },
    function (error) {
      handleError(error);
      return Promise.reject(error);
    }
  );

export default httpInstance;
