import { useMemo, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  getIdToken,
  signOut as signOutFirebase,
  revokeAccessToken,
} from "firebase/auth";

import { useTranslation } from "react-i18next";
import { CrashlyticService } from "../service/crashlytic";

interface IUseGoogleLoginProps {
  onError?: (errorMessage: string) => void;
}

const useGoogleLogin = ({ onError }: IUseGoogleLoginProps) => {
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(null);
  const auth = useMemo(() => getAuth(), []);

  const login = async () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const token = await getIdToken(result.user);
        setToken(token);
      })
      .catch((error) => {
        if (
          error.code === "auth/popup-closed-by-user" ||
          error.code === "auth/cancelled-popup-request"
        )
          return;
        console.error(error);
        onError && onError(t("errorMessage:500"));
        CrashlyticService({
          errorType: "Google Login Error",
          error: error,
        });
      });
  };

  const signOut = async () => {
    await signOutFirebase(auth);
  };

  return { login, token, signOut, revokeAccessToken };
};

export default useGoogleLogin;
