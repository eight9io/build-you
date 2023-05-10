import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Intro: undefined;
  Home: undefined;
  Inner: undefined;
  Avvisi: undefined;
  ChallengeDetail: undefined;
  Settings: undefined;
  Profile: undefined;
};

export type NavigationRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;

export const useNav = () => {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
};
