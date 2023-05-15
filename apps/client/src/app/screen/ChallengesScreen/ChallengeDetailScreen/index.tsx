import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import TabView from '../../../component/common/Tab/TabView';
import DescriptionTab from './DescriptionTab';
import ProgressTab from './ProgressTab';
import { useState } from 'react';
import CreateChallengeModal from '../../../component/modal/CreateChallengeModal';

const CHALLENGE_TABS_TITLE_TRANSLATION = [
  i18n.t('challenge_detail_screen.progress'),
  i18n.t('challenge_detail_screen.description'),
];
export const ChallengeDetailScreen = () => {
  const { t } = useTranslation();
  const [isCreateChallengeModalVisible, setIsCreateChallengeModalVisible] =
    useState(true);

  return (
    <View className="flex flex-col bg-white py-2">
      <View className="px-4">
        <View className="flex w-full flex-row justify-between">
          {/* <Text className='text-primary-default text-xs font-normal'>
            {t('challenge_detail_screen.title')}
          </Text> */}
          {/* <View className='flex flex-row items-center justify-between gap-2'>
            <Image
              className='h-[14px] w-[14px]'
              source={require('./asset/group-icon.png')}
            />
            <Text className='text-xs font-normal opacity-50'>45</Text>
          </View> */}
        </View>
        <View className="flex flex-row items-center justify-between pt-2">
          <View>
            <Text className="text-basic text-xl font-medium leading-5">
              Climbing Mont Blanc
            </Text>
            <Text className="text-gray-dark text-sm font-normal leading-5">
              {`${t('challenge_detail_screen.builder')}: Marco Rossi`}
            </Text>
          </View>
          <TouchableOpacity>
            <Image
              className="h-[16px] w-[16px]"
              source={require('./assets/edit-icon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-4 h-[150px] w-full">
        <Image
          className="h-[150px]"
          source={{
            uri: 'https://picsum.photos/500',
          }}
        />
      </View>

      <View className="mt-2">
        <TabView titles={CHALLENGE_TABS_TITLE_TRANSLATION}>
          <ProgressTab />
          <DescriptionTab />
        </TabView>
      </View>
      {/* <CreateChallengeModal
        isVisible={isCreateChallengeModalVisible}
        onClose={() => {
          setIsCreateChallengeModalVisible(false);
        }}
      /> */}
    </View>
  );
};

export default ChallengeDetailScreen;
