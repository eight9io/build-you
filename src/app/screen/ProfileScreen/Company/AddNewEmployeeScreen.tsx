import { View } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddNewEmployeeValidationSchema } from "../../../Validators/validators";
import Close from "../../../component/asset/close.svg";
import { useUserProfileStore } from "../../../store/user-store";
import { serviceAddEmployee } from "../../../service/company";
import { fetchListEmployee } from "../../../utils/profile";
import { useEmployeeListStore } from "../../../store/company-data-store";
import { useNav } from "../../../hooks/useNav";
import GlobalToastController from "../../../component/common/Toast/GlobalToastController";
import ConfirmDialog from "../../../component/common/Dialog/ConfirmDialog/ConfirmDialog";
import Header from "../../../component/common/Header";
import TextInput from "../../../component/common/Inputs/TextInput";
import ErrorText from "../../../component/common/ErrorText";

export const AddNewEmployeeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNav();

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

  const onClose = () => {
    navigation.goBack();
  };

  return (
    <View className=" flex h-full rounded-t-xl bg-white px-4">
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
      <Header
        title={t("add_new_employee_modal.title") || "New employee"}
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
                label={t("add_new_employee_modal.email") || "Email"}
                placeholder={
                  t("add_new_employee_modal.email_placeholder") ||
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
        {errors.email ? <ErrorText message={errors.email?.message} /> : null}
      </View>
    </View>
  );
};
export default AddNewEmployeeScreen;
