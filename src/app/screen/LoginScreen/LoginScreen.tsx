import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

import ErrorText from "../../component/common/ErrorText";
import Button from "../../component/common/Buttons/Button";
import TextInput from "../../component/common/Inputs/TextInput";
import AppleLoginButton from "../../component/common/Buttons/AppleLoginButton";
import LinkedInLoginButton from "../../component/common/Buttons/LinkedInLoginButton";
import { ISocialLoginForm, LoginForm } from "../../types/auth";
import { LoginValidationSchema } from "../../Validators/Login.validate";
import { errorMessage } from "../../utils/statusCode";
import { useAuthStore } from "../../store/auth-store";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RootStackParamList } from "../../navigation/navigation.type";
import { setupInterceptor } from "../../utils/refreshToken.util";
import {
  checkIsCompleteProfileOrCompany,
  useUserProfileStore,
} from "../../store/user-store";
import GoogleLoginButton from "../../component/common/Buttons/GoogleLoginButton";
import { LOGIN_TYPE } from "../../common/enum";

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
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      user: "hoanggia@gmail.com",
      password: "Test1234",
    },
    resolver: yupResolver(LoginValidationSchema()),
    reValidateMode: "onChange",
    mode: "onSubmit",
  });
  const { asyncLogin, getRefreshToken, logout } = useAuthStore();
  const { onLogout: userProfileStoreOnLogout, getUserProfileAsync } =
    useUserProfileStore();

  const onSubmit = async (payload: LoginForm) => {
    await handleLogin(payload, LOGIN_TYPE.EMAIL_PASSWORD);
  };

  const handleLogin = async (payload: LoginForm | ISocialLoginForm, type: LOGIN_TYPE) => {
    setIsLoading(true);
    try {
      const t = await asyncLogin(payload, type);
      setupInterceptor(getRefreshToken, () => {
        logout();
        userProfileStoreOnLogout();
      });

      const { data: profile } = await getUserProfileAsync();
      setIsLoading(false); // Important to not crashing app with duplicate modal
      const isCompleteProfile = checkIsCompleteProfileOrCompany(profile);
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
      setErrMessage(errorMessage(error, "err_login"));
      setIsLoading(false);
    }
  };

  const [hidePassword, setHidePassword] = useState(true);
  return (
    <SafeAreaView className="relative h-full flex-1 bg-white">
      {isLoading && <Spinner visible={isLoading} />}
      <View className="relative h-full bg-white ">
        <KeyboardAwareScrollView>
          <View className="flex-column h-full justify-between bg-white px-6  pb-14">
            <View>
              <View className="flex-column items-center  ">
                <Image
                  className=" mb-7 mt-10 h-[91px] w-[185px]"
                  source={require("./asset/buildYou.png")}
                  contentFit="cover"
                />
              </View>
              <View className="flex-row">
                {Platform.OS === "ios" ? (
                  <AppleLoginButton onLogin={handleLogin} />
                ) : null}
                <GoogleLoginButton onLogin={handleLogin} />
                <LinkedInLoginButton onLogin={handleLogin} />
              </View>
              <View className="mt-5 flex-row items-center justify-center px-6">
                <View className="h-[0.5px] w-[50%] bg-black-default"></View>
                <Text className="mx-3 text-base font-normal text-gray-dark">
                  {t("register_screen.or")}
                </Text>
                <View className="h-[0.5px] w-[50%] bg-black-default"></View>
              </View>

              {errMessage && (
                <ErrorText
                  containerClassName="justify-center "
                  message={errMessage}
                />
              )}

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
                                    >
                                      <Ionicons name="eye-outline" size={24} />
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() =>
                                        setHidePassword(!hidePassword)
                                      }
                                      className=" mt-[2px]"
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
                              />
                            </View>
                          )}
                        />
                        {errors[item.name as keyof LoginForm] && (
                          <ErrorText
                            message={
                              errors[item.name as keyof LoginForm]?.message
                            }
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
                onPress={() => navigation.navigate("ForgotPasswordScreen")}
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
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}
