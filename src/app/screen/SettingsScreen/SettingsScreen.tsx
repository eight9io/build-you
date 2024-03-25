import React, { useState } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { CommonActions } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";

import { RootStackParamList } from "../../navigation/navigation.type";

import { useUserProfileStore } from "../../store/user-store";
import { useAuthStore } from "../../store/auth-store";
import { setLastNotiIdToLocalStorage } from "../../utils/notification.util";

import Settings from "../../component/Settings";
import AppTitle from "../../component/common/AppTitle";
import Button from "../../component/common/Buttons/Button";
import NavButton from "../../component/common/Buttons/NavButton";
import ConfirmDialog from "../../component/common/Dialog/ConfirmDialog/ConfirmDialog";
import DeleteAccountScreen from "../PersonalInformations/DeleteAccountScreen";
import TermsOfServicesScreen from "../PersonalInformations/TermsOfServicesScreen";
import PrivacyPolicyScreen from "../PersonalInformations/PrivacyPolicyScreen";
import CompanyInformationScreen from "../PersonalInformations/CompanyInformationScreen";
import { CrashlyticService } from "../../service/crashlytic";
import PersonalInformationScreen from "../PersonalInformations/PersonalInformationScreen/PersonalInformationScreen";
import useGoogleLogin from "../../hooks/useGoogleLogin";

const SettingStack = createNativeStackNavigator<RootStackParamList>();
interface INavBarInnerScreenProps {
  navigation: SetingsScreenNavigationProp;
}

export type SetingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SettingsScreen"
>;

const Setting: React.FC<INavBarInnerScreenProps> = ({ navigation }) => {
  const [isShowLogoutModal, setIsShowLogoutModal] = useState<boolean>(false);
  const { logout } = useAuthStore();
  const { onLogout: userProfileStoreOnLogout, getUserProfile } =
    useUserProfileStore();
  const { signOut } = useGoogleLogin({});

  const currentUser = getUserProfile();

  const { t } = useTranslation();

  const handleLogout = async () => {
    setIsShowLogoutModal(false);
    const userLoginType = currentUser?.loginType;
    // await unregisterForPushNotificationsAsync()
    //   .then((token) => {
    //     updateNotificationToken({
    //       notificationToken: token,
    //       status: NOTIFICATION_TOKEN_STATUS.INACTIVE,
    //       deviceType:
    //         Platform.OS === "android"
    //           ? NOTIFICATION_TOKEN_DEVICE_TYPE.ANDROID
    //           : NOTIFICATION_TOKEN_DEVICE_TYPE.IOS,
    //     });
    //   })
    //   .catch(() => {
    //     console.log("Ignore Push Notification");
    //   });

    setTimeout(async () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "IntroScreen" }],
        })
      );
      setLastNotiIdToLocalStorage("");
      logout();
      if (userLoginType === "google") {
        const googleSignOut = async () => {
          try {
            await signOut();
          } catch (error) {
            console.error(error);
            CrashlyticService({
              errorType: "Google Sign Out Error",
              error: error,
            });
          }
        };
        googleSignOut();
      }

      userProfileStoreOnLogout();
    }, 500);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-veryLight">
      <ConfirmDialog
        isVisible={isShowLogoutModal}
        onConfirm={handleLogout}
        onClosed={() => setIsShowLogoutModal(false)}
        title={t("dialog.logout.title") as string}
        confirmButtonLabel={`${t("dialog.logout.title")}`}
        confirmButtonColor="#FF4949"
        closeButtonLabel={`${t("dialog.logout.cancel")}`}
        description={t("dialog.logout.description") as string}
        confirmButtonTestID="logout_confirm_btn"
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex flex-1 flex-col bg-gray-veryLight">
          <Settings navigation={navigation} />
        </View>
        <View className="mb-6 flex h-12 justify-end px-4">
          <Button
            title={t("user_settings_screen.logout")}
            containerClassName="bg-gray-medium flex-1"
            textClassName="text-white text-md leading-6"
            onPress={() => setIsShowLogoutModal(true)}
            testID="logout_btn"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const SettingsScreen = () => {
  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const isCompany = currentUser && currentUser?.companyAccount;
  return (
    <SettingStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        headerBackVisible: false,
      }}
    >
      <SettingStack.Screen
        name="SettingsScreen"
        component={Setting}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => (
            <AppTitle title={t("user_settings_screen.title")} />
          ),
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
      <SettingStack.Screen
        name="PersonalInformationScreen"
        component={
          isCompany ? CompanyInformationScreen : PersonalInformationScreen
        }
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => (
            <AppTitle
              title={
                isCompany
                  ? t(
                      "user_settings_screen.account_settings_sections.company_information"
                    )
                  : t("personal_information.title")
              }
            />
          ),
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
      <SettingStack.Screen
        name="TermsOfServicesScreen"
        component={TermsOfServicesScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => (
            <AppTitle
              title={t(
                "user_settings_screen.account_settings_sections.terms_of_services"
              )}
            />
          ),
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
      <SettingStack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => (
            <AppTitle
              title={t(
                "user_settings_screen.account_settings_sections.privacy_policy"
              )}
            />
          ),
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
      <SettingStack.Screen
        name="DeleteAccountScreen"
        component={DeleteAccountScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <AppTitle title={t("delete_account.title")} />,
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
    </SettingStack.Navigator>
  );
};
export default SettingsScreen;
