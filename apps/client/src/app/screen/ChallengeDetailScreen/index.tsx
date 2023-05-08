import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import TabView from '../../component/common/Tab/TabView';
import Button from '../../component/common/Button';

const CHALLENGE_TABS_TITLE_TRANSLATION = [
  i18n.t('challenge_detail_screen.chrono_step'),
  i18n.t('challenge_detail_screen.description'),
  i18n.t('challenge_detail_screen.skills'),
  i18n.t('challenge_detail_screen.coach'),
  i18n.t('challenge_detail_screen.participants'),
];
export const ChallengeDetailScreen = () => {
  const { t } = useTranslation();

  return (
    <View className="w-full flex-1 bg-white py-2">
      <View className="px-4">
        <View className="flex w-full flex-row justify-between">
          <Text className="text-primary-default text-xs font-normal">
            {t('challenge_detail_screen.title')}
          </Text>
          <View className="flex flex-row items-center justify-between gap-2">
            <Image
              className="h-[14px] w-[14px]"
              source={require('./asset/group-icon.png')}
            />
            <Text className="text-xs font-normal opacity-50">45</Text>
          </View>
        </View>
        <View className="flex flex-row items-center justify-between">
          <View>
            <Text className="text-basic text-xl font-medium">
              Scalare il Monte bianco
            </Text>
            <Text className="text-gray-dark text-xs font-normal">
              {`${t('challenge_detail_screen.builder')}: Marco Rossi`}
            </Text>
          </View>
          <TouchableOpacity>
            <Image
              className="h-[16px] w-[16px]"
              source={require('./asset/edit-icon.png')}
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

      <View className="mt-2 px-4">
        <TabView titles={CHALLENGE_TABS_TITLE_TRANSLATION}>
          <View className="flex flex-row items-center justify-center">
            <Button
              title={t('challenge_detail_screen.upload_new_update')}
              containerClassName="bg-primary-default h-[34px]"
              textClassName="text-white"
            />
          </View>
          <View>
            <Text>Child 2</Text>
          </View>
        </TabView>
      </View>
    </View>
  );
};

export default ChallengeDetailScreen;
