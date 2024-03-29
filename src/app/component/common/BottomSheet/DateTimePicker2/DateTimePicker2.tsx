import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, View } from "react-native";
import { Dialog } from "@rneui/themed";
import Button from "../../Buttons/Button";
import {
  DIALOG_MAX_WIDTH,
  DRAWER_MAX_WIDTH,
  LAYOUT_THRESHOLD,
} from "../../../../common/constants";

interface DateTimePicker2Props {
  showDateTimePicker: boolean;
  setShowDateTimePicker: (show: boolean) => void;
  selectedDate?: Date;
  setSelectedDate: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  shouldMinus16Years?: boolean;
  shouldOffsetDrawerWidth?: boolean;
}

const DateTimePicker2: FC<DateTimePicker2Props> = ({
  showDateTimePicker,
  setShowDateTimePicker,
  selectedDate,
  setSelectedDate,
  maximumDate,
  minimumDate,
  shouldMinus16Years = false,
  shouldOffsetDrawerWidth = true,
}) => {
  const { t } = useTranslation();
  const [tempSelectedDate, setTempSelectedDate] = React.useState(
    dayjs()
      .subtract(shouldMinus16Years ? 16 : 0, "years")
      .toDate()
  );
  const onConfirm = () => {
    setShowDateTimePicker(false);
    // RNDateTimePicker returns the date in UTC, so we need to add 1 day to get the correct date
    setSelectedDate(dayjs(tempSelectedDate).toDate());
  };

  return (
    <Dialog
      isVisible={showDateTimePicker}
      className="flex bg-blue-500"
      overlayStyle={{
        borderRadius: 20,
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        ...(Dimensions.get("window").width <= LAYOUT_THRESHOLD
          ? {}
          : {
              maxWidth: DIALOG_MAX_WIDTH,
              marginLeft: shouldOffsetDrawerWidth ? DRAWER_MAX_WIDTH : 0,
            }),
      }}
      onBackdropPress={() => setShowDateTimePicker(false)}
    >
      <View className="flex-1 justify-center">
        <DateTimePicker
          mode="single"
          date={tempSelectedDate}
          onChange={(params) => setTempSelectedDate(params.date as Date)}
          maxDate={
            shouldMinus16Years
              ? dayjs().subtract(16, "years").startOf("day").toDate()
              : maximumDate
          }
          minDate={
            shouldMinus16Years
              ? dayjs().subtract(100, "years").startOf("day").toDate()
              : minimumDate
          }
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

export default DateTimePicker2;
