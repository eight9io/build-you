import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import httpInstance from './http';

interface IToken {
  exp: number;
  iat: number;
  sub: string;
}

export const decodedAuthToken = (token: string) => {
  return jwt_decode(token) as IToken;
};

export const checkAuthTokenValidation = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('@auth_token');
    if (accessToken) {
      const deocdedToken = decodedAuthToken(accessToken);
      const currentTime = Date.now() / 1000;
      if (deocdedToken?.exp < currentTime) {
        const refreshToken = await AsyncStorage.getItem('@refresh_token');
        if (refreshToken) {
          const decodedRefreshToken = decodedAuthToken(refreshToken);
          if (decodedRefreshToken?.exp < currentTime) {
            await AsyncStorage.removeItem('@auth_token');
            await AsyncStorage.removeItem('@refresh_token');
            return false;
          } else {
            const res = await httpInstance.post('/auth/refresh-token', {
              token: refreshToken,
            });
            await AsyncStorage.setItem('@auth_token', res.data.accessToken);
            return true;
          }
        }
      } else {
        return true;
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('@refresh_token');
    if (refreshToken) {
      const decodedRefreshToken = decodedAuthToken(refreshToken);
      const currentTime = Date.now() / 1000;
      if (decodedRefreshToken?.exp < currentTime) {
        await AsyncStorage.removeItem('@auth_token');
        await AsyncStorage.removeItem('@refresh_token');
      } else {
        const res = await axios.post(
          'http://localhost:5000/auth/refresh-token',
          { refreshToken }
        );
        await AsyncStorage.setItem('@auth_token', res.data.accessToken);
      }
    }
  } catch (e) {
    console.error(e);
  }
};
