import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import httpInstance, { setAuthTokenToHttpHeader } from './http';

interface IToken {
  exp: number;
  iat: number;
  sub: string;
}

export const decodedAuthToken = (token: string) => {
  return jwt_decode(token) as IToken;
};

export const addAuthTokensLocalOnLogin = async (
  accessToken: string | null,
  refreshToken: string | null
) => {
  try {
    if (accessToken && refreshToken) {
      await AsyncStorage.setItem('@auth_token', accessToken);
      await AsyncStorage.setItem('@refresh_token', refreshToken);
      setAuthTokenToHttpHeader(accessToken);
    }
  } catch (e) {
    console.error('addAuthTokensLocal', e);
  }
};

export const checkAccessTokenLocal = async (setLogined: any) => {
  const isAccessTokenLocalValid = await checkAuthTokenLocalValidation();
  try {
    if (isAccessTokenLocalValid) {
      setLogined(true);
    } else {
      setLogined(false);
    }
  } catch (error) {
    console.log(error);
  }
};

export const removeAuthTokensLocalOnLogout = async () => {
  try {
    await AsyncStorage.removeItem('@auth_token');
    await AsyncStorage.removeItem('@refresh_token');
    setAuthTokenToHttpHeader(null);
  } catch (e) {
    console.error('removeAuthTokensLocal', e);
  }
};

export const checkAuthTokenLocalValidation = async () => {
  try {
    const accessTokenLocal = await AsyncStorage.getItem('@auth_token');
    const refreshTokenLocal = await AsyncStorage.getItem('@refresh_token');
    if (!accessTokenLocal) return false;
    if (accessTokenLocal) {
      const deocdedToken = decodedAuthToken(accessTokenLocal);
      const currentTime = Date.now() / 1000;
      if (deocdedToken?.exp < currentTime) {
        if (refreshTokenLocal) {
          const decodedRefreshToken = decodedAuthToken(refreshTokenLocal);
          if (decodedRefreshToken?.exp < currentTime) {
            removeAuthTokensLocalOnLogout();
            return false;
          } else {
            const newTokens = await httpInstance
              .post('/auth/refresh', {
                token: refreshTokenLocal,
              })
              .then((res) => {
                return res;
              });
            if (newTokens.status !== 201) {
              removeAuthTokensLocalOnLogout();
            } else {
              addAuthTokensLocalOnLogin(
                newTokens.data.authorization,
                newTokens.data.refresh
              );
              return true;
            }
          }
        } else {
          removeAuthTokensLocalOnLogout();
          return false;
        }
      } else {
        addAuthTokensLocalOnLogin(accessTokenLocal, refreshTokenLocal);
        return true;
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const checkRefreshTokenLocalValidation = async () => {
  try {
    const refreshTokenLocal = await AsyncStorage.getItem('@refresh_token');
    console.log('refreshTokenLocal', refreshTokenLocal);
    if (!refreshTokenLocal) return false;
    const decodedRefreshToken = decodedAuthToken(refreshTokenLocal);
    const currentTime = Date.now() / 1000;
    if (decodedRefreshToken?.exp < currentTime) {
      removeAuthTokensLocalOnLogout();
      return false;
    } else {
      const newTokens = await httpInstance
        .post('/auth/refresh', {
          token: refreshTokenLocal,
        })
        .then((res) => {
          return res;
        });
      console.log('refreshTokenLocal', newTokens);
      if (newTokens.status !== 201) {
        removeAuthTokensLocalOnLogout();
      } else {
        addAuthTokensLocalOnLogin(
          newTokens.data.authorization,
          newTokens.data.refresh
        );
        return true;
      }
    }
    return true;
  } catch (e) {
    console.error(e);
  }
};

export const checkAuthToken = async (accessToken: string | null) => {
  if (!accessToken) return false;
  const decodedToken = decodedAuthToken(accessToken);
  const currentTime = Date.now() / 1000;
  if (decodedToken?.exp < currentTime) {
    return false;
  }
  return true;
};
