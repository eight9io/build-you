import { View, Text } from 'react-native';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../component/common/Buttons/Button';

interface IChronoStepTabProps {}
export const ChronoStepTab: FC<IChronoStepTabProps> = () => {
  const { t } = useTranslation();
  return (
    <View className="flex flex-row items-center justify-center">
      <Button
        title={t('challenge_detail_screen.upload_new_update')}
        containerClassName="bg-primary-default h-[34px]"
        textClassName="text-white"
      />
    </View>
  );
};

export default ChronoStepTab;
