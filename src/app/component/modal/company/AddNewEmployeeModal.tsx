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
import { serviceAddEmployee } from "../../../service/company";
import { fetchListEmployee } from "../../../utils/profile";
import { useEmployeeListStore } from "../../../store/company-data";
import GlobalToastController from "../../common/Toast/GlobalToastController";

interface IAddNewEmployeeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AddNewEmployeeModal: FC<IAddNewEmployeeModalProps> = ({
  isVisible,
  onClose,
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
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(AddNewEmployeeValidationSchema()),
  });

  // add company id
  const { setEmployeeList } = useEmployeeListStore();
  const onSubmit = (data: any) => {
    if (!userData?.id) {
      setIsErrorDialogVisible({ ...isErrorDialogVisible, isShow: true });
      return;
    }

    serviceAddEmployee(data.email, userData?.id)
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          await fetchListEmployee(userData?.id, (res: any) =>
            setEmployeeList(res)
          );
          GlobalToastController.showModal({
            message:
              t("toast.add_employee_success") || "Employee added successfully!",
          });
          onClose();
        }
      })
      .catch((err) => {
        setIsErrorDialogVisible({
          ...isErrorDialogVisible,
          isShow: true,
          description: t("error_general_message") as string,
        });
        if (err.response.status == 400) {
          setIsErrorDialogVisible({
            ...isErrorDialogVisible,
            isShow: true,
            description: t("dialog.err_add_employee") as string,
          });
        }
      });
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
          title="New employee"
          rightBtn="SAVE"
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
                  label="Email"
                  placeholder={"Enter employee email"}
                  placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(text)}
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
export default AddNewEmployeeModal;
