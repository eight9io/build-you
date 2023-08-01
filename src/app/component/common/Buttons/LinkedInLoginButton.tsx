import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

import Button from "./Button";
// import { getLinkedInAccessToken } from "../../../service/auth";
import LinkedInModal from "../../modal/LinkedInModal";
import { LOGIN_TYPE } from "../../../common/enum";
import { ISocialLoginForm, LoginForm } from "../../../types/auth";

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
  const [linkedInModalVisible, setLinkedInModalVisible] = useState(false);
  const handleLinkedInBtnClicked = async () => {
    setLinkedInModalVisible(true);
  };

  const handleLinkedInLoginCancel = () => {
    setLinkedInModalVisible(false);
  };

  const handleLinkedInLoginSuccess = async (authrozationCode: string) => {
    setLinkedInModalVisible(false);
    // let accessToken = null;
    // const result = await getLinkedInAccessToken(authrozationCode);
    // accessToken = result.data?.access_token;
    if (authrozationCode) {
      await onLogin({ token: authrozationCode }, LOGIN_TYPE.LINKEDIN);
    } else {
      onError && onError(t("errorMessage:err_login.cannot_get_access_token"));
    };
  };

  const handleLinkedInLoginError = (errorMessage: string) => {
    onError && onError(errorMessage);
  };
  return (
    <>
      <Button
        title={title}
        containerClassName="bg-sky-20 flex-row m-2"
        textClassName="text-white ml-2 text-base font-bold"
        Icon={<Ionicons name="logo-linkedin" size={24} color="#FFF" />}
        onPress={handleLinkedInBtnClicked}
      />
      <LinkedInModal
        isVisible={linkedInModalVisible}
        onLoginCancel={handleLinkedInLoginCancel}
        onLoginSuccess={handleLinkedInLoginSuccess}
        onError={handleLinkedInLoginError}
      />
    </>
  );
};

export default LinkedInLoginButton;
