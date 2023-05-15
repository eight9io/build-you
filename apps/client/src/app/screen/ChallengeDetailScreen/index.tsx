import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import TabView from '../../component/common/Tab/TabView';
import DescriptionTab from './DescriptionTab';
import ChronoStepTab from './ChronoStepTab';

const CHALLENGE_TABS_TITLE_TRANSLATION = [
  i18n.t('challenge_detail_screen.chrono_step'),
  i18n.t('challenge_detail_screen.description'),
];
export const ChallengeDetailScreen = () => {
  const { t } = useTranslation();
  return (
    <View className="flex-1 bg-white py-2">
      <View className="px-4">
        <View className="w- full flex flex-row justify-between">
          <Text className="text-primary-default text-xs font-normal">
            {t('challenge_detail_screen.title')}
          </Text>
          {/* <View className="flex flex-row items-center justify-between gap-2">
            <Image
              className="h-[14px] w-[14px]"
              source={require('./asset/group-icon.png')}
            />
            <Text className="text-xs font-normal opacity-50">45</Text>
          </View> */}
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

      <View className="mt-2 flex-1 px-4">
        <TabView titles={CHALLENGE_TABS_TITLE_TRANSLATION}>
          <ChronoStepTab />
          <DescriptionTab
            description={
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at venenatis eros. Nam volutpat leo at eros accumsan, in accumsan erat euismod. Praesent tincidunt nec lorem euismod ullamcorper. Aenean feugiat turpis quis ligula efficitur molestie. Aliquam erat volutpat. Etiam in luctus lacus, ac luctus nisi. Phasellus hendrerit felis vitae bibendum tristique. Donec accumsan orci erat, eu fermentum metus consequat id. \nSed gravida felis nec quam vestibulum dignissim. Suspendisse lectus mauris, vestibulum eu ornare in, dignissim vel nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla vestibulum, massa at fringilla elementum, ex nulla imperdiet quam, auctor bibendum arcu lacus ac arcu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at venenatis eros. Nam volutpat leo at eros accumsan, in accumsan erat euismod. Praesent tincidunt nec lorem euismod ullamcorper. Aenean feugiat turpis quis ligula efficitur molestie. Aliquam erat volutpat. Etiam in luctus lacus, ac luctus nisi. Phasellus hendrerit felis vitae bibendum tristique. Donec accumsan orci erat, eu fermentum metus consequat id. \nSed gravida felis nec quam vestibulum dignissim. Suspendisse lectus mauris, vestibulum eu ornare in, dignissim vel nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla vestibulum, massa at fringilla elementum, ex nulla imperdiet quam, auctor bibendum arcu lacus ac arcu.'
            }
          />
        </TabView>
      </View>
    </View>
  );
};

export default ChallengeDetailScreen;
