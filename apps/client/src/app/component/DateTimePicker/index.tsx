import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FC } from 'react';
import { FillButton } from '../common/Buttons/Button';
import { Text, View } from 'react-native';
interface IDateTimePickerProps {
  mode: 'date' | 'time';
  show: boolean;
  onDatePicked: (date: Date) => void;
  onCancel: () => void;
}
const DateTimePicker: FC<IDateTimePickerProps> = ({
  mode,
  show,
  onDatePicked,
  onCancel,
}) => {
  return (
    <>
      {show && (
        <DateTimePickerModal
          isVisible={show}
          mode={mode}
          is24Hour={true}
          onConfirm={onDatePicked}
          onCancel={onCancel}
          display="spinner"
          customConfirmButtonIOS={({ onPress }) => (
            <View className="mx-6 my-6 h-[48px]">
              <FillButton title="Save" onPress={() => onPress()} />
            </View>
          )}
          customCancelButtonIOS={() => null}
        />
      )}
    </>
  );
};

export default DateTimePicker;
