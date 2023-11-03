import RNDateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Platform, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import BottomSheet2 from "../BottomSheet";
import Button from "../../Buttons/Button";
import DatePicker from "react-native-date-picker";

interface CoachDateTimePickerProps {
  showDateTimePicker: boolean;
  setShowDateTimePicker: (show: boolean) => void;
  selectedDate?: Date;
  setSelectedDate: (date: Date) => void;
}

const CoachDateTimePicker: FC<CoachDateTimePickerProps> = ({
  showDateTimePicker,
  setShowDateTimePicker,
  selectedDate,
  setSelectedDate,
}) => {
  const { t } = useTranslation();
  const todayDate = dayjs().toDate();

  const [tempSelectedDate, setTempSelectedDate] = React.useState(todayDate);
  const onConfirm = () => {
    setShowDateTimePicker(false);
    // RNDateTimePicker returns the date in UTC, so we need to add 1 day to get the correct date
    setSelectedDate(tempSelectedDate as Date);
  };

  const handleDatePicked = (date?: any) => {
    if (date) {
      setTempSelectedDate(date);
    }
  };

  return (
    <Modal
      isVisible={showDateTimePicker}
      onBackdropPress={() => setShowDateTimePicker(false)}
      onSwipeComplete={() => setShowDateTimePicker(false)}
      swipeDirection={"down"}
      hasBackdrop
      onBackButtonPress={() => setShowDateTimePicker(false)}
      backdropColor={"gray"}
      backdropOpacity={0.2}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPressOut={() => setShowDateTimePicker(false)}
      >
        <View className="flex-1">
          <BottomSheet2 onClose={() => setShowDateTimePicker(false)}>
            <View className=" h-full w-full items-center justify-center">
              <DatePicker
                date={selectedDate}
                onDateChange={handleDatePicked}
                dividerHeight={1}
                minimumDate={dayjs().startOf("day").toDate()}
              />
              <View className="mt-6 h-12 w-full px-4">
                <Button
                  title={t("save") || "Save"}
                  onPress={onConfirm}
                  containerClassName="bg-primary-default flex-1"
                  textClassName="text-white"
                  testID="date_time_picker_confirm_btn"
                />
              </View>
            </View>
          </BottomSheet2>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CoachDateTimePicker;
