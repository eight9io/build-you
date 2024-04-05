import { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
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
import GlobalDialogController from "../../component/common/Dialog/GlobalDialog/GlobalDialogController";
import SkeletonLoadingCommon from "../../component/common/SkeletonLoadings/SkeletonLoadingCommon";

import { setLastNotiIdToLocalStorage } from "../../utils/notification.util";
import ProgressCommentScreen from "../ChallengesScreen/ProgressCommentScreen/ProgressCommentScreen";
import PersonalChallengeDetailScreen from "../ChallengesScreen/PersonalChallengesScreen/PersonalChallengeDetailScreen/PersonalChallengeDetailScreen";
import PersonalCoachChallengeDetailScreen from "../ChallengesScreen/CoachChallengesScreen/PersonalCoach/PersonalCoachChallengeDetailScreen";
import CompanyChallengeDetailScreen from "../ChallengesScreen/CompanyChallengesScreen/CompanyChallengeDetailScreen/CompanyChallengeDetailScreen";
import { CrashlyticService } from "../../service/crashlytic";
import CoachCreateScheduleScreen from "../ChallengesScreen/CoachCreateScheduleScreen";
import AddNewChallengeProgressScreen from "../ChallengesScreen/AddNewChallengeProgressScreen";
import EditChallengeScreen from "../ChallengesScreen/EditChallengeScreen";
import EditChallengeProgressScreen from "../ChallengesScreen/EditChallengeProgressScreen";
import ConfirmVideoCoachScreen from "../ChallengesScreen/ConfirmVideoCoachScreen";
import CoachRateCompanyChallengeScreen from "../ChallengesScreen/CoachRateCompanyChallengeScreen";
import CoachRateChallengeScreen from "../ChallengesScreen/CoachRateChallengeScreen";
import EditScheduleLinkScreen from "../ChallengesScreen/EditScheduleLinkScreen";
import ScheduleDetailScreen from "../ChallengesScreen/ScheduleDetailScreen";
import EditScheduleScreen from "../ChallengesScreen/EditScheduleScreen";
import AddScheduleLinkScreen from "../ChallengesScreen/AddScheduleLinkScreen";
import { RefreshProvider } from "../../context/refresh.context";

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
    <RefreshProvider>
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
        <NotificationsStack.Screen
          name="AddNewChallengeProgressScreen"
          component={AddNewChallengeProgressScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <NotificationsStack.Screen
          name="EditChallengeScreen"
          component={EditChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <NotificationsStack.Screen
          name="EditChallengeProgressScreen"
          component={EditChallengeProgressScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <NotificationsStack.Screen
          name="ConfirmVideoCoachScreen"
          component={ConfirmVideoCoachScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <NotificationsStack.Screen
          name="CoachRateCompanyChallengeScreen"
          component={CoachRateCompanyChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <NotificationsStack.Screen
          name="CoachRateChallengeScreen"
          component={CoachRateChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <NotificationsStack.Screen
          name="EditScheduleLinkScreen"
          component={EditScheduleLinkScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <NotificationsStack.Screen
          name="ScheduleDetailScreen"
          component={ScheduleDetailScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <NotificationsStack.Screen
          name="CoachCreateScheduleScreen"
          component={CoachCreateScheduleScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <NotificationsStack.Screen
          name="EditScheduleScreen"
          component={EditScheduleScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <NotificationsStack.Screen
          name="AddScheduleLinkScreen"
          component={AddScheduleLinkScreen}
          options={() => ({
            headerShown: false,
          })}
        />
      </NotificationsStack.Navigator>
    </RefreshProvider>
  );
};

export default NotificationsScreen;
