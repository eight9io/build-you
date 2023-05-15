import { View, Text } from 'react-native';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../component/common/Buttons/Button';

import AddIcon from './assets/add.svg'

import AddNewChallengeProgressModal from '../../../component/modal/AddNewChallengeProgressModal';

interface IProgressTabProps {}
export const ProgressTab: FC<IProgressTabProps> = () => {
  const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false)
  const { t } = useTranslation();
  return (
    <View className='flex flex-row items-center justify-center'>
      <Button
        title={t('challenge_detail_screen.upload_new_update')}
        containerClassName='bg-primary-default'
        textClassName='text-white text-md font-semibold py-4 ml-2'
        Icon={<AddIcon fill={'white'}/>}
        onPress={() => setIsModalVisible(true)}
      />
      <AddNewChallengeProgressModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

export default ProgressTab;
