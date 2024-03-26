import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Route } from "@react-navigation/native";
import { ResetPasswordValidationSchema } from "../../Validators/ResetPassword.validate";
import { serviceChangePassword } from "../../service/auth";
import { err_server, errorMessage } from "../../utils/statusCode";
import IconEyeOff from "./asset/eye-off.svg";
import IconEyeOn from "./asset/icon-eye.svg";
import Header from "../../component/common/Header";
import NavButton from "../../component/common/Buttons/NavButton";
import CustomActivityIndicator from "../../component/common/CustomActivityIndicator";
import ErrorText from "../../component/common/ErrorText";
import TextInput from "../../component/common/Inputs/TextInput";
import Button from "../../component/common/Buttons/Button";
import GlobalToastController from "../../component/common/Toast/GlobalToastController";
import { useNav } from "../../hooks/useNav";
interface Props {
  route: Route<
    "ForgotPasswordConfirmScreen",
    {
      email: string;
    }
  >;
}
type FormData = {
  code: any;
  password: string;
  repeat_password: string;
  email: string;
};
export default function ForgotPasswordConfirmScreen({
  route: {
    params: { email },
  },
}: Props) {
  const { t } = useTranslation();
  const navigation = useNav();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      code: "",
      password: "",
      repeat_password: "",
      email: email,
    },
    resolver: yupResolver(ResetPasswordValidationSchema()),
    reValidateMode: "onChange",
    mode: "onSubmit",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [errMessage, setErrMessage] = useState("");
  const onSubmit = (data: FormData) => {
    setIsLoading(true);

    serviceChangePassword({
      code: data.code,
      email: email as string,
      password: data.password,
    })
      .then((res) => {
        if (res.status == 201) {
          GlobalToastController.showModal({
            message:
              t("toast.reset_password_success") ||
              "Reset password successfully!",
          });
          setTimeout(() => {
            navigation.navigate("LoginScreen");
          }, 1500);
          setErrMessage("");
        } else {
          setErrMessage(err_server);
        }
      })
      .catch((error) => {
        setErrMessage(errorMessage(error, "err_change_password") as string);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  };
  const [hidePassword, setHidePassword] = useState(true);
  const getInputTypeForE2ETest = (type: string) => {
    switch (type) {
      case "code":
        return "forgot_password_code_input";
      case "password":
        return "forgot_password_password_input";
      case "repeat_password":
        return "forgot_password_confirm_password_input";
      default:
        return "";
    }
  };

  const onClose = () => {
    navigation.goBack();
  };

  return (
    <View className="mx-1 h-full bg-white" testID="forgot_password_modal">
      <Header
        title={t("forgot_password.title") as string}
        leftBtn={
          <NavButton
            text={t("button.back") as string}
            onPress={onClose}
            withBackIcon
          />
        }
      />
      <KeyboardAwareScrollView testID="forgot_password_scroll_view">
        <View className="h-full pt-5">
          <SafeAreaView>
            <CustomActivityIndicator isVisible={isLoading} />

            <View className="flex-column h-full justify-between bg-white px-6  pb-14">
              <View>
                <View className="flex-column items-center  ">
                  <Image
                    className=" mb-7 mt-10 h-[91px] w-[185px]"
                    source={require("./asset/buildYou1.png")}
                    resizeMode="cover"
                  />
                  <Text className="px-2 text-center text-h6 leading-6 text-gray-dark ">
                    {t("forgot_password.sub_title")}
                  </Text>
                </View>
                {errMessage ? (
                  <ErrorText
                    containerClassName="justify-center mt-4"
                    message={errMessage}
                  />
                ) : null}
                <View className="mb-1 mt-4 flex  flex-col ">
                  {(
                    t("form", {
                      returnObjects: true,
                    }) as Array<any>
                  ).map((item, index) => {
                    if (item.type === "email" || item.name === "user") {
                      return;
                    } else {
                      return (
                        <View className="pt-5" key={index}>
                          <Controller
                            control={control}
                            name={item.type}
                            rules={{
                              required: true,
                            }}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <View className="flex flex-col gap-1">
                                <TextInput
                                  testID={getInputTypeForE2ETest(item.type)}
                                  rightIcon={
                                    (item.type === "repeat_password" ||
                                      item.type === "password") &&
                                    (!hidePassword ? (
                                      <TouchableOpacity
                                        onPress={() =>
                                          setHidePassword(!hidePassword)
                                        }
                                        className=" mt-[2px]"
                                        testID={(() => {
                                          switch (item.type) {
                                            case "repeat_password":
                                              return "register_repeat_password_hide_password_btn";
                                            case "password":
                                              return "register_password_hide_password_btn";
                                            default:
                                              return null;
                                          }
                                        })()}
                                      >
                                        <IconEyeOn />
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() =>
                                          setHidePassword(!hidePassword)
                                        }
                                        className=" mt-[2px]"
                                        testID={(() => {
                                          switch (item.type) {
                                            case "repeat_password":
                                              return "register_repeat_password_show_password_btn";
                                            case "password":
                                              return "register_password_show_password_btn";
                                            default:
                                              return null;
                                          }
                                        })()}
                                      >
                                        <IconEyeOff />
                                      </TouchableOpacity>
                                    ))
                                  }
                                  secureTextEntry={
                                    (item.type == "repeat_password" ||
                                      item.type == "password") &&
                                    hidePassword
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
                          {errors[item.type as keyof FormData] ? (
                            <ErrorText
                              message={
                                errors[item.type as keyof FormData]?.message
                              }
                              testID={`forgot_password_${item.type}_error`}
                            />
                          ) : null}
                        </View>
                      );
                    }
                  })}
                </View>
              </View>
              <View className="pb-10 pt-10">
                <Button
                  containerClassName="bg-primary-default flex-none px-1 "
                  textClassName="line-[30px] text-center text-md font-medium text-white"
                  title={t("reset_password")}
                  onPress={handleSubmit(onSubmit)}
                  testID="forgot_password_submit_btn"
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
