import axios from "axios";
import { EXPO_API_URL } from "@env";
import jwt_decode from "jwt-decode";
import { ILoginResponse, IToken } from "../types/auth";
import { IGlobalDialogProps } from "../types/globalDialog";

const httpInstance = axios.create({
  timeout: 60000,
  baseURL: EXPO_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthTokenToHttpHeader = (token: string | null) => {
  if (token) {
    httpInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete httpInstance.defaults.headers.common["Authorization"];
  }
};

export function setupInterceptor(
  refreshToken: string,
  showModal: (notification: IGlobalDialogProps) => void,
  onRefreshFail: () => void
) {
  httpInstance.interceptors.response.use(
    function (res) {
      return res;
    },
    function (error) {
      return new Promise(async (resolve, reject) => {
        const status = error.response ? error.response.status : null;
        if ([401].includes(status)) {
          const originalRequest = error.config;
          if (originalRequest._retry) {
            onRefreshFail();
            return showModal({
              title: "Error",
              message: "Session expires. Please login again",
              button: "OK",
            });
          }

          originalRequest._retry = true;
          if (!refreshToken) {
            onRefreshFail();
            reject(error);
          }

          const decodedRefreshToken = jwt_decode<IToken>(refreshToken);
          const currentTime = Date.now() / 1000;
          if (decodedRefreshToken?.exp < currentTime) {
            // TODO: clear store
            return undefined;
          }

          const newTokens = await httpInstance.post<ILoginResponse>(
            "/auth/refresh",
            {
              token: refreshToken,
            }
          );

          if (newTokens.status !== 201) {
            reject(error);
          } else {
            // TODO update new token and retry
            try {
              console.log("refresh");
              setAuthTokenToHttpHeader(newTokens.data.authorization);
              const res = await httpInstance(originalRequest);
              resolve(res);
            } catch (error) {
              reject(error);
              // showModal({
              //   title: "Error",
              //   message: "Session expires. Please login again",
              //   button: "OK",
              // });
            }
          }
        } else if ([500, 501, 502, 503].includes(status)) {
          showModal({
            title: "Error",
            message: "Something went wrong",
            button: "OK",
          });
          reject("Server error");
        }
        reject(error);
      });
    }
  );
}

export default httpInstance;
