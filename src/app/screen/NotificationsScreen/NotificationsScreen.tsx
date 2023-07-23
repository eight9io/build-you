import { useEffect, useState } from "react";
import { SafeAreaView, View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/navigation.type";
import { t } from "i18next";
import { useIsFocused } from "@react-navigation/native";
import AppTitle from "../../component/common/AppTitle";
import NavButton from "../../component/common/Buttons/NavButton";
import IconSearch from "../../component/common/IconSearch/IconSearch";

import Notification from "../../component/Notification";
import { useNotificationStore } from "../../store/notification";
import OtherUserProfileScreen from "../ProfileScreen/OtherUser/OtherUserProfileScreen";
import OtherUserProfileChallengeDetailsScreen from "../ProfileScreen/OtherUser/OtherUserProfileChallengeDetailsScreen";
import Button from "../../component/common/Buttons/Button";
import ShareIcon from "../../../../assets/svg/share.svg";
import { INotification } from "../../types/notification";
import { getNotifications } from "../../service/notification";
import GlobalDialogController from "../../component/common/Dialog/GlobalDialogController";
import SkeletonLoadingCommon from "../../component/common/SkeletonLoadings/SkeletonLoadingCommon";
const NotificationsStack = createNativeStackNavigator<RootStackParamList>();

type NotificationsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "NotificationsScreen"
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
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (isFocused) {
      const hasNewNotification = getHasNewNotification();
      // Remove new notification icon (if any) when user enter this screen
      if (hasNewNotification) setHasNewNotification(false);
    }
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchNotifications();
      setIsLoading(false);
    })();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      GlobalDialogController.showModal({
        title: "Error",
        message:
          t("errorMessage:500") ||
          "Something went wrong. Please try again later!",
        button: "OK",
      });
      console.error(error);
    }
  };

  const handleScrollToRefresh = async () => {
    setIsRefreshing(true);
    await fetchNotifications();
    setIsRefreshing(false);
  };

  if (isLoading)
    return (
      <View className="flex-1">
        <SkeletonLoadingCommon />
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FB]">
      {/* <MainNavBar
        title={t('top_nav.noti')}
        navigation={navigation}
        withSearch
      /> */}

      <Notification
        notifications={notifications}
        isRefreshing={isRefreshing}
        onRefresh={handleScrollToRefresh}
      />
    </SafeAreaView>
  );
};

const NotificationsScreen = () => {
  return (
    <NotificationsStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerShown: true,
      }}
    >
      <NotificationsStack.Screen
        name="NotificationsScreen"
        component={Notifications}
        options={({ navigation }) => ({
          headerTitle: () => <AppTitle title={t("top_nav.noti")} />,
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
          headerTitle: () => "",
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
      <NotificationsStack.Screen
        name="OtherUserProfileChallengeDetailsScreen"
        component={OtherUserProfileChallengeDetailsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => "",
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
          headerRight: () => {
            return (
              <View>
                <Button
                  Icon={<ShareIcon />}
                  onPress={() => console.log("press share")}
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
