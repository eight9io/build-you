import { useEffect, useMemo, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import {
  useAuthRequest,
  ResponseType,
  DiscoveryDocument,
} from "expo-auth-session";
import uuid from "react-native-uuid";
import { useTranslation } from "react-i18next";
import { LINKEDIN_LOGIN } from "../common/constants";
import { CrashlyticService } from "../service/crashlytic";

interface IUseLinkedInLoginProps {
  onError?: (errorMessage: string) => void;
}
// Use to close popup window/new tab on web when done with authentication
// Note: make sure the redirect URL should direct to the same page that opens the popup window
WebBrowser.maybeCompleteAuthSession();

// Specify the authorization endpoints for useAuthRequest to perform request (authorization flow)
const discovery: DiscoveryDocument = {
  authorizationEndpoint: LINKEDIN_LOGIN.AUTHORIZATION_URL,
  tokenEndpoint: LINKEDIN_LOGIN.ACCESS_TOKEN_URL,
};

const useLinkedInLogin = ({ onError }: IUseLinkedInLoginProps) => {
  const { t } = useTranslation();
  const [authrozationCode, setAuthrozationCode] = useState<string | null>(null);
  // Generate a random string for state param in linkedin authorization url
  // This state is to prevent CSRF attack, read more at https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin%2Fcontext&view=li-lms-2022-07&tabs=HTTPS1#step-2-request-an-authorization-code
  const authorizationState = useMemo(() => uuid.v4().toString(), []);

  const [request, result, promptAsync] = useAuthRequest(
    {
      clientId: LINKEDIN_LOGIN.CLIENT_ID,
      redirectUri: LINKEDIN_LOGIN.REDIRECT_URI,
      scopes: ["r_liteprofile", "r_emailaddress"],
      responseType: ResponseType.Code,
      state: authorizationState,
    },
    discovery
  );

  useEffect(() => {
    if (result && result.type === "success") {
      const code = result.params.code;
      const state = result.params.state;
      if (!code) {
        console.error("Cannot get authorization code from linkedin");
        onError && onError(t("errorMessage:500"));
        CrashlyticService({
          errorType: "Linkedin Login Error",
        });
      }
      if (!state || state !== authorizationState) {
        console.error("Authorization state does not match");
        onError && onError(t("errorMessage:500"));
      }
      setAuthrozationCode(result.params.code);
    }
  }, [result]);

  const login = async () => {
    promptAsync();
  };

  return { request, login, authrozationCode };
};

export default useLinkedInLogin;
