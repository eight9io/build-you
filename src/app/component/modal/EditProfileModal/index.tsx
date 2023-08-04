import { View, Text, Modal, SafeAreaView } from "react-native";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";

import Header from "../../common/Header";
import TextInput from "../../common/Inputs/TextInput";
import CloseIcon from "./asset/close-icon.svg";
import CalendarIcon from "./asset/calendar-icon.svg";
import DateTimePicker from "../../common/Pickers/DateTimePicker";
import dayjs from "../../../utils/date.util";
import SelectPicker from "../../common/Pickers/SelectPicker";
import { MOCK_OCCUPATION_SELECT } from "../../../mock-data/occupation";
interface IEditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const EditProfileModal: FC<IEditProfileModalProps> = ({
  isVisible,
  onClose,
}) => {
  const { t } = useTranslation();
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showOccupationPicker, setShowOccupationPicker] = useState(false);
  const [selectedOccupationIndex, setSelectedOccupationIndex] = useState<
    number | undefined
  >();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<{
    name: string;
    surname: string;
    birth: Date;
    occupation: string;
    biography: string;
  }>({
    defaultValues: {
      name: "",
      surname: "",
      birth: new Date(),
      occupation: "",
      biography: "",
    },
  });
  const handleDatePicked = (date?: Date) => {
    if (date) setValue("birth", date);
    setShowDateTimePicker(false);
  };

  const handleOccupationPicked = (index?: number) => {
    if (index) {
      setSelectedOccupationIndex(index);
      setValue("occupation", MOCK_OCCUPATION_SELECT[index].label);
    }
    setShowOccupationPicker(false);
  };
  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
    >
      <SafeAreaView className="bg-white">
        <View className="mt-4 flex h-full  rounded-t-xl bg-white">
          <Header
            title={t("edit_profile_modal.title") || "Edit Profile"}
            rightBtn={t("save") || "Save"}
            leftBtn={<CloseIcon />}
            onLeftBtnPress={onClose}
          />

          <View className="mt-4 flex flex-col px-5 ">
            <View className="pt-5">
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col gap-1">
                    <TextInput
                      label={t("edit_profile_modal.first_name") || "First Name"}
                      placeholder={
                        t("edit_profile_modal.first_name_placeholder") ||
                        "Enter your first name"
                      }
                      placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
                name="name"
              />
            </View>
            <View className="pt-5">
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col gap-1">
                    <TextInput
                      label={t("edit_profile_modal.last_name") || "Last Name"}
                      placeholder={
                        t("edit_profile_modal.last_name_placeholder") ||
                        "Enter your last name"
                      }
                      placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
                name="surname"
              />
            </View>
            <View className="pt-5">
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col gap-1">
                    <TextInput
                      label={t("edit_profile_modal.birthday") || "Birthday"}
                      placeholder={
                        t("edit_profile_modal.birthday_placeholder") ||
                        "Enter your birth"
                      }
                      placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                      rightIcon={<CalendarIcon />}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={dayjs(value).format("DD/MM/YYYY")}
                      textAlignVertical="top"
                      editable={false}
                      onPress={() => setShowDateTimePicker(true)}
                    />
                  </View>
                )}
                name="birth"
              />
            </View>

            <View className="pt-5">
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col gap-1">
                    <TextInput
                      label={t("edit_profile_modal.occupation") || "Occupation"}
                      placeholder={
                        t("edit_profile_modal.occupation_placeholder") ||
                        "Enter your occupation"
                      }
                      placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      onPress={() => setShowOccupationPicker(true)}
                      value={value}
                    />
                  </View>
                )}
                name="occupation"
              />
            </View>
            <View className="pt-5">
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col gap-1">
                    <TextInput
                      label={t("edit_profile_modal.biography") || "Biography"}
                      placeholder={
                        t("edit_profile_modal.biography_placeholder") ||
                        "Enter your biography"
                      }
                      placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline
                    />
                  </View>
                )}
                name="biography"
              />
            </View>
          </View>
          <DateTimePicker
            date={getValues("birth")}
            mode={"date"}
            show={showDateTimePicker}
            onDatePicked={handleDatePicked}
            onCancel={() => {
              setShowDateTimePicker(false);
            }}
          />
          <SelectPicker
            title={t("edit_profile_modal.occupation") || "Occupation"}
            show={showOccupationPicker}
            data={MOCK_OCCUPATION_SELECT}
            selectedIndex={selectedOccupationIndex}
            onSelect={handleOccupationPicked}
            onCancel={() => {
              setShowOccupationPicker(false);
            }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default EditProfileModal;
