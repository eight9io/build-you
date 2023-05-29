import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import TabView from '../../component/common/Tab/TabView';
// import DescriptionTab from './DescriptionTab';
import ChronoStepTab from './ChronoStepTab';

const CHALLENGE_TABS_TITLE_TRANSLATION = [
  i18n.t('challenge_detail_screen.chrono_step'),
  i18n.t('challenge_detail_screen.description'),
];
export const ChallengeDetailScreen = () => {
  const { t } = useTranslation();
  // const [isCreateChallengeModalVisible, setIsCreateChallengeModalVisible] =
  //   useState(true);

  const arrayProgress = [
    {
      id: 1,
      avatar: 'avata',
      name: 'Marco Rossi',
      time: '1 hour ago',
      stt: "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
      card: {
        image: 'https://picsum.photos/200/300',
        title: 'Climbing Mont Blanc',
        builder: 'Marco Rossi',
      },
      like: 5,
      comment: 0,
    },
    {
      id: 2,
      avatar: 'avata',
      name: 'Marco Rossi22',
      time: '1 hour ago',
      stt: "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
      card: {
        image: 'https://picsum.photos/200/300',
        title: 'Climbing Mont Blanc',
        builder: 'Marco Rossi',
      },
      like: 0,
      comment: 0,
    },
    {
      id: 3,
      avatar: 'avata',
      name: 'Marco Rossi 333',
      time: '1 hour ago',
      stt: "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
      card: {
        image: 'https://picsum.photos/200/300',
        title: 'Climbing Mont Blanc',
        builder: 'Marco Rossi',
      },
      like: 0,
      comment: 10,
    },
  ];
  return (
    <View className="flex-1 bg-white py-2">
      <View className="px-4">
        <View className="flex w-full flex-row justify-between">
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
            <Text className="text-basic text-xl font-medium leading-8">
              Climbing Mont Blanc
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

      <View className="flex-1 bg-gray-50  pt-2 ">
        <TabView titles={CHALLENGE_TABS_TITLE_TRANSLATION}>
          <ChronoStepTab arrProgress={arrayProgress} />
          {/* <DescriptionTab
            description={
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at venenatis eros. Nam volutpat leo at eros accumsan, in accumsan erat euismod. Praesent tincidunt nec lorem euismod ullamcorper. Aenean feugiat turpis quis ligula efficitur molestie. Aliquam erat volutpat. Etiam in luctus lacus, ac luctus nisi. Phasellus hendrerit felis vitae bibendum tristique. Donec accumsan orci erat, eu fermentum metus consequat id. \nSed gravida felis nec quam vestibulum dignissim. Suspendisse lectus mauris, vestibulum eu ornare in, dignissim vel nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla vestibulum, massa at fringilla elementum, ex nulla imperdiet quam, auctor bibendum arcu lacus ac arcu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at venenatis eros. Nam volutpat leo at eros accumsan, in accumsan erat euismod. Praesent tincidunt nec lorem euismod ullamcorper. Aenean feugiat turpis quis ligula efficitur molestie. Aliquam erat volutpat. Etiam in luctus lacus, ac luctus nisi. Phasellus hendrerit felis vitae bibendum tristique. Donec accumsan orci erat, eu fermentum metus consequat id. \nSed gravida felis nec quam vestibulum dignissim. Suspendisse lectus mauris, vestibulum eu ornare in, dignissim vel nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla vestibulum, massa at fringilla elementum, ex nulla imperdiet quam, auctor bibendum arcu lacus ac arcu.'
            }
          /> */}
          <View></View>
        </TabView>
      </View>
    </View>
  );
};

export default ChallengeDetailScreen;
