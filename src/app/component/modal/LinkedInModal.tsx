import { Modal, View } from "react-native";
import { FC, useState } from "react";
import WebView from "react-native-webview";
import uuid from "react-native-uuid";
import { useTranslation } from "react-i18next";
import { LINKEDIN_LOGIN } from "../../common/constants";
import { getUrlParam } from "../../utils/common";
import NavButton from "../common/Buttons/NavButton";
import { CrashlyticService } from "../../service/crashlytic";

interface ILinkedInModalProps {
  isVisible: boolean;
  onLoginCancel: () => void;
  onLoginSuccess: (authrozationCode: string) => void;
  onError?: (err: string) => void;
}

const LinkedInModal: FC<ILinkedInModalProps> = ({
  isVisible,
  onLoginSuccess,
  onLoginCancel,
  onError,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  // Generate a random string for state param in linkedin authorization url
  // This state is to prevent CSRF attack, read more at https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin%2Fcontext&view=li-lms-2022-07&tabs=HTTPS1#step-2-request-an-authorization-code
  const authorizationState = uuid.v4();
  const handleNavigationStateChange = async (event: any) => {
    const { url } = event;
    const callbackUrl = process.env.EXPO_LINKEDIN_REDIRECT_URI + "?code";
    if (!url || !callbackUrl) return;

    if (url.startsWith(LINKEDIN_LOGIN.LOGIN_CANCEL_URL)) onLoginCancel();
    else if (url.startsWith(callbackUrl)) {
      const code = getUrlParam(url, "code") as string; // Get authorization code from linkedin
      if (!code) {
        console.error("Cannot get authorization code from linkedin");
        onError && onError(t("errorMessage:500"));
        CrashlyticService({
          errorType: "Linkedin Login Error",
        });
      }
      const state = getUrlParam(url, "state") as string; // Get state from linkedin
      if (!state || state !== authorizationState) {
        console.error("Authorization state does not match");
        onError && onError(t("errorMessage:500"));
      }
      onLoginSuccess(code);
    }
  };
  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      presentationStyle="pageSheet"
    >
      <View testID="linkend_modal">
        {!isLoading ? (
          <View className="h-14 w-full justify-center border-b-2 border-gray-light bg-gray-veryLight pl-6">
            <NavButton
              text={t("cancel") || "Cancel"}
              textClassName="text-blue-500 text-lg"
              onPress={onLoginCancel}
              testID="linkedln_modal_cancel_btn"
            />
          </View>
        ) : null}
        <View
          style={{
            backgroundColor: "red",
            height: "90%",
            display: "flex",
          }}
        >
          <WebView
            source={{
              uri: `${LINKEDIN_LOGIN.AUTHORIZATION_URL}?response_type=code&client_id=${process.env.EXPO_LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.EXPO_LINKEDIN_REDIRECT_URI}&scope=r_liteprofile%20r_emailaddress&state=${authorizationState}`,
            }}
            contentMode="mobile"
            automaticallyAdjustContentInsets={false}
            onNavigationStateChange={handleNavigationStateChange}
            thirdPartyCookiesEnabled={true}
            onLoad={() => setIsLoading(false)}
            incognito
          />
        </View>
      </View>
    </Modal>
  );
};

export default LinkedInModal;
