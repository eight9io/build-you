import React, { FC, useState } from 'react';
import { View, Text } from 'react-native';

import { useForm, Controller } from 'react-hook-form';

import StepOfSteps from '../../../component/common/StepofSteps';
import SignupAvatar from '../../../component/common/Avatar/SignupAvatar';
import TextInput from '../../../component/common/Inputs/TextInput';

import Button from '../../../component/common/Buttons/Button';

import { CompleteProfileScreenNavigationProp } from './index';
import CustomTextInput from '../../../component/common/Inputs/CustomTextInput';
import Header from '../../../component/common/Header';

import NavButton from '../../../component/common/Buttons/NavButton';
import VideoPicker from '../../../component/common/VideoPicker';

interface CompleteProfileStep2Props {
  navigation: CompleteProfileScreenNavigationProp;
}

const CompleteProfileStep2: FC<CompleteProfileStep2Props> = ({
  navigation,
}) => {
  const [pickedVideo, setPickedVideo] = useState<string[]>([]);
  const [isSelectedImage, setIsSelectedImage] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<{
    biography: string;
  }>({
    defaultValues: {
      biography: '',
    },
  });

  const handleSubmitForm = (data: any) => {
    // TODO: Handle validate form with yup and remove required in form
    console.log(data);
    navigation.navigate('CompleteProfileStep3Screen');
  };

  const removeVideo = () => {
    setPickedVideo([]);
  };
  console.log(pickedVideo);

  return (
    <View className="relative flex h-full w-full flex-col items-center justify-start">
      <Header
        title="Complete profile"
        leftBtn={
          <NavButton
            text="Back"
            withIcon={true}
            onPress={() => navigation.navigate('CompleteProfileStep1Screen')}
          />
        }
        rightBtn={
          <NavButton
            text="Skip"
            withIcon={false}
            onPress={() => navigation.navigate('CompleteProfileStep3Screen')}
          />
        }
      />
      <View className="pt-2">
        <StepOfSteps step={2} totalSteps={4} />
      </View>
      <View className="flex w-64 flex-col items-center justify-center pt-6">
        <Text className="text-black-default text-h4 text-center font-semibold leading-6">
          Tell the others something about you
        </Text>
      </View>

      {/* Form */}
      <View className="mt-4 flex h-full w-full  rounded-t-xl ">
        <View className="mt-4 flex flex-col px-5 ">
          <View className="pt-5">
            <Controller
              control={control}
              name="biography"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="flex flex-col">
                  <TextInput
                    label="Biography"
                    placeholder={'Enter your last name'}
                    placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline={true}
                    numberOfLines={4}
                    className="border-gray-medium bg-gray-veryLight ml-0 mt-0 flex h-36 w-full rounded-[10px] border px-3 py-3 text-base font-normal"
                  />
                </View>
              )}
            />
          </View>
          <View className="pt-5">
            <VideoPicker
              setExternalVideo={setPickedVideo}
              useBigImage={true}
              removeVideo={removeVideo}
            />
          </View>
        </View>
      </View>
      <View className="absolute bottom-6 left-0 h-12 w-full px-4">
        <Button
          title="Next"
          containerClassName="bg-primary-default flex-1"
          textClassName="text-white"
          onPress={handleSubmit(handleSubmitForm)}
        />
      </View>
    </View>
  );
};

export default CompleteProfileStep2;
