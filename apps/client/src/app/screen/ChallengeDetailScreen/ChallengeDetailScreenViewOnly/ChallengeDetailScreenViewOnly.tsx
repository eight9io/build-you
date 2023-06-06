import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FC, useState } from 'react';
import { NavigationProp, Route, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TabView from '../../../component/common/Tab/TabView';
import Header from '../../../component/common/Header';
import NavButton from '../../../component/common/Buttons/NavButton';
import ProgressTab from '../../../component/ChallengeDetailScreenViewOnly/ProgressTab/ProgressTab';
import DescriptionTab from '../../../component/ChallengeDetailScreenViewOnly/DescriptionTab/DescriptionTab';

import { RootStackParamList } from '../../../navigation/navigation.type';
import i18n from '../../../i18n/i18n';

const CHALLENGE_TABS_TITLE_TRANSLATION = [
  i18n.t('challenge_detail_screen.progress'),
  i18n.t('challenge_detail_screen.description'),
];

interface IChallengeDetailScreenViewOnlyProps {
  route: Route<
    'ChallengeDetailScreenViewOnly',
    {
      challengeId: string;
    }
  >;
}

export const ChallengeDetailScreenViewOnly: FC<
  IChallengeDetailScreenViewOnlyProps
> = ({ route }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { challengeId } = route.params;
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const arrayProgress = [
    {
      id: '1',
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
      id: '2',
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
      id: '3',
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
    <View className=" h-full bg-white ">
      {/* <Header
        leftBtn={
          <NavButton
            text="Back"
            withBackIcon={true}
            onPress={() => navigation.goBack()}
          />
        }
      /> */}
      <View className="flex-1 bg-white py-4 ">
        <Text className="text-basic px-4 text-xl font-medium leading-8">
          Climbing Mont Blanc
        </Text>

        <View className="flex-1">
          <TabView
            titles={CHALLENGE_TABS_TITLE_TRANSLATION}
            activeTabIndex={index}
            setActiveTabIndex={setIndex}
          >
            <ProgressTab arrProgress={arrayProgress} />
            <DescriptionTab
              description={
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at venenatis eros. Nam volutpat leo at eros accumsan, in accumsan erat euismod. Praesent tincidunt nec lorem euismod ullamcorper. Aenean feugiat turpis quis ligula efficitur molestie. Aliquam erat volutpat. Etiam in luctus lacus, ac luctus nisi. Phasellus hendrerit felis vitae bibendum tristique. Donec accumsan orci erat, eu fermentum metus consequat id. \nSed gravida felis nec quam vestibulum dignissim. Suspendisse lectus mauris, vestibulum eu ornare in, dignissim vel nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla vestibulum, massa at fringilla elementum, ex nulla imperdiet quam, auctor bibendum arcu lacus ac arcu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at venenatis eros. Nam volutpat leo at eros accumsan, in accumsan erat euismod. Praesent tincidunt nec lorem euismod ullamcorper. Aenean feugiat turpis quis ligula efficitur molestie. Aliquam erat volutpat. Etiam in luctus lacus, ac luctus nisi. Phasellus hendrerit felis vitae bibendum tristique. Donec accumsan orci erat, eu fermentum metus consequat id. \nSed gravida felis nec quam vestibulum dignissim. Suspendisse lectus mauris, vestibulum eu ornare in, dignissim vel nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla vestibulum, massa at fringilla elementum, ex nulla imperdiet quam, auctor bibendum arcu lacus ac arcu.'
              }
            />
          </TabView>
        </View>
      </View>
    </View>
  );
};

export default ChallengeDetailScreenViewOnly;
