import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "@rneui/themed";
import { Dimensions, View } from "react-native";
import Button from "../../Buttons/Button";
import {
  DIALOG_MAX_WIDTH,
  DRAWER_MAX_WIDTH,
  LAYOUT_THRESHOLD,
} from "../../../../common/constants";

interface CoachDateTimePickerProps {
  showDateTimePicker: boolean;
  setShowDateTimePicker: (show: boolean) => void;
  selectedDate?: Date;
  setSelectedDate: (date: Date) => void;
  shouldOffsetDrawerWidth?: boolean;
}

const CoachDateTimePicker: FC<CoachDateTimePickerProps> = ({
  showDateTimePicker,
  setShowDateTimePicker,
  selectedDate,
  setSelectedDate,
  shouldOffsetDrawerWidth = true,
}) => {
  const { t } = useTranslation();
  const todayDate = dayjs().toDate();

  const [tempSelectedDate, setTempSelectedDate] = React.useState(
    selectedDate || todayDate
  );
  const onConfirm = () => {
    setShowDateTimePicker(false);
    setSelectedDate(tempSelectedDate as Date);
  };

  const handleDatePicked = (date?: any) => {
    if (date) {
      setTempSelectedDate(date);
    }
  };

  return (
    <Dialog
      isVisible={showDateTimePicker}
      className="flex bg-blue-500"
      overlayStyle={{
        borderRadius: 20,
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        ...(Dimensions.get("window").width <=
        LAYOUT_THRESHOLD + DRAWER_MAX_WIDTH
          ? {}
          : {
              maxWidth: DIALOG_MAX_WIDTH,
              marginLeft: shouldOffsetDrawerWidth ? DRAWER_MAX_WIDTH : 0,
            }),
      }}
    >
      <View className="flex-1 justify-center">
        <DateTimePicker
          mode="single"
          timePicker
          date={tempSelectedDate}
          // textColor="#24252B"
          onChange={(params) => handleDatePicked(params.date)}
          minDate={dayjs().startOf("day")}
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
    </Dialog>
  );
};

export default CoachDateTimePicker;
