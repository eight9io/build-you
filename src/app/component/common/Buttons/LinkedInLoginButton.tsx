import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

import Button from "./Button";
import { getLinkedInAccessToken, linkedInLogin } from "../../../service/auth";
import LinkedInModal from "../../modal/LinkedInModal";
import GlobalDialogController from "../Dialog/GlobalDialogController";
import { useAuthStore } from "../../../store/auth-store";
// import { addAuthTokensLocalOnLogin } from "../../../utils/checkAuth";
// import { setAuthTokenToHttpHeader } from "../../../utils/http";

interface ILinkedInLoginButtonProps {
  title?: string;
}
const LinkedInLoginButton: FC<ILinkedInLoginButtonProps> = ({ title }) => {
  const { t } = useTranslation();
  const [linkedInModalVisible, setLinkedInModalVisible] = useState(false);
  const { setAccessToken, setRefreshToken } = useAuthStore();
  const handleLinkedInBtnClicked = async () => {
    setLinkedInModalVisible(true);
  };

  const handleLinkedInLoginCancel = () => {
    setLinkedInModalVisible(false);
  };

  // Rewrite this similar to login email / password
  const handleLinkedInLoginSuccess = async (authrozationCode: string) => {
    // try {
    //   setLinkedInModalVisible(false);
    //   const result = await getLinkedInAccessToken(authrozationCode);
    //   const token = result.data?.access_token;
    //   console.log("linkedin token: ", token);
    //   if (token) {
    //     const res = await linkedInLogin(token);
    //     if (res.status === 201 || res.status === 200) {
    //       setAccessToken(res?.data.authorization || null);
    //       setRefreshToken(res?.data.refresh || null);
    //       addAuthTokensLocalOnLogin(
    //         res?.data.authorization || null,
    //         res?.data.refresh || null,
    //         setAuthTokenToHttpHeader
    //       );
    //     }
    //   } else throw new Error("Cannot get access token from linkedin");
    // } catch (error) {
    //   GlobalDialogController.showModal({
    //     title: "Error",
    //     message:
    //       t("errorMessage:500") ||
    //       "Something went wrong. Please try again later!",
    //     button: "OK",
    //   });
    //   console.error(error);
    // }
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
