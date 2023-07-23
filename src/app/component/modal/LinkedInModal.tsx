import { Modal, View } from "react-native";
import { FC, useState } from "react";
import WebView from "react-native-webview";
import { LINKEDIN_LOGIN } from "../../common/constants";
import { getUrlParam } from "../../utils/common";
import NavButton from "../common/Buttons/NavButton";

interface ILinkedInModalProps {
  isVisible: boolean;
  onLoginCancel: () => void;
  onLoginSuccess: (authrozationCode: string) => void;
}

const LinkedInModal: FC<ILinkedInModalProps> = ({
  isVisible,
  onLoginSuccess,
  onLoginCancel,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const handleNavigationStateChange = async (event: any) => {
    const { url } = event;
    const callbackUrl = process.env.NX_LINKEDIN_REDIRECT_URI;
    if (!url || !callbackUrl) return;

    if (url.startsWith(LINKEDIN_LOGIN.LOGIN_CANCEL_URL)) onLoginCancel();
    else if (url.startsWith(callbackUrl)) {
      const code = getUrlParam(url, "code") as string; // Get authorization code from linkedin
      if (!code) throw new Error("Cannot get authorization code from linkedin");
      onLoginSuccess(code);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      presentationStyle="pageSheet"
    >
      {!isLoading ? (
        <View className="h-14 w-full justify-center border-b-2 border-gray-light bg-gray-veryLight pl-6">
          <NavButton
            text="Cancel"
            textClassName="text-blue-500 text-lg"
            onPress={onLoginCancel}
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
            uri: `${LINKEDIN_LOGIN.AUTHORIZATION_URL}?response_type=code&client_id=${process.env.NX_LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.NX_LINKEDIN_REDIRECT_URI}&scope=r_liteprofile%20r_emailaddress`,
          }}
          contentMode="mobile"
          automaticallyAdjustContentInsets={false}
          onNavigationStateChange={handleNavigationStateChange}
          thirdPartyCookiesEnabled={true}
          onLoad={() => setIsLoading(false)}
        />
      </View>
    </Modal>
  );
};

export default LinkedInModal;
