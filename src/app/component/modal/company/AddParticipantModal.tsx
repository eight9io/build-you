import { View, Modal } from "react-native";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { AddNewEmployeeValidationSchema } from "../../../Validators/validators";

import Header from "../../common/Header";
import ErrorText from "../../common/ErrorText";
import TextInput from "../../common/Inputs/TextInput";
import Close from "../../../component/asset/close.svg";
import ConfirmDialog from "../../common/Dialog/ConfirmDialog";
import { useUserProfileStore } from "../../../store/user-store";
import { useEmployeeListStore } from "../../../store/company-data-store";
import GlobalDialogController from "../../common/Dialog/GlobalDialogController";
import { IUserData } from "../../../types/user";

interface IAddNewEmployeeModalProps {
  isVisible: boolean;
  onClose: () => void;
  setParticipantList: React.Dispatch<React.SetStateAction<string[]>>
  participantList: any[]
  employeeList?: IUserData[]
}

export const AddParticipantModal: FC<IAddNewEmployeeModalProps> = ({
  isVisible,
  onClose,
  setParticipantList,
  participantList,
  employeeList

}) => {
  const { t } = useTranslation();

  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState({
    isShow: false,
    description: t("error_general_message") as string,
  });

  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

  const {
    control,
    handleSubmit,
    reset,
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
    const participant = employeeList.find((item: any) => item.email === data.email);
    if (participant) {
      setParticipantList([...participantList, participant])
      reset(); 
      onClose();
    } else {
      GlobalDialogController.showModal({
        title: t("dialog.err_add_participant.title"),
        message: t("dialog.err_add_participant.description", { max_people: 5 }),
      });

    }

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
          title={t("add_participant_modal.title") || "New employee"}
          rightBtn={t("save") || "Save"}
          leftBtn={<Close fill={"black"} />}
          onLeftBtnPress={onClose}
          onRightBtnPress={handleSubmit(onSubmit)}
        />
        <View className="px-2 pt-8">
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
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
          {errors.email && <ErrorText message={errors.email?.message} />}
        </View>
      </View>
    </Modal>
  );
};
export default AddParticipantModal;
