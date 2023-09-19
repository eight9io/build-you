import { View, Text, Modal, SafeAreaView, Platform } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import { useTranslation } from "react-i18next";

import { setupInterceptor } from "../../../utils/refreshToken.util";
import { errorMessage } from "../../../utils/statusCode";

import { ISocialLoginForm } from "../../../types/auth";
import { useAuthStore } from "../../../store/auth-store";
import { useAppleLoginInfoStore } from "../../../store/apple-login-store";
import {
  checkIsCompleteProfileOrCompany,
  useUserProfileStore,
} from "../../../store/user-store";

import ErrorText from "../../common/ErrorText";
import Button from "../../common/Buttons/Button";
import { LOGIN_TYPE } from "../../../common/enum";
import NavButton from "../../common/Buttons/NavButton";
import AppleLoginButton from "../../common/Buttons/AppleLoginButton";
import GoogleLoginButton from "../../common/Buttons/GoogleLoginButton";
import LinkedInLoginButton from "../../common/Buttons/LinkedInLoginButton";

import { RootStackParamList } from "../../../navigation/navigation.type";
import { serviceUpdateMyProfile } from "../../../service/profile";

interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  navigation?: any;
}
const RegisterModal = ({ modalVisible, setModalVisible }: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    asyncLogin,
    getRefreshToken,
    logout,
    setAccessToken,
    getAccessToken,
    setRefreshToken,
  } = useAuthStore();
  const { onLogout: userProfileStoreOnLogout, getUserProfileAsync } =
    useUserProfileStore();

  const { getUserAppleInfo } = useAppleLoginInfoStore();
  const { setUserProfile } = useUserProfileStore();

  const handleRegisterSocial = async (
    payload: ISocialLoginForm,
    type: LOGIN_TYPE
  ) => {
    setIsLoading(true);
    try {
      const t = await asyncLogin(payload, type);
      setupInterceptor(
        getRefreshToken,
        () => {
          logout();
          userProfileStoreOnLogout();
        },
        setAccessToken,
        setRefreshToken
      );
      const { data: profile } = await getUserProfileAsync();
      if (type === LOGIN_TYPE.APPLE) {
        try {
          const userAppleInfo = getUserAppleInfo();
          const userFullName = userAppleInfo.fullName;
          if (!userFullName) throw new Error("Cannot get user full name");
          const userFullNameObj = JSON.parse(userFullName);
          const userFirstName = userFullNameObj?.familyName;
          const userLastName = userFullNameObj?.givenName;
          if (!userFirstName || !userLastName) {
            throw new Error("Cannot get user full name");
          }
          const newUserInfo = await serviceUpdateMyProfile(profile.id, {
            name: userFirstName,
            surname: userLastName,
          });
          setUserProfile(newUserInfo.data);
        } catch (error) {
          console.error("Apple update name error: ", error);
        }
      }
      setIsLoading(false); // Important to not crashing app with duplicate modal
      const isCompleteProfile = checkIsCompleteProfileOrCompany(profile);
      const navigateToRoute = isCompleteProfile
        ? "HomeScreen"
        : "CompleteProfileScreen";

      closeModal();
      setTimeout(() => {
        // Timeout used to wait for the register modal to close before navigate
        // The app crash when calling "reset" action, "navigate" action works fine
        // Reference: https://github.com/react-navigation/react-navigation/issues/11201
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: navigateToRoute }],
          })
        );
      }, 300);
    } catch (error) {
      console.error("error: ", error);
      setErrMessage(errorMessage(error, "err_login"));
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setErrMessage("");
  };

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      presentationStyle="pageSheet"
      style={{ borderRadius: 10 }}
    >
      <View
        className=" bg-white "
        style={{ borderRadius: 10 }}
        testID="register_modal"
      >
        <View className="absolute z-10 my-6 ml-4 ">
          <NavButton
            onPress={() => {
              closeModal();
            }}
            text={t("button.back") as string}
            withBackIcon
            testID="register_modal_back_btn"
          />
        </View>
        <SafeAreaView>
          {isLoading && <Spinner visible={isLoading} />}
          <View className="h-full p-5">
            <View className="flex h-[65%] pt-4">
              <View className="h-[70%]">
                <Image
                  source={require("./asset/img-login.png")}
                  className="h-full w-full"
                  resizeMode="contain"
                />
              </View>
              <View className="basis-1/3 justify-center px-4 pt-4">
                <Text className="text-center text-h4 font-medium leading-6 ">
                  {t("register_modal.title")}
                </Text>
                <Text className="mt-3 text-center text-base text-gray-dark opacity-90">
                  {t("register_modal.description")}
                </Text>
              </View>
            </View>

            {errMessage && (
              <ErrorText
                containerClassName="justify-center px-5"
                message={errMessage}
              />
            )}
            <View className="h-[35%] flex-col items-center pt-5">
              {Platform.OS === "ios" ? (
                <AppleLoginButton
                  title={t("register_modal.apple") || "Register with Apple"}
                  onLogin={handleRegisterSocial}
                  onError={setErrMessage}
                />
              ) : null}
              <LinkedInLoginButton
                title={t("register_modal.linked") || "Register with Linkedin"}
                onLogin={handleRegisterSocial}
                onError={setErrMessage}
              />
              <GoogleLoginButton
                title={t("register_modal.google") || "Register with Google"}
                onLogin={handleRegisterSocial}
                onError={setErrMessage}
              />
              <Button
                title={t("register_modal.register")}
                containerClassName="border-primary-default flex-row border-[1px] m-2"
                textClassName="text-primary-default ml-2 text-base font-bold"
                onPress={() => {
                  closeModal();
                  navigation.navigate("RegisterScreen");
                }}
                testID="register_with_email_btn"
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default RegisterModal;
