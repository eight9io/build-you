import { FC } from "react";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

import Button from "../../common/Buttons/Button";
import { appleLogin } from "../../../service/auth";
import { useAuthStore } from "../../../store/auth-store";
// import { addAuthTokensLocalOnLogin } from "../../../utils/checkAuth";
import GlobalDialogController from "../Dialog/GlobalDialogController";
// import { setAuthTokenToHttpHeader } from "../../../utils/http";

interface IAppleLoginButtonProps {
  title?: string;
}
const AppleLoginButton: FC<IAppleLoginButtonProps> = ({ title }) => {
  const { t } = useTranslation();
  const { setAccessToken, setRefreshToken } = useAuthStore();

  // Rewrite this similar to login email / password
  const handleAppleLogin = async () => {
    // try {
    //   // Start the sign-in request
    //   const appleAuthRequestResponse = await appleAuth.performRequest({
    //     requestedOperation: appleAuth.Operation.LOGIN,
    //     requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    //   });
    //   // Ensure Apple returned a user identityToken
    //   console.log(
    //     "appleAuthRequestResponse.identityToken: ",
    //     appleAuthRequestResponse.identityToken
    //   );
    //   if (!appleAuthRequestResponse.identityToken) {
    //     throw new Error("Apple Sign-In failed - no identify token returned");
    //   }
    //   if (appleAuthRequestResponse.identityToken) {
    //     const res = await appleLogin(appleAuthRequestResponse.identityToken);
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
    // } catch (error: any) {
    //   //  ignore case the user canceled the sign-in flow
    //   if (error.code !== "ERR_REQUEST_CANCELED") {
    //     console.log(error);
    //   } else {
    //     GlobalDialogController.showModal({
    //       title: "Error",
    //       message:
    //         t("errorMessage:500") ||
    //         "Something went wrong. Please try again later!",
    //       button: "OK",
    //     });
    //   }
    // }
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
