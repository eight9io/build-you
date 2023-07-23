import { View, Text } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

const Step = ({ currentStep }: any) => {
  const { t } = useTranslation();
  const step = [1, 2, 3, 4];
  return (
    <View>
      <Text className="text-gray-dark mb-2 mt-4  text-center text-sm font-normal leading-6 ">
        {t('modal_skill.step')} {currentStep} {t('modal_skill.of')}{' '}
        {step.length}
      </Text>
      <View className=" flex-row justify-center gap-2.5">
        {step.map((item, index) => (
          <View
            className={clsx([
              ' h-1.5  rounded-full ',
              currentStep > index + 1
                ? 'bg-success-default'
                : currentStep === index + 1
                ? 'bg-sky-10'
                : 'bg-gray-light',

              ,
              currentStep === index + 1 ? ' w-6' : 'w-1.5',
            ])}
            key={index}
          />
        ))}
      </View>
    </View>
  );
};

export default Step;
