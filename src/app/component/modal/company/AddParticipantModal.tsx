import { View, Modal, Text, FlatList, TouchableOpacity } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller, set } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { AddNewEmployeeValidationSchema } from "../../../Validators/validators";

import Header from "../../common/Header";
import ErrorText from "../../common/ErrorText";
import TextInput from "../../common/Inputs/TextInput";
import Close from "../../../component/asset/close.svg";
import ConfirmDialog from "../../common/Dialog/ConfirmDialog";
import { useUserProfileStore } from "../../../store/user-store";
import GlobalDialogController from "../../common/Dialog/GlobalDialogController";
import { IUserData } from "../../../types/user";
import clsx from "clsx";

import { Image } from "expo-image";
import { useIsFocused } from "@react-navigation/native";

interface IAddNewEmployeeModalProps {
  isVisible: boolean;
  onClose: () => void;
  employeeList?: IUserData[];
  handleAddParticipant?: (data: any) => void;
}

export const AddParticipantModal: FC<IAddNewEmployeeModalProps> = ({
  isVisible,
  onClose,
  employeeList,
  handleAddParticipant,
}) => {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState([]);
  const { getUserProfile, getUserProfileAsync } = useUserProfileStore();
  useEffect(() => {
    setSuggestions(employeeList);
  }, [employeeList]);

  const isFocused = useIsFocused();
  useEffect(() => {
    getUserProfileAsync();
  }, [isFocused]);
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState({
    isShow: false,
    description: t("error_general_message") as string,
  });

  const userData = getUserProfile();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(AddNewEmployeeValidationSchema()),
  });

  const onSubmit = (data: any) => {
    if (!userData?.id) {
      setIsErrorDialogVisible({ ...isErrorDialogVisible, isShow: true });
      return;
    }
    const participant = employeeList.find(
      (item: any) => item.email === data.email
    );

    if (participant) {
      handleAddParticipant(participant);
      reset();
      onClose();
    } else {
      GlobalDialogController.showModal({
        title: t("dialog.err_add_participant.title"),
        message: t("dialog.err_add_participant.description"),
      });
    }
  };
  const Employee = (employee: any) => {
    return (
      <View
        className={clsx(
          "mx-auto flex w-full flex-row items-start justify-between pr-5 "
        )}
      >
        <TouchableOpacity
          onPress={() => {
            setValue("email", employee.employee.email);
          }}
          className={clsx("mb-5 mr-5 w-full flex-row items-center gap-3")}
        >
          <View className={clsx("relative  ")}>
            <Image
              className={clsx("absolute left-0  top-0 h-10 w-10  rounded-full")}
              source={require("../asset/avatar-load.png")}
            />
            <Image
              source={{ uri: employee.employee.avatar }}
              className={clsx(" h-10 w-10 rounded-full ")}
            />
          </View>
          <View>
            <Text className="text-base font-semibold text-basic-black">
              {employee.employee?.name} {employee.employee?.surname}
            </Text>
            <Text className="text-xs  text-gray-500">
              {employee.employee.email}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const onChangeEmail = (text) => {
    const filteredSuggestions = employeeList.filter((item) =>
      item.email.includes(text)
    );
    setSuggestions(filteredSuggestions);
  };
  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
    >
      <ConfirmDialog
        title={t("error") as string}
        description={isErrorDialogVisible.description}
        isVisible={isErrorDialogVisible.isShow}
        onClosed={() => {
          setIsErrorDialogVisible({ ...isErrorDialogVisible, isShow: false });
          onClose();
        }}
        closeButtonLabel={t("close") || ""}
      />
      <View className=" flex h-full rounded-t-xl bg-white px-4">
        <Header
          title={t("add_participant_modal.title") || "New Participant"}
          rightBtn={t("save") || "Save"}
          leftBtn={<Close fill={"black"} />}
          onLeftBtnPress={onClose}
          onRightBtnPress={handleSubmit(onSubmit)}
        />
        <View className="px-2 pt-8">
          {userData?.companyAccount && (
            <Text className="mb-4 text-md font-semibold ">
              {t("add_participant_modal.available_credit", {
                availableCredits: userData?.availableCredits,
              })}
            </Text>
          )}
          <Controller
            control={control}
            name={"email"}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="flex flex-col gap-1">
                <TextInput
                  label={t("add_participant_modal.email") || "Email"}
                  placeholder={
                    t("add_participant_modal.email_placeholder") ||
                    "Enter employee email"
                  }
                  placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    onChangeEmail(text);
                  }}
                  value={value}
                />
              </View>
            )}
          />
          {errors.email && <ErrorText message={errors.email?.message} />}
        </View>
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            className="pt-4"
            showsVerticalScrollIndicator={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Employee employee={item} />}
            ListFooterComponent={<View className="h-20" />}
          />
        )}
      </View>
    </Modal>
  );
};
export default AddParticipantModal;
