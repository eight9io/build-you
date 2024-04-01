import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Modal, SafeAreaView, Text, View } from "react-native";
import { RootStackParamList } from "../../navigation/navigation.type";
import { useAuthStore } from "../../store/auth-store";
import {
  checkIsCompleteProfileOrCompany,
  useUserProfileStore,
} from "../../store/user-store";
import { ISocialLoginForm } from "../../types/auth";
import { LOGIN_TYPE } from "../../common/enum";
import { setupInterceptor } from "../../utils/refreshToken.util";
import { errorMessage } from "../../utils/statusCode";
import { CrashlyticService } from "../../service/crashlytic";
import NavButton from "../../component/common/Buttons/NavButton";
import CustomActivityIndicator from "../../component/common/CustomActivityIndicator";
import ErrorText from "../../component/common/ErrorText";
import LinkedInLoginButton from "../../component/common/Buttons/LinkedInLoginButton/LinkedInLoginButton";
import GoogleLoginButton from "../../component/common/Buttons/GoogleLoginButton/GoogleLoginButton";
import Button from "../../component/common/Buttons/Button";
import { SCREEN_WITHOUT_DRAWER_CONTENT_MAX_WIDTH } from "../../common/constants";

const RegisterOptionsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    asyncLogin,
    getRefreshToken,
    logout,
    setAccessToken,
    setRefreshToken,
  } = useAuthStore();
  const { onLogout: userProfileStoreOnLogout, getUserProfileAsync } =
    useUserProfileStore();

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
      CrashlyticService({
        errorType: "Register Error",
        error,
      });
    }
  };

  const closeModal = () => {
    setErrMessage("");
    navigation.goBack();
  };

  return (
    <View
      className="flex-1 bg-white"
      // style={{ borderRadius: 10 }}
      testID="register_modal"
    >
      <View className="absolute z-10 my-5 pl-4">
        <NavButton
          onPress={() => {
            closeModal();
          }}
          text={t("button.back") as string}
          withBackIcon
          testID="register_modal_back_btn"
        />
      </View>
      <SafeAreaView className="flex flex-1 items-center">
        <CustomActivityIndicator isVisible={isLoading} />
        <View
          className="h-full w-full flex-1 p-5"
          style={{
            maxWidth: SCREEN_WITHOUT_DRAWER_CONTENT_MAX_WIDTH,
          }}
        >
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

          {errMessage ? (
            <ErrorText
              containerClassName="justify-center px-5"
              message={errMessage}
            />
          ) : null}
          <View className="mt-6 flex-col items-center space-y-3">
            <View className="h-12 w-full">
              <LinkedInLoginButton
                title={t("register_modal.linked") || "Register with Linkedin"}
                onLogin={handleRegisterSocial}
                onError={setErrMessage}
              />
            </View>
            <View className="h-12 w-full">
              <GoogleLoginButton
                title={t("register_modal.google") || "Register with Google"}
                onLogin={handleRegisterSocial}
                onError={setErrMessage}
              />
            </View>
            <View className="h-12 w-full">
              <Button
                title={t("register_modal.register")}
                containerClassName="border-primary-default flex-row border-[1px] w-full"
                textClassName="text-primary-default ml-2 text-base font-bold"
                onPress={() => {
                  closeModal();
                  navigation.navigate("RegisterScreen");
                }}
                testID="register_with_email_btn"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default RegisterOptionsScreen;
