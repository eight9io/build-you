import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { CommonActions } from "@react-navigation/native";
import IconEyeOff from "./asset/eye-off.svg";

import IconEyeOn from "./asset/icon-eye.svg";
import { Controller, useForm } from "react-hook-form";
import TextInput from "../../component/common/Inputs/TextInput";
import ErrorText from "../../component/common/ErrorText";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginValidationSchema } from "../../Validators/Login.validate";
import { useUserProfileStore } from "../../store/user-store";
import Button from "../../component/common/Buttons/Button";
import { LoginForm } from "../../types/auth";
import ConfirmDialog from "../../component/common/Dialog/ConfirmDialog/ConfirmDialog";
import { serviceLogin } from "../../service/auth";
import { serviceDeleteAccount } from "../../service/profile";
import { useAuthStore } from "../../store/auth-store";
import { useNav } from "../../hooks/useNav";

export default function DeleteAccountScreen() {
  const { logout } = useAuthStore();
  const { onLogout: userProfileStoreOnLogout } = useUserProfileStore();
  const navigation = useNav();

  const [hidePassword, setHidePassword] = useState(true);
  const [isShowModal, setIsShowModal] = useState({
    isModalDelete: false,
    isModalErr: false,
    isModalPasswordIncorrect: false,
  });

  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>({
    defaultValues: {
      user: userData?.email || "",
      password: "",
    },
    resolver: yupResolver(LoginValidationSchema()),
    reValidateMode: "onChange",
    mode: "onSubmit",
  });
  const onSubmit = async (data: LoginForm) => {
    serviceLogin(data)
      .then((res) => {
        if (res.status == 201) {
          setIsShowModal({
            isModalDelete: true,
            isModalErr: false,
            isModalPasswordIncorrect: false,
          });
        }
      })
      .catch((error) => {
        if (error.response.status == 400) {
          setIsShowModal({
            isModalDelete: false,
            isModalErr: false,
            isModalPasswordIncorrect: true,
          });
        } else {
          setIsShowModal({
            isModalDelete: false,
            isModalErr: true,
            isModalPasswordIncorrect: false,
          });
        }
      });
  };
  const handleDeleteAccount = async () => {
    setIsShowModal({ ...isShowModal, isModalDelete: false });
    try {
      const res = await serviceDeleteAccount(userData?.id);
      if (res.status == 200) {
        await handleLogOut();
      }
    } catch (error) {
      setIsShowModal({
        isModalDelete: false,
        isModalErr: true,
        isModalPasswordIncorrect: false,
      });
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
    logout();
    userProfileStoreOnLogout();
  };
  return (
    <SafeAreaView className=" h-full w-full bg-white px-4 pt-3">
      <ScrollView className="h-full px-4  ">
        <ConfirmDialog
          title={t("dialog.delete_account.title") || ""}
          description={t("dialog.delete_account.description") || ""}
          isVisible={isShowModal.isModalDelete}
          onClosed={() =>
            setIsShowModal({ ...isShowModal, isModalDelete: false })
          }
          closeButtonLabel={t("dialog.cancel") || ""}
          confirmButtonColor="#FF4949"
          confirmButtonLabel={t("dialog.delete") || ""}
          onConfirm={() => handleDeleteAccount()}
        />
        <ConfirmDialog
          title={t("dialog.err_title_delete_account") as string}
          description={t("dialog.err_update_profile") as string}
          isVisible={isShowModal.isModalErr}
          onClosed={() => setIsShowModal({ ...isShowModal, isModalErr: false })}
          closeButtonLabel={t("close") || ""}
        />
        <ConfirmDialog
          title={t("dialog.delete_password_incorrect.title") as string}
          description={
            t("dialog.delete_password_incorrect.description") as string
          }
          isVisible={isShowModal.isModalPasswordIncorrect}
          onClosed={() =>
            setIsShowModal({
              ...isShowModal,
              isModalPasswordIncorrect: false,
            })
          }
          closeButtonLabel={t("close") || ""}
        />
        <View className={clsx("py-4")}>
          <Text className={clsx("text-h6 font-medium")}>
            {t("delete_account.title_sub")}
          </Text>
          <Text
            className={clsx(
              "py-4 text-h6  font-normal leading-5 text-[#34363F]"
            )}
          >
            {t("delete_account.description")}
          </Text>
          <Text className={clsx("text-h6 font-medium")}>
            {t("delete_account.confirming_password")}
          </Text>
        </View>
        <View className=" py-4">
          {userData && (
            <View className=" px-1 py-1">
              <Controller
                control={control}
                name="password"
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col gap-1">
                    <TextInput
                      rightIcon={
                        !hidePassword ? (
                          <TouchableOpacity
                            onPress={() => setHidePassword(!hidePassword)}
                            className=" mt-[2px]"
                          >
                            <IconEyeOn />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => setHidePassword(!hidePassword)}
                            className=" mt-[2px]"
                          >
                            <IconEyeOff />
                          </TouchableOpacity>
                        )
                      }
                      secureTextEntry={hidePassword ? true : false}
                      label={t("form.3.label") as string}
                      placeholder={t("form.3.placeholder") as string}
                      placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                      onBlur={onBlur}
                      onChangeText={(text) => onChange(text)}
                      value={value}
                    />
                  </View>
                )}
              />
              {errors.password && (
                <ErrorText message={errors.password?.message} />
              )}
            </View>
          )}

          <Button
            title={t("dialog.delete")}
            containerClassName="flex-none my-4 bg-[#E7E9F1]"
            textClassName="text-black text-md leading-6"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
