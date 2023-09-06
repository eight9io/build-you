import jwt_decode from "jwt-decode";
import { AxiosRequestConfig } from "axios";
import { ILoginResponse, IToken } from "../types/auth";
import httpInstance from "./http";
import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";
import i18n from "../i18n/i18n";

interface AxiosRequestConfigExtends extends AxiosRequestConfig {
  _retry?: boolean;
}

export const setAuthTokenToHttpHeader = (token: string | null) => {
  if (token) {
    httpInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete httpInstance.defaults.headers.common["Authorization"];
  }
};

export const checkTokens = ({ getAccessToken, getRefreshToken }) => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const currentTime = Date.now() / 1000;
  const isAccessTokenValid =
    accessToken && jwt_decode<IToken>(accessToken)?.exp >= currentTime;
  if (isAccessTokenValid) {
    return true;
  }
  const isRefreshTokenValid =
    refreshToken && jwt_decode<IToken>(refreshToken)?.exp >= currentTime;
  if (isRefreshTokenValid) {
    return true;
  }
  return false;
};

export function setupInterceptor(
  getRefreshToken: () => string,
  onRefreshFail: () => void,
  setAccessToken: (token: string) => void,
  setRefreshToken: (token: string) => void
) {
  httpInstance.interceptors.response.use(
    function (res) {
      return res;
    },
    function (error) {
      return new Promise(async (resolve, reject) => {
        const status = error.response ? error.response.status : null;
        const originalRequest: AxiosRequestConfigExtends = error.config;
        if ([500, 501, 502, 503].includes(status)) {
          GlobalDialogController.showModal({
            title: i18n.t("dialog.err_title"),
            message:
              (i18n.t("error_general_message") as string) ||
              "Something went wrong",
            button: i18n.t("dialog.ok"),
          });
          reject(i18n.t("server_error"));
        }

        if (status === 401) {
          if (originalRequest._retry) {
            GlobalDialogController.showModal({
              title: i18n.t("dialog.err_title"),
              message: i18n.t("session_expired_error"),
              button: i18n.t("dialog.ok"),
            });
            onRefreshFail();
            reject(error);
            return;
          }
          console.log(originalRequest);
          originalRequest._retry = true;
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            reject(error); // throw so next check retry will force logout
            return;
          }

          const decodedRefreshToken = jwt_decode<IToken>(refreshToken);
          const currentTime = Date.now() / 1000;
          if (decodedRefreshToken?.exp < currentTime) {
            reject(error); // throw so next check retry will force logout
            return;
          }
          try {
            const newTokens = await httpInstance.post<ILoginResponse>(
              "/auth/refresh",
              {
                token: refreshToken,
              }
            );
            if (newTokens.status !== 201) {
              reject(error); // throw so next check retry will force logout
            } else {
              setAuthTokenToHttpHeader(newTokens.data.authorization);
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${newTokens.data.authorization}`;
              setAccessToken(newTokens.data.authorization);
              setRefreshToken(newTokens.data.refresh);
              // set new tokens to local storage
              const res = await httpInstance(originalRequest);
              resolve(res);
            }
          } catch (e) {
            reject(error); // throw so next check retry will force logout
          }
        }

        reject(error);
      });
    }
  );
}
