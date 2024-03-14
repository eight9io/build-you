import { FC, useEffect } from "react";
import Button from "../Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import {} from "expo-auth-session/providers/google";
import { ISocialLoginForm, LoginForm } from "../../../../types/auth";
import { LOGIN_TYPE } from "../../../../common/enum";
import useGoogleLogin from "../../../../hooks/useGoogleLogin";

interface IGoogleLoginButtonProps {
  title?: string;
  onLogin: (
    payload: LoginForm | ISocialLoginForm,
    type: LOGIN_TYPE
  ) => Promise<void>;
  onError?: (message: string) => void;
}
const GoogleLoginButton: FC<IGoogleLoginButtonProps> = ({
  title,
  onLogin,
  onError,
}) => {
  const { login, token } = useGoogleLogin({ onError });

  useEffect(() => {
    if (token) onLogin({ token }, LOGIN_TYPE.GOOGLE);
  }, [token]);

  const handleGoogleBtnClicked = async () => {
    // Disable action until api is ready
    // login();
  };

  return (
    <Button
      title={title}
      containerClassName="bg-sky-default  flex-row  items-center justify-center m-2 w-full"
      textClassName="text-white ml-2 text-base font-bold"
      Icon={<Ionicons name="logo-google" size={24} color="#FFF" />}
      onPress={handleGoogleBtnClicked}
      testID="googleButton"
    />
  );
};

export default GoogleLoginButton;
