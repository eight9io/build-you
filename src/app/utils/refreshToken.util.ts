import jwt_decode from "jwt-decode";
import { ILoginResponse, IToken } from "../types/auth";
import httpInstance from "./http";
import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";
import { AxiosRequestConfig } from "axios";

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

export function setupInterceptor(
  getRefreshToken: () => string,
  onRefreshFail: () => void
) {
  httpInstance.interceptors.response.use(
    function (res) {
      return res;
    },
    function (error) {
      return new Promise(async (resolve, reject) => {
        const status = error.response ? error.response.status : null;

        if ([500, 501, 502, 503].includes(status)) {
          // Todo: translate
          GlobalDialogController.showModal({
            title: "Error",
            message: "Something went wrong",
            button: "OK",
          });
          reject("Server error");
        }

        if (status === 401) {
          const originalRequest: AxiosRequestConfigExtends = error.config;
          console.log(originalRequest);

          if (originalRequest._retry) {
            onRefreshFail();
            // Todo: translate
            GlobalDialogController.showModal({
              title: "Error",
              message: "Session expires. Please login again",
              button: "OK",
            });
            reject(error);
            return;
          }
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

          const newTokens = await httpInstance.post<ILoginResponse>(
            "/auth/refresh",
            {
              token: refreshToken,
            }
          );
          if (newTokens.status !== 201) {
            reject(error); // throw so next check retry will force logout
          } else {
            try {
              console.log("call original request with new token");
              setAuthTokenToHttpHeader(newTokens.data.authorization);
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${newTokens.data.authorization}`;
              // set new tokens to local storage
              const res = await httpInstance(originalRequest);
              resolve(res);
            } catch (error) {
              reject(error); // throw so next check retry will force logout
            }
          }
        }

        reject(error);
      });
    }
  );
}
