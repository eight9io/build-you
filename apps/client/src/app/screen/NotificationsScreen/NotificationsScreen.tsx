import { useEffect } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/navigation.type';
import { t } from 'i18next';
import AppTitle from '../../component/common/AppTitle';
import NavButton from '../../component/common/Buttons/NavButton';
import IconSearch from '../../component/common/IconSearch/IconSearch';

import Notification from '../../component/Notification';
import { useNotificationStore } from '../../store/notification';
import { useIsFocused } from '@react-navigation/native';

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
    <ScrollView className="h-full ">
      <SafeAreaView className="justify-content: space-between mb-24 flex-1 bg-white">
        {/* <MainNavBar
        title={t('top_nav.noti')}
        navigation={navigation}
        withSearch
      /> */}

        <View>
          <Notification title="New" />
          <Notification title="Previous" isPrevious={true} />
        </View>
      </SafeAreaView>
    </ScrollView>
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
          headerRight: (props) => (
            <NavButton
              withIcon
              icon={
                <IconSearch
                  onPress={() => console.log('NotificationsScreen Search')}
                />
              }
            />
          ),
        })}
      />
    </NotificationsStack.Navigator>
  );
};

export default NotificationsScreen;
