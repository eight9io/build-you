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
    return res;
  },
  function (error) {
    console.log('axios error', error);
    const status = error.response ? error.response.status : null
    if ([400].includes(status)) {
      const result = error.data;
      // TODO: add gobal modal error
      handleError(result);
      return result;
    } else if ([401].includes(status)) {
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const canRefreshToken = checkRefreshTokenLocalValidation();
        console.log('canRefreshToken', canRefreshToken);
        if (!canRefreshToken) {
          // TODO: add logout
          return Promise.reject('token is not valid');
        } else {
          return httpInstance(originalRequest);
        }
      } else {
        // add gobal modal
        return Promise.reject('token is not valid');
      }
    }
    return Promise.reject(error);
  }
);

export default httpInstance;
