import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
// import { setAuthTokenToHttpHeader } from "./http";
// import httpInstance, { setAuthTokenToHttpHeader } from "./http";
// import { useAuthStore } from '../store/auth-store';
// import { useIsCompleteProfileStore } from '../store/is-complete-profile';
// import { useNotificationStore } from '../store/notification';

interface IToken {
  exp: number;
  iat: number;
  sub: string;
}

// TODO: Why have to create another wrapper function. For typescript use generic jwt_decode<IToken>
export const decodedAuthToken = (token: string): IToken => {
  return jwt_decode<IToken>(token);
};

export const addAuthTokensLocalOnLogin = async (
  accessToken: string | null,
  refreshToken: string | null,
  setAuthTokenToHttpHeader: (s: string | null) => void
) => {
  try {
    if (accessToken && refreshToken) {
      await AsyncStorage.setItem("@auth_token", accessToken);
      await AsyncStorage.setItem("@refresh_token", refreshToken);
      setAuthTokenToHttpHeader(accessToken);
    }
  } catch (e) {
    console.error("addAuthTokensLocal", e);
  }
};

export const checkAccessTokenLocal = async (
  setLogined: any,
  removeAuthTokensLocalOnLogout: () => void,
  httpInstance: any,
  addAuthTokensLocalOnLogin: any
) => {
  const isAccessTokenLocalValid = await checkAuthTokenLocalValidation(
    removeAuthTokensLocalOnLogout,
    httpInstance,
    addAuthTokensLocalOnLogin
  );
  try {
    if (isAccessTokenLocalValid) {
      setLogined(true);
    } else {
      setLogined(false);
    }
  } catch (_) {
    removeAuthTokensLocalOnLogout();
    setLogined(false);
  }
};

export const removeAuthTokensLocalOnLogout = async (
  useNotificationStore: any,
  setAuthTokenToHttpHeader: (s: string | null) => void
) => {
  try {
    // Revoke push token before deleting account
    await useNotificationStore.getState().revokePushToken();
  } catch (error: any) {
    console.error("error: ", error.response.status);
  }
  try {
    await AsyncStorage.removeItem("@auth_token");
    await AsyncStorage.removeItem("@refresh_token");
    setAuthTokenToHttpHeader(null);
  } catch (e) {
    console.error("removeAuthTokensLocal", e);
  }
};

export const checkAuthTokenLocalValidation = async (
  removeAuthTokensLocalOnLogout: () => void,
  httpInstance: any,
  addAuthTokensLocalOnLogin
) => {
  try {
    const accessTokenLocal = await AsyncStorage.getItem("@auth_token");
    const refreshTokenLocal = await AsyncStorage.getItem("@refresh_token");
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
              .post("/auth/refresh", {
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

export const logout = async (
  useAuthStore: any,
  useIsCompleteProfileStore: any,
  useNotificationStore: any,
  setAuthTokenToHttpHeader: (s: string | null) => void
) => {
  const { setAccessToken } = useAuthStore.getState();
  const { setIsCompleteProfileStore } = useIsCompleteProfileStore.getState();

  removeAuthTokensLocalOnLogout(useNotificationStore, setAuthTokenToHttpHeader);
  setIsCompleteProfileStore(null);
  setAccessToken(null);
};

export const checkRefreshTokenLocalValidation = async (
  removeAuthTokensLocalOnLogout: () => void,
  httpInstance: any,
  setAuthTokenToHttpHeader: any
) => {
  try {
    const refreshTokenLocal = await AsyncStorage.getItem("@refresh_token");
    if (!refreshTokenLocal) return false;
    const decodedRefreshToken = decodedAuthToken(refreshTokenLocal);
    const currentTime = Date.now() / 1000;
    if (decodedRefreshToken?.exp < currentTime) {
      removeAuthTokensLocalOnLogout();
      return undefined;
    } else {
      const newTokens = await httpInstance
        .post("/auth/refresh", {
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
          newTokens.data.refresh,
          setAuthTokenToHttpHeader
        );
        return newTokens.data.authorization;
      }
    }
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
