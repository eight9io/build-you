import { SafeAreaView, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import jwt_decode from "jwt-decode";

import { useUserProfileStore } from "../../store/user-store";
import Button from "../../component/common/Buttons/Button";
import ConfirmDialog from "../../component/common/Dialog/ConfirmDialog";
import { LOGIN_TYPE } from "../../common/enum";
import { LoginForm, ISocialLoginForm, IToken } from "../../types/auth";
import { errorMessage } from "../../utils/statusCode";
import { useAuthStore } from "../../store/auth-store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import appleAuth from "@invertase/react-native-apple-authentication";
import { serviceDeleteAccount } from "../../service/profile";
import { CommonActions } from "@react-navigation/native";
import LinkedInModal from "../../component/modal/LinkedInModal";
import Spinner from "react-native-loading-spinner-overlay";

const getGoogleToken = async () => {
  const { idToken } = await GoogleSignin.signIn();
  return idToken;
};

const getAppleToken = async () => {
  const { identityToken, authorizationCode } = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
  });

  const { email, sub } = jwt_decode<{
    email: string;
    sub: string;
  }>(identityToken);

  return {
    email,
    sub,
    token: authorizationCode,
  };
};

export default function PersonalInformationScreen({ navigation }: any) {
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [linkedInModalVisible, setLinkedInModalVisible] =
    useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  const { asyncLogin, logout } = useAuthStore();
  const { onLogout: userProfileStoreOnLogout } = useUserProfileStore();
  const { getUserProfile } = useUserProfileStore();

  const userData = getUserProfile();

  let linkedinToken = null;

  const handleLoginOnDeleteAccount = async (
    payload: LoginForm | ISocialLoginForm,
    type: LOGIN_TYPE
  ) => {
    setIsLoading(true);
    try {
      const login = await asyncLogin(payload, type);
      const userIdFromLogin = jwt_decode<IToken>(login.data.authorization);
      if (userIdFromLogin && userIdFromLogin?.id === userData?.id) {
        const res = await serviceDeleteAccount(userData?.id);
        if (res.status == 200) {
          handleLogOut();
        }
      } else {
        setErrMessage(t("error_wrong_email_or_password"));
        setIsLoading(false);
      }
    } catch (error) {
      setErrMessage(errorMessage(error, "err_login"));
      setIsLoading(false);
    }
  };

  const handleDeleleAcount = () => {
    if (userData?.loginType === "standard") {
      navigation.navigate("DeleteAccountScreen");
    } else {
      setIsDialogVisible(true);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const handleDeleteSocialAccount = async () => {
    setIsDialogVisible(false);
    switch (userData?.loginType) {
      case "google":
        const googleToken = await getGoogleToken();
        handleLoginOnDeleteAccount({ token: googleToken }, LOGIN_TYPE.GOOGLE);
        break;
      case "apple":
        const applePayload = await getAppleToken();
        handleLoginOnDeleteAccount(applePayload, LOGIN_TYPE.APPLE);
        break;
      case "linkedin":
        setLinkedInModalVisible(true);
        break;
      default:
        navigation.navigate("DeleteAccountScreen");
        break;
    }
  };

  const handleLogOut = () => {
    logout();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "IntroScreen" }],
      })
    );
    userProfileStoreOnLogout();
  };

  const handleLinkedInLoginCancel = () => {
    setLinkedInModalVisible(false);
  };

  const handleLinkedInLoginSuccess = async (authrozationCode: string) => {
    setLinkedInModalVisible(false);
    linkedinToken = authrozationCode;
    handleLoginOnDeleteAccount({ token: linkedinToken }, LOGIN_TYPE.LINKEDIN);
  };

  const handleLinkedInLoginError = (errorMessage: string) => {
    setErrMessage(errorMessage);
  };

  return (
    <SafeAreaView className="justify-content: space-between flex-1 bg-white px-4 pt-3">
      <ConfirmDialog
        isVisible={isDialogVisible}
        title={t("personal_information.delete_account")}
        description={t("dialog.delete_account.title")}
        confirmButtonLabel={t("personal_information.delete_account")}
        closeButtonLabel={t("dialog.cancel")}
        confirmButtonColor="red"
        onConfirm={handleDeleteSocialAccount}
        onClosed={() => setIsDialogVisible(false)}
      />
      <LinkedInModal
        isVisible={linkedInModalVisible}
        onLoginCancel={handleLinkedInLoginCancel}
        onLoginSuccess={handleLinkedInLoginSuccess}
        onError={handleLinkedInLoginError}
      />

      <ScrollView>
        {isLoading && <Spinner />}
        <View className={clsx("px-4 py-4")}>
          <Text className={clsx("text-h4 font-medium")}>
            {t("personal_information.description")}
          </Text>
        </View>
        <View className="flex-column flex flex-wrap gap-3 px-4 pt-[20px]">
          {userData?.name && (
            <View className="flex w-full flex-row flex-wrap pr-[30px]">
              <Text
                className={clsx(
                  "w-[35%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("personal_profile.name")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.name}
              </Text>
            </View>
          )}
          {userData?.surname && (
            <View className="flex w-full flex-row flex-wrap pr-[30px]">
              <Text
                className={clsx(
                  "w-[35%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("personal_profile.surname")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.surname}
              </Text>
            </View>
          )}
          {userData?.birth && (
            <View className="flex w-full flex-row flex-wrap pr-[30px]">
              <Text
                className={clsx(
                  "w-[35%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("personal_profile.birthday")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.birth}
              </Text>
            </View>
          )}
          {userData?.email && (
            <View className="flex w-full flex-row flex-wrap pr-[30px]">
              <Text
                className={clsx(
                  "w-[35%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("personal_profile.email")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.email}
              </Text>
            </View>
          )}
          {userData?.occupation && (
            <View className="flex w-full flex-row flex-wrap pr-[30px]">
              <Text
                className={clsx(
                  "w-[35%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("form_onboarding.screen_1.occupation")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.occupation.name}
              </Text>
            </View>
          )}
        </View>
        <View className="px-5 py-10">
          {errMessage && (
            <Text className={clsx("text-md text-red-500")}>{errMessage}</Text>
          )}
          <Button
            title={t("personal_information.delete_account")}
            containerClassName="bg-gray-medium flex-1"
            textClassName="text-white text-md leading-6"
            onPress={handleDeleleAcount}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
