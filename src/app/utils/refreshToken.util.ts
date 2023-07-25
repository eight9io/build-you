import jwt_decode from "jwt-decode";
import { ILoginResponse, IToken } from "../types/auth";
import httpInstance from "./http";
import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";

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
          const originalRequest = error.config;
          originalRequest._retry = true;

          if (originalRequest._retry) {
            onRefreshFail();
            // Todo: translate
            return GlobalDialogController.showModal({
              title: "Error",
              message: "Session expires. Please login again",
              button: "OK",
            });
          }
          const refreshToken = getRefreshToken();
          console.log("refreshToken", refreshToken);

          if (!refreshToken) {
            reject(error); // throw so next check retry will force logout
          }

          const decodedRefreshToken = jwt_decode<IToken>(refreshToken);
          console.log("decodedRefreshToken", decodedRefreshToken);
          const currentTime = Date.now() / 1000;
          if (decodedRefreshToken?.exp < currentTime) {
            reject(error); // throw so next check retry will force logout
          }

          const newTokens = await httpInstance.post<ILoginResponse>(
            "/auth/refresh",
            {
              token: refreshToken,
            }
          );
          console.log("newTokens", newTokens);
          if (newTokens.status !== 201) {
            reject(error); // throw so next check retry will force logout
          } else {
            try {
              console.log("call original request with new token");
              setAuthTokenToHttpHeader(newTokens.data.authorization);
              originalRequest.headers["Authorization"] = `Bearer ${newTokens}`;
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
