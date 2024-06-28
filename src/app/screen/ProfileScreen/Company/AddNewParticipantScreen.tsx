import { FlatList, View } from "react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller, set } from "react-hook-form";
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
import { EmployeesItem } from "../../../component/Profile/ProfileTabs/Company/Employees/Employees";
import GlobalDialogController from "../../../component/common/Dialog/GlobalDialog/GlobalDialogController";
import { useCreateChallengeDataStore } from "../../../store/create-challenge-data-store";

export const AddNewParticipantScreen = () => {

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
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(AddNewEmployeeValidationSchema()),
  });

  // add company id
  const { setCreateChallengeDataStore ,getCreateChallengeDataStore} = useCreateChallengeDataStore();
  const challengeDataStore = getCreateChallengeDataStore();
  
  const { getEmployeeList } = useEmployeeListStore();
  const employeeList = getEmployeeList();
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    setSuggestions(employeeList);
  }
    , [employeeList])
  const onSubmit = (data: any) => {
    if (!userData?.id) {
      setIsErrorDialogVisible({ ...isErrorDialogVisible, isShow: true });
      return;
    }
    const participant = employeeList.find((item: any) => item.email === data.email);
    const isParticipant = challengeDataStore?.usersList.find((item: any) => item === participant?.id);
    if (participant) {
      if (isParticipant) {
        GlobalDialogController.showModal({
          title: t("dialog.err_add_participant.title"),
          message: t("dialog.err_add_participant.err_description"),
        });
        return;
      }

      setCreateChallengeDataStore({ usersList: [...(challengeDataStore?.usersList || []),participant.id] });
      reset();
      onClose();
    } else {
      GlobalDialogController.showModal({
        title: t("dialog.err_add_participant.title"),
        message: t("dialog.err_add_participant.description"),
      });

    }
  };

  const onClose = () => {
    navigation.goBack();
  };
  const onChangeEmail = (text) => {
    const filteredSuggestions = employeeList.filter(item => item.email.includes(text));
    setSuggestions(filteredSuggestions);
  };
  const handleSetValue = (email) => {
    setValue("email", email);
  }
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
        title={t("add_participant_modal.title") || "New Participant"}
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
                  "Enter Participant email"
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
        {errors.email ? <ErrorText message={errors.email?.message} /> : null}
      </View>
      {suggestions.length > 0 && (

        <FlatList

          data={suggestions}
          className="pt-4"
          showsVerticalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <EmployeesItem
              item={item}
              isCompany={userData?.companyAccount}
              onPress={handleSetValue}
              isDelete={false}

            />
          )}
          contentContainerStyle={{
            paddingTop: 12,
            paddingHorizontal: 16,
            rowGap: 20,
          }}
          ListFooterComponent={<View className="h-20" />}


        />
      )}
    </View>
  );
};
export default AddNewParticipantScreen;
