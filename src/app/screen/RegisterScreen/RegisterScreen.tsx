import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { CheckBox } from "@rneui/themed";
import { yupResolver } from "@hookform/resolvers/yup";
import Spinner from "react-native-loading-spinner-overlay";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { RegisterValidationSchema } from "../../Validators/Register.validate";
import { serviceRegister } from "../../service/auth";
import { errorMessage } from "../../utils/statusCode";

import Button from "../../component/common/Buttons/Button";
import TextInput from "../../component/common/Inputs/TextInput";
import ErrorText from "../../component/common/ErrorText";
import PolicyModal from "../../component/modal/PolicyModal";

import IconEyeOn from "./asset/icon-eye.svg";
import IconEyeOff from "./asset/eye-off.svg";
import TermModal from "../../component/modal/TermModal";
import ConfirmDialog from "../../component/common/Dialog/ConfirmDialog";

type FormData = {
  email: string;
  password: string;
  repeat_password: string;
  check_policy: boolean;
};

const getInputTypeForE2ETest = (type: string) => {
  switch (type) {
    case "email":
      return "register_with_email_email_input";
    case "password":
      return "register_with_email_password_input";
    case "repeat_password":
      return "register_with_email_confirm_password_input";
    default:
      return "";
  }
};

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      repeat_password: "",
      check_policy: false,
    },
    resolver: yupResolver(RegisterValidationSchema()),
    reValidateMode: "onChange",
    mode: "onSubmit",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const onSubmit = (data: FormData) => {
    setIsLoading(true);

    serviceRegister({ email: data.email, password: data.password })
      .then((res) => {
        setErrMessage("");
        setIsLoading(false);
        setTimeout(() => {
          setIsShowModal(true);
        }, 500);
      })
      .catch((error) => {
        setIsLoading(false);
        setErrMessage(errorMessage(error, "err_register") as string);
      });
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTerms, setModalTerms] = useState(false);
  const handleConfirm = async () => {
    setIsShowModal(false);
    await navigation.goBack();
    await navigation.navigate("LoginScreen");
  };
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <SafeAreaView
      className=" h-full bg-white "
      testID="register_with_email_screen"
    >
      <KeyboardAwareScrollView testID="register_scroll_view">
        {isLoading && <Spinner visible={isLoading} />}

        {isShowModal && (
          <ConfirmDialog
            title={t("dialog.register.title") || ""}
            description={t("dialog.register.description") || ""}
            isVisible={isShowModal}
            confirmButtonLabel={t("dialog.close") || ""}
            onConfirm={() => handleConfirm()}
          />
        )}
        <View className="flex-column relative h-full justify-between bg-white px-6  pb-14">
          <View>
            <View className="flex-column items-center ">
              <Image
                className=" mb-7 mt-10 h-[91px] w-[185px]"
                source={require("./asset/buildYou.png")}
                contentFit="cover"
              />
              <Text className="px-6 text-center text-h6 leading-6 text-gray-dark ">
                {t("register_screen.sub_title")}
              </Text>
            </View>
            {errMessage && (
              <ErrorText
                containerClassName="justify-center "
                message={errMessage}
                testID="register_error"
              />
            )}
            <View className="mb-1 mt-4 flex  flex-col ">
              {(
                t("form", {
                  returnObjects: true,
                }) as Array<any>
              ).map((item, index) => {
                if (item.type === "code" || item.name === "user") {
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
                        render={({ field: { onChange, onBlur, value } }) => (
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
                      {errors[item.type as keyof FormData] && (
                        <ErrorText
                          message={errors[item.type as keyof FormData]?.message}
                          testID={`register_${item.type}_error`}
                        />
                      )}
                    </View>
                  );
                }
              })}

              <Controller
                control={control}
                name="check_policy"
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="">
                    <CheckBox
                      title={
                        <View className="flex-1 flex-row flex-wrap items-center pl-4">
                          <Text className="">
                            {t("register_screen.policy")}
                          </Text>
                          <Text
                            className="cursor-pointer font-medium  underline underline-offset-1"
                            onPress={() => setModalVisible(true)}
                            testID="register_policy_link"
                          >
                            {t("register_screen.policy_link")}
                          </Text>
                          <Text className=""> {t("and")} </Text>
                          <Text
                            className="cursor-pointer font-medium underline underline-offset-auto"
                            onPress={() => setModalTerms(true)}
                            testID="register_terms_link"
                          >
                            {t("register_screen.terms_link")}
                          </Text>
                        </View>
                      }
                      containerStyle={{
                        backgroundColor: "transparent",
                        paddingBottom: 0,
                        paddingLeft: 0,
                        marginTop: 10,
                      }}
                      checked={value}
                      onPress={() => {
                        setValue("check_policy", !value);
                      }}
                      iconType="material-community"
                      checkedIcon="checkbox-marked"
                      uncheckedIcon="checkbox-blank-outline"
                      checkedColor="blue"
                      testID="register_argee_policy_checkbox"
                    />
                    {errors.check_policy && !value && (
                      <ErrorText
                        message={errors.check_policy?.message}
                        testID="register_argee_policy_error"
                      />
                    )}
                  </View>
                )}
              />
            </View>
          </View>
          <Button
            containerClassName="  bg-primary-default flex-none px-1 mt-4"
            textClassName="line-[30px] text-center text-md font-medium text-white"
            title={t("register_screen.title")}
            onPress={handleSubmit(onSubmit)}
            testID="register_submit_btn"
          />

          <PolicyModal
            navigation={navigation}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
          <TermModal
            navigation={navigation}
            modalVisible={modalTerms}
            setModalVisible={setModalTerms}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
