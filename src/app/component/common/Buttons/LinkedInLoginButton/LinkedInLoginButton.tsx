import { FC, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import { LOGIN_TYPE } from "../../../../common/enum";
import { ISocialLoginForm, LoginForm } from "../../../../types/auth";
import useLinkedInLogin from "../../../../hooks/useLinkedInLogin";

interface ILinkedInLoginButtonProps {
  title?: string;
  onLogin: (
    payload: LoginForm | ISocialLoginForm,
    type: LOGIN_TYPE
  ) => Promise<void>;
  onError?: (errorMessage: string) => void;
}

const LinkedInLoginButton: FC<ILinkedInLoginButtonProps> = ({
  title,
  onLogin,
  onError,
}) => {
  const { t } = useTranslation();
  const { request, login, authrozationCode } = useLinkedInLogin({ onError });

  useEffect(() => {
    if (authrozationCode) onLoginSuccess(authrozationCode);
  }, [authrozationCode]);

  const onLoginSuccess = async (authrozationCode: string) => {
    if (authrozationCode)
      await onLogin({ token: authrozationCode }, LOGIN_TYPE.LINKEDIN);
    else
      onError && onError(t("errorMessage:err_login.cannot_get_access_token"));
  };

  return (
    <>
      <Button
        title={title}
        containerClassName="w-full bg-sky-20 flex-row"
        textClassName="text-white ml-2 text-base font-bold"
        Icon={<Ionicons name="logo-linkedin" size={24} color="#FFF" />}
        onPress={() => login()}
        testID="linkedlnButton"
        isDisabled={!request}
      />
    </>
  );
};

export default LinkedInLoginButton;
