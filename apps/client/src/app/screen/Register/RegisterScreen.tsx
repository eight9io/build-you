import { View, Text, Image, SafeAreaView } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import TextInput from '../../component/common/Input/TextInput';

export default function index() {
  const { t } = useTranslation();
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
  return (
    <SafeAreaView className="h-full bg-white ">
      <View className="flex-column items-center ">
        <Image
          className=" mb-7 mt-10 h-[91px] w-[185px]"
          source={require('./asset/buildYou.png')}
          resizeMode="cover"
        />
        <Text className="text-h6 text-gray-dark px-24 text-center leading-6 ">
          {t('register_screen.sub_title')}
        </Text>
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
                  // onPress={() => setShowOccupationPicker(true)}
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
    </SafeAreaView>
  );
}
