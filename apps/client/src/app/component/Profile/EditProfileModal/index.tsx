import { View, Text, Modal, SafeAreaView } from 'react-native';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';

import Header from '../../common/Header';
import TextInput from '../../common/Inputs/TextInput';
import CloseIcon from './asset/close-icon.svg';
import CalendarIcon from './asset/calendar-icon.svg';
import DateTimePicker from '../../common/Pickers/DateTimePicker';
import dayjs from '../../../utils/date.util';
import SelectPicker from '../../common/Pickers/SelectPicker';
import { MOCK_OCCUPATION_SELECT } from '../../../mock-data/occupation';
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
    firstName: string;
    lastName: string;
    birthday: Date;
    occupation: string;
    biography: string;
  }>({
    defaultValues: {
      firstName: '',
      lastName: '',
      birthday: new Date(),
      occupation: '',
      biography: '',
    },
  });
  const onSubmit = (data: any) => console.log(data);
  // TODO: handle change CREATE text color when input is entered

  const handleDatePicked = (date?: Date) => {
    if (date) setValue('birthday', date);
    setShowDateTimePicker(false);
  };

  const handleOccupationPicked = (index?: number) => {
    if (index) {
      setSelectedOccupationIndex(index);
      setValue('occupation', MOCK_OCCUPATION_SELECT[index].label);
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
          <View className="mt-6">
            <Header
              title="Edit profile"
              leftBtn={
                <View className="top-1/2">
                  <CloseIcon />
                </View>
              }
              rightBtn={
                <Text className="text-gray-dark text-base font-normal">
                  SAVE
                </Text>
              }
              onLeftBtnPress={onClose}
            />
          </View>

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
                      label="First Name"
                      placeholder={'Enter your first name'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="border-gray-medium bg-gray-veryLight flex w-full rounded-[10px] border-[1px] px-3 py-3 text-base font-normal"
                    />
                  </View>
                )}
                name="firstName"
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
                      label="Last Name"
                      placeholder={'Enter your last name'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="border-gray-medium bg-gray-veryLight flex w-full rounded-[10px] border-[1px] px-3 py-3 text-base font-normal"
                    />
                  </View>
                )}
                name="lastName"
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
                      label="Birthday"
                      placeholder={'Enter your birthday'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      rightIcon={<CalendarIcon />}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={dayjs(value).format('DD/MM/YYYY')}
                      textAlignVertical="top"
                      editable={false}
                      onPress={() => setShowDateTimePicker(true)}
                      className="border-gray-medium bg-gray-veryLight flex w-full rounded-[10px] border-[1px] px-3 py-3 text-base font-normal"
                    />
                  </View>
                )}
                name="birthday"
              />
            </View>
            {/* TODO: Implement a slide modal picker */}
            <View className="pt-5">
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col gap-1">
                    <TextInput
                      label="Occupation"
                      placeholder={'Enter your occupation'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      onPress={() => setShowOccupationPicker(true)}
                      value={value}
                      className="border-gray-medium bg-gray-veryLight flex w-full rounded-[10px] border-[1px] px-3 py-3 text-base font-normal"
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
                      label="Biography"
                      placeholder={'Enter your biography'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline
                      className="border-gray-medium bg-gray-veryLight flex h-40 w-full rounded-[10px] border-[1px] px-3 py-3 text-base font-normal"
                    />
                  </View>
                )}
                name="biography"
              />
            </View>
          </View>
          <DateTimePicker
            date={getValues('birthday')}
            mode={'date'}
            show={showDateTimePicker}
            onDatePicked={handleDatePicked}
            onCancel={() => {
              setShowDateTimePicker(false);
            }}
          />
          <SelectPicker
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
