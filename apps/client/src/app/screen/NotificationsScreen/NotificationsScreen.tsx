import { useEffect } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/navigation.type';
import { t } from 'i18next';
import { useIsFocused } from '@react-navigation/native';
import AppTitle from '../../component/common/AppTitle';
import NavButton from '../../component/common/Buttons/NavButton';
import IconSearch from '../../component/common/IconSearch/IconSearch';

import Notification from '../../component/Notification';
import { useNotificationStore } from '../../store/notification';
import OtherUserProfileScreen from '../ProfileScreen/OtherUser/OtherUserProfileScreen';
import OtherUserProfileDetailsScreen from '../ProfileScreen/OtherUser/OtherUserProfileDetailsScreen';
import Button from '../../component/common/Buttons/Button';
import ShareIcon from '../../../../assets/svg/share.svg';
const NotificationsStack = createNativeStackNavigator<RootStackParamList>();

type NotificationsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NotificationsScreen'
>;

const Notifications = ({
  navigation,
}: {
  navigation: NotificationsScreenNavigationProp;
}) => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { getHasNewNotification, setHasNewNotification } =
    useNotificationStore();

  useEffect(() => {
    if (isFocused) {
      const hasNewNotification = getHasNewNotification();
      // Remove new notification icon (if any) when user enter this screen
      if (hasNewNotification) setHasNewNotification(false);
    }
  }, [isFocused]);

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FB]">
      {/* <MainNavBar
        title={t('top_nav.noti')}
        navigation={navigation}
        withSearch
      /> */}

      <Notification />
    </SafeAreaView>
  );
};

const NotificationsScreen = () => {
  return (
    <NotificationsStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerShown: true,
      }}
    >
      <NotificationsStack.Screen
        name="NotificationsScreen"
        component={Notifications}
        options={({ navigation }) => ({
          headerTitle: () => <AppTitle title={t('top_nav.noti')} />,
          // headerRight: (props) => (
          //   <NavButton
          //     withIcon
          //     icon={
          //       <IconSearch
          //         onPress={() => console.log('NotificationsScreen Search')}
          //       />
          //     }
          //   />
          // ),
        })}
      />
      <NotificationsStack.Screen
        name="OtherUserProfileScreen"
        component={OtherUserProfileScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => '',
          headerLeft: (props) => (
            <NavButton
              text={t('button.back') as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
      <NotificationsStack.Screen
        name="OtherUserProfileDetailsScreen"
        component={OtherUserProfileDetailsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => '',
          headerLeft: (props) => (
            <NavButton
              text={t('button.back') as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
          headerRight: () => {
            return (
              <View>
                <Button
                  Icon={<ShareIcon />}
                  onPress={() => console.log('press share')}
                />
              </View>
            );
          },
        })}
      />
    </NotificationsStack.Navigator>
  );
};

export default NotificationsScreen;
