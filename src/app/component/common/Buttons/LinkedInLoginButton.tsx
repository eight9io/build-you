import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

import Button from "./Button";
import { getLinkedInAccessToken } from "../../../service/auth";
import LinkedInModal from "../../modal/LinkedInModal";
import { LOGIN_TYPE } from "../../../common/enum";
import { ISocialLoginForm, LoginForm } from "../../../types/auth";

interface ILinkedInLoginButtonProps {
  title?: string;
  onLogin: (
    payload: LoginForm | ISocialLoginForm,
    type: LOGIN_TYPE
  ) => Promise<void>;
}
const LinkedInLoginButton: FC<ILinkedInLoginButtonProps> = ({
  title,
  onLogin
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
    let accessToken = null;
    const result = await getLinkedInAccessToken(authrozationCode);
    accessToken = result.data?.access_token;

    if (accessToken) {
      await onLogin({ token: accessToken }, LOGIN_TYPE.LINKEDIN);
    } else throw new Error(t("errorMessage:err_login.cannot_get_access_token"));
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
      />
    </>
  );
};

export default LinkedInLoginButton;
