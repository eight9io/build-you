import Ionicons from "@expo/vector-icons/Ionicons";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useLayoutEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LoginValidationSchema } from "../../Validators/Login.validate";
import { LOGIN_TYPE } from "../../common/enum";
import Button from "../../component/common/Buttons/Button";
import GoogleLoginButton from "../../component/common/Buttons/GoogleLoginButton/GoogleLoginButton";
import LinkedInLoginButton from "../../component/common/Buttons/LinkedInLoginButton";
import ConfirmDialog from "../../component/common/Dialog/ConfirmDialog/ConfirmDialog";
import ErrorText from "../../component/common/ErrorText";
import TextInput from "../../component/common/Inputs/TextInput";
import { RootStackParamList } from "../../navigation/navigation.type";
import { CrashlyticService, InitCrashlytics } from "../../service/crashlytic";
import { serviceUpdateMyProfile } from "../../service/profile";
import { useAppleLoginInfoStore } from "../../store/apple-login-store";
import { useAuthStore } from "../../store/auth-store";
import {
  checkIsAccountVerified,
  checkIsCompleteProfileOrCompany,
  useUserProfileStore,
} from "../../store/user-store";
import { ISocialLoginForm, LoginForm } from "../../types/auth";
import { setupInterceptor } from "../../utils/refreshToken.util";
import { errorMessage } from "../../utils/statusCode";
import CustomActivityIndicator from "../../component/common/CustomActivityIndicator";
import AppleLoginButton from "../../component/common/Buttons/AppleLoginButton/AppleLoginButton";

