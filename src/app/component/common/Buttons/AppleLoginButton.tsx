import { FC } from "react";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

import Button from "../../common/Buttons/Button";
import { LOGIN_TYPE } from "../../../common/enum";
import { ISocialLoginForm, LoginForm } from "../../../types/auth";

interface IAppleLoginButtonProps {
  title?: string;
  onLogin: (
    payload: LoginForm | ISocialLoginForm,
    type: LOGIN_TYPE
  ) => Promise<void>;
}
const AppleLoginButton: FC<IAppleLoginButtonProps> = ({ title, onLogin }) => {
  const { t } = useTranslation();

  const handleAppleLogin = async () => {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      console.log(appleAuthRequestResponse)
      if (appleAuthRequestResponse.authorizationCode) {
        // await onLogin({ token: appleAuthRequestResponse.authorizationCode }, LOGIN_TYPE.APPLE);
      } else
        throw new Error(t("errorMessage:err_login.cannot_get_access_token"));
    } catch (error) {
      // Google throw error on user cancel login => ignore this error
      if (error.code === appleAuth.Error.CANCELED) {
        console.log("User canceled Apple Sign in.");
      } else {
        console.log("Error", error);
      }
    }
  };

  return (
    <Button
      title={title}
      containerClassName="bg-black-default flex-row  items-center justify-center m-2"
      textClassName="text-white ml-2 text-base font-bold"
      Icon={<Ionicons name="logo-apple" size={24} color="#FFF" />}
      onPress={handleAppleLogin}
    />
  );
};

export default AppleLoginButton;
