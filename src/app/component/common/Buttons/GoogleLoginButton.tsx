import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { FC, useEffect } from "react";
import Button from "./Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { ISocialLoginForm, LoginForm } from "../../../types/auth";
import { LOGIN_TYPE } from "../../../common/enum";

interface IGoogleLoginButtonProps {
  title?: string;
  onLogin: (
    payload: LoginForm | ISocialLoginForm,
    type: LOGIN_TYPE
  ) => Promise<void>;
}
const GoogleLoginButton: FC<IGoogleLoginButtonProps> = ({ title, onLogin }) => {
  const { t } = useTranslation();

  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  // TODO Rewrite this similar to login email / password
  const handleGoogleBtnClicked = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken) {
        await onLogin({ token: userInfo.idToken }, LOGIN_TYPE.GOOGLE);
      } else
        throw new Error(t("errorMessage:err_login.cannot_get_access_token"));
    } catch (error) {
      // Google throw error on user cancel login => ignore this error
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User canceled Google Sign in.");
      } else {
        console.log("Error", error);
      }
    }
  };

  return (
    <Button
      title={title}
      containerClassName="bg-sky-default  flex-row  items-center justify-center m-2"
      textClassName="text-white ml-2 text-base font-bold"
      Icon={<Ionicons name="logo-google" size={24} color="#FFF" />}
      onPress={handleGoogleBtnClicked}
    />
  );
};

export default GoogleLoginButton;