export default function Login() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: "none",
      },
    });
  }, []);
  const { t } = useTranslation(["index", "errorMessage"]);
  const [errMessage, setErrMessage] = useState("");
  const [isShowVerifiedErrorModal, setIsShowVerifiedErrorModal] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      user: "",
      password: "",
    },
    resolver: yupResolver(LoginValidationSchema()),
    reValidateMode: "onChange",
    mode: "onSubmit",
  });
  const {
    asyncLogin,
    getRefreshToken,
    logout,
    getAccessToken,
    setAccessToken,
  } = useAuthStore();
  const {
    onLogout: userProfileStoreOnLogout,
    getUserProfileAsync,
    setUserProfile,
  } = useUserProfileStore();

  const { getUserAppleInfo } = useAppleLoginInfoStore();

  const onSubmit = async (payload: LoginForm) => {
    await handleLogin(payload, LOGIN_TYPE.EMAIL_PASSWORD);
  };

  const handleLogin = async (
    payload: LoginForm | ISocialLoginForm,
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
        getAccessToken
      );

      const { data: profile } = await getUserProfileAsync();
      if (profile) {
        InitCrashlytics(profile.id);
      }
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
          CrashlyticService({
            errorType: "Apple update name error",
            error: error,
          });
        }
      }
      setIsLoading(false); // Important to not crashing app with duplicate modal
      const isCompleteProfile = checkIsCompleteProfileOrCompany(profile);
      const isAccountVerified = checkIsAccountVerified(profile);

      if (!isAccountVerified) {
        setIsShowVerifiedErrorModal(true);
        return;
      }

      const navigateToRoute = isCompleteProfile
        ? "HomeScreen"
        : "CompleteProfileScreen";

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: navigateToRoute }],
        })
      );
    } catch (error) {
      if (error.response?.status === 401) {
        setIsShowVerifiedErrorModal(true);
        setIsLoading(false);
        return;
      }
      console.error("error", error);
      CrashlyticService({
        errorType: "Login Error",
        error: error,
      });
      setErrMessage(errorMessage(error, "err_login"));
      setIsLoading(false);
    }
  };

  const [hidePassword, setHidePassword] = useState(true);

  const handleConfirmError = async () => {
    setIsShowVerifiedErrorModal(false);
    logout();
  };

  return (
    <SafeAreaView
      className="relative h-full flex-1 bg-white"
      testID="login_with_email_screen"
    >
      <CustomActivityIndicator isVisible={isLoading} />

      {isShowVerifiedErrorModal && (
        <ConfirmDialog
          title={t("dialog.register.title") || ""}
          description={t("dialog.register.description") || ""}
          isVisible={isShowVerifiedErrorModal}
          confirmButtonLabel={t("dialog.close") || ""}
          onConfirm={() => handleConfirmError()}
        />
      )}
      <View className="relative h-full bg-white ">
        <KeyboardAwareScrollView>
          <View className="flex-column h-full justify-between bg-white px-6  pb-14">
            <View>
              <View className="flex-column items-center">
                <Image
                  className=" mb-7 mt-10 h-[91px] w-[185px]"
                  source={require("./asset/buildYou.png")}
                  contentFit="cover"
                />
              </View>
              <View className="flex-row">
                {Platform.OS === "ios" ? (
                  <AppleLoginButton
                    onLogin={handleLogin}
                    onError={setErrMessage}
                  />
                ) : null}
                <GoogleLoginButton
                  onLogin={handleLogin}
                  onError={setErrMessage}
                />
                <LinkedInLoginButton
                  onLogin={handleLogin}
                  onError={setErrMessage}
                />
              </View>
              <View className="mt-5 flex-row items-center justify-center px-6">
                <View className="h-[0.5px] w-[50%] bg-black-default"></View>
                <Text className="mx-3 text-base font-normal text-gray-dark">
                  {t("register_screen.or")}
                </Text>
                <View className="h-[0.5px] w-[50%] bg-black-default"></View>
              </View>

              {errMessage ? (
                <ErrorText
                  containerClassName="justify-center"
                  message={errMessage}
                  testID="login_error_message"
                />
              ) : null}

              <View className="mt-4 flex flex-col ">
                {(
                  t("form", {
                    returnObjects: true,
                  }) as Array<any>
                ).map((item, index) => {
                  if (item.name === "password" || item.name === "user") {
                    return (
                      <View className="pt-5" key={index}>
                        <Controller
                          control={control}
                          name={item.name}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <View className="flex flex-col gap-1">
                              <TextInput
                                inputMode={
                                  item.name === "user" ? "email" : "text"
                                }
                                rightIcon={
                                  item.name === "password" &&
                                  (!hidePassword ? (
                                    <TouchableOpacity
                                      onPress={() =>
                                        setHidePassword(!hidePassword)
                                      }
                                      className=" mt-[2px]"
                                      testID="login_hide_password_btn"
                                    >
                                      <Ionicons name="eye-outline" size={24} />
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() =>
                                        setHidePassword(!hidePassword)
                                      }
                                      className=" mt-[2px]"
                                      testID="login_show_password_btn"
                                    >
                                      <Ionicons
                                        name="eye-off-outline"
                                        size={24}
                                      />
                                    </TouchableOpacity>
                                  ))
                                }
                                secureTextEntry={
                                  item.name === "password" && hidePassword
                                    ? true
                                    : false
                                }
                                label={item.label}
                                placeholder={item.placeholder}
                                placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                                onBlur={onBlur}
                                onChangeText={(text) => onChange(text)}
                                value={value}
                                testID={
                                  item.name === "user"
                                    ? "login_email_input"
                                    : "login_password_input"
                                }
                              />
                            </View>
                          )}
                        />
                        {errors[item.name as keyof LoginForm] && (
                          <ErrorText
                            message={
                              errors[item.name as keyof LoginForm]?.message
                            }
                            testID={`login_${item.type}_error`}
                          />
                        )}
                      </View>
                    );
                  } else {
                    return;
                  }
                })}
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setErrMessage("");
                  navigation.navigate("ForgotPasswordScreen");
                }}
                testID="forgotPasswordButton"
              >
                <Text className="my-5 px-24 text-center text-h6 leading-6 text-gray-dark">
                  {t("forgot_password")}
                </Text>
              </TouchableOpacity>

              <View className="pt-2">
                <Button
                  containerClassName="bg-primary-default flex-none px-1 "
                  textClassName="line-[30px] text-center text-md font-medium text-white"
                  title={t("login_screen.login")}
                  onPress={handleSubmit(onSubmit)}
                  testID="login_submit_btn"
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}
