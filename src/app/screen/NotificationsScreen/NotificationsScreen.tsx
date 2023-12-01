import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
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

import Notification from "../../component/Notification";
import { useNotificationStore } from "../../store/notification-store";
import OtherUserProfileScreen from "../ProfileScreen/OtherUser/OtherUserProfileScreen";
import OtherUserProfileChallengeDetailsScreen from "../ProfileScreen/OtherUser/OtherUserProfileChallengeDetailsScreen/OtherUserProfileChallengeDetailsScreen";
import { INotification } from "../../types/notification";
import { getNotifications } from "../../service/notification";
import GlobalDialogController from "../../component/common/Dialog/GlobalDialogController";
import SkeletonLoadingCommon from "../../component/common/SkeletonLoadings/SkeletonLoadingCommon";

import { setLastNotiIdToLocalStorage } from "../../utils/notification.util";
import ProgressCommentScreen from "../ChallengesScreen/ProgressCommentScreen/ProgressCommentScreen";
import PersonalChallengeDetailScreen from "../ChallengesScreen/PersonalChallengesScreen/PersonalChallengeDetailScreen/PersonalChallengeDetailScreen";
import PersonalCoachChallengeDetailScreen from "../ChallengesScreen/CoachChallengesScreen/PersonalCoach/PersonalCoachChallengeDetailScreen";
import CompanyChallengeDetailScreen from "../ChallengesScreen/CompanyChallengesScreen/CompanyChallengeDetailScreen/CompanyChallengeDetailScreen";
import { CrashlyticService } from "../../service/crashlytic";

const NotificationsStack = createNativeStackNavigator<RootStackParamList>();

export type NotificationsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "NotificationsScreen"
>;

const Notifications = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const isFocused = useIsFocused();
  const { numOfNewNotifications, refreshNumOfNewNotifications } =
    useNotificationStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { setNewestNotificationId } = useNotificationStore();

  useEffect(() => {
    setIsLoading(true);
    fetchNotifications().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchNotifications(); // Implicitly fetch notifications when there is a new notification
    if (isFocused) {
      refreshNumOfNewNotifications();
    }
  }, [numOfNewNotifications]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
      if (data.length > 0) {
        setLastNotiIdToLocalStorage(`${data[0]?.id}`);
        setNewestNotificationId(`${data[0]?.id}`);
      }
    } catch (error) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message:
          (t("error_general_message") as string) || "Something went wrong",
        button: t("dialog.ok"),
      });
      console.error(error);
      CrashlyticService({
        errorType: "Fetch Notification Error",
        error: error,
      });
    }
  };

  const handleRefresh = async () => {
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
      <Notification
        notifications={notifications}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
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
        options={() => ({
          headerTitle: () => <AppTitle title={t("top_nav.noti")} />,
          // headerRight: (props) => (
          //   <NavButton
          //     withIcon
          //     icon={
          //       <IconSearch
          //         onPress={() => console.log("NotificationsScreen Search")}
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
        })}
      />

      <NotificationsStack.Screen
        name="ProgressCommentScreen"
        component={ProgressCommentScreen}
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
        name="PersonalChallengeDetailScreen"
        component={PersonalChallengeDetailScreen}
        options={({ navigation }) => ({
          headerTitle: () => "",
          headerLeft: () => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
      <NotificationsStack.Screen
        name="PersonalCoachChallengeDetailScreen"
        component={PersonalCoachChallengeDetailScreen}
        options={({ navigation }) => ({
          headerTitle: () => "",
          headerLeft: () => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />

      <NotificationsStack.Screen
        name="CompanyChallengeDetailScreen"
        component={CompanyChallengeDetailScreen}
        options={({ navigation }) => ({
          headerTitle: () => "",
          headerLeft: () => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
    </NotificationsStack.Navigator>
  );
};

export default NotificationsScreen;
