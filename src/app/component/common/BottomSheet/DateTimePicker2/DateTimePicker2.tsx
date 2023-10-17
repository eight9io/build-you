import RNDateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Platform, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import BottomSheet2 from "../BottomSheet";
import Button from "../../Buttons/Button";

interface DateTimePicker2Props {
  showDateTimePicker: boolean;
  setShowDateTimePicker: (show: boolean) => void;
  selectedDate?: Date;
  setSelectedDate: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  shouldMinus16Years?: boolean;
}

const DateTimePicker2: FC<DateTimePicker2Props> = ({
  showDateTimePicker,
  setShowDateTimePicker,
  selectedDate,
  setSelectedDate,
  maximumDate,
  minimumDate,
  shouldMinus16Years = false,
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
    setSelectedDate(tempSelectedDate as Date);
  };

  return (
    <>
      {Platform.OS === "ios" ? (
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
                <View className="relative h-full w-full">
                  {shouldMinus16Years && (
                    <RNDateTimePicker
                      value={selectedDate || tempSelectedDate}
                      mode={"date"}
                      display="spinner"
                      textColor="black" // Fix text turning white when iOS is in dark mode
                      onChange={(_, value) =>
                        setTempSelectedDate(value as Date)
                      }
                      style={{ height: "80%" }}
                      maximumDate={dayjs()
                        .subtract(16, "years")
                        .startOf("day")
                        .toDate()}
                      minimumDate={dayjs()
                        .subtract(100, "years")
                        .startOf("day")
                        .toDate()}
                    />
                  )}
                  {!shouldMinus16Years && (
                    <RNDateTimePicker
                      value={selectedDate || tempSelectedDate}
                      mode={"date"}
                      display="spinner"
                      textColor="black" // Fix text turning white when iOS is in dark mode
                      onChange={(_, value) =>
                        setTempSelectedDate(value as Date)
                      }
                      style={{ height: "80%" }}
                      maximumDate={maximumDate}
                      minimumDate={minimumDate}
                    />
                  )}
                  <View className="absolute bottom-10 h-12 w-full px-4">
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
      ) : (
        <>
          {showDateTimePicker ? (
            <RNDateTimePicker
              value={selectedDate || tempSelectedDate}
              mode={"date"}
              display="spinner"
              textColor="black" // Fix text turning white when iOS is in dark mode
              onChange={(event, value) => {
                if (event.type === "set") {
                  // User pressed confirm
                  setSelectedDate(value as Date);
                  setShowDateTimePicker(false);
                } else {
                  // User pressed cancel
                  setShowDateTimePicker(false);
                }
              }}
              style={{ height: "80%" }}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
            />
          ) : null}
        </>
      )}
    </>
  );
};

export default DateTimePicker2;
