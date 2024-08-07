import { FC } from "react";
import {
  appleAuth,
  AppleRequestResponse,
} from "@invertase/react-native-apple-authentication";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import jwt_decode from "jwt-decode";

import { useAppleLoginInfoStore } from "../../../store/apple-login-store";

import Button from "../../common/Buttons/Button";
import { LOGIN_TYPE } from "../../../common/enum";
import { ISocialLoginForm, LoginForm } from "../../../types/auth";
import { errorMessage } from "../../../utils/statusCode";
import { CrashlyticService } from "../../../service/crashlytic";

interface IAppleLoginButtonProps {
  title?: string;
  onLogin: (
    payload: LoginForm | ISocialLoginForm,
    type: LOGIN_TYPE
  ) => Promise<void>;
  onError?: (message: string) => void;
}
const AppleLoginButton: FC<IAppleLoginButtonProps> = ({
  title,
  onLogin,
  onError,
}) => {
  const { t } = useTranslation();
  const { setUserAppleInfo } = useAppleLoginInfoStore();
  let appleAuthRequestResponse: AppleRequestResponse = null;
  const handleAppleLogin = async () => {
    try {
      // Start the sign-in request
      appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      if (
        !appleAuthRequestResponse.authorizationCode ||
        !appleAuthRequestResponse.identityToken
      )
        throw new Error(t("errorMessage:err_login.cannot_get_access_token"));
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        // Apple throw error on user cancel login => ignore this error
        console.log("User canceled Apple Sign in.");
      } else {
        console.error("Error", error);
        CrashlyticService({
          errorType: "Apple Login Error",
          error,
        });
        onError && onError(errorMessage(error, "err_login"));
      }
      return;
    }
    const { email, sub } = jwt_decode<{
      email: string;
      sub: string;
    }>(appleAuthRequestResponse.identityToken);
    const userEmail = appleAuthRequestResponse.email || email;
    const userSub = sub;
    const userFullName = appleAuthRequestResponse.fullName;
    if (userEmail && userSub && !userFullName) {
      // Save user login data to AsyncStorage to retry if login failed due to network error
      setUserAppleInfo({
        email: userEmail,
        sub: userSub,
        fullName: null,
      });
    } else if (userEmail && userSub && userFullName) {
      setUserAppleInfo({
        email: userEmail,
        sub: userSub,
        fullName: JSON.stringify(userFullName),
      });
    }
    onLogin(
      {
        token: appleAuthRequestResponse.authorizationCode,
        email: userEmail,
        sub,
      },
      LOGIN_TYPE.APPLE
    );
  };

  return (
    <Button
      title={title}
      containerClassName="bg-black-default flex-row  items-center justify-center m-2"
      textClassName="text-white ml-2 text-base font-bold"
      Icon={<Ionicons name="logo-apple" size={24} color="#FFF" />}
      onPress={handleAppleLogin}
      testID="appleButton"
    />
  );
};

export default AppleLoginButton;
