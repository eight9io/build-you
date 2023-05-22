import { FC, useState } from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import dayjs from '../../../../utils/date.util';
import BottomSheet from '../BottomSheet';

interface IDateTimePickerProps {
  date: Date;
  mode: 'date' | 'time';
  show: boolean;
  onDatePicked: (date?: Date) => void;
  onCancel: () => void;
}
const DateTimePicker: FC<IDateTimePickerProps> = ({
  date,
  mode,
  show,
  onDatePicked,
  onCancel,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);

  return (
    <BottomSheet
      show={show}
      title="Birthday"
      onConfirm={() => onDatePicked(selectedDate)}
      onCancel={onCancel}
    >
      <RNDateTimePicker
        value={selectedDate || new Date()}
        mode={mode}
        display="spinner"
        onChange={(_, selectedDate) => setSelectedDate(selectedDate)}
        style={{ flex: 1 }}
        maximumDate={dayjs().subtract(16, 'years').startOf('day').toDate()}
      />
    </BottomSheet>
  );
};

export default DateTimePicker;
