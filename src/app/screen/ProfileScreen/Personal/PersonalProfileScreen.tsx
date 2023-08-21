import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";

import { useUserProfileStore } from "../../../store/user-store";

import { RootStackParamList } from "../../../navigation/navigation.type";

import ProfileComponent from "../../../component/Profile/ProfileComponent";
import AppTitle from "../../../component/common/AppTitle";
import ButtonWithIcon from "../../../component/common/Buttons/ButtonWithIcon";
import NavButton from "../../../component/common/Buttons/NavButton";
import OtherUserProfileScreen from "../OtherUser/OtherUserProfileScreen";
import OtherUserProfileChallengeDetailsScreen from "../OtherUser/OtherUserProfileChallengeDetailsScreen";

const ProfileStack = createNativeStackNavigator<RootStackParamList>();

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProfileScreen"
>;

interface IProfileProps {
  navigation: ProfileScreenNavigationProp;
}

const Profile: React.FC<IProfileProps> = ({ route, navigation }: any) => {
  const { getUserProfile } = useUserProfileStore();

  const userData = getUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <SafeAreaView className="justify-content: space-between h-full w-full flex-1 bg-gray-50 ">
      {isLoading && <Spinner visible={isLoading} />}

      <View className="h-full ">
        <ProfileComponent
          userData={userData}
          navigation={navigation}
          setIsLoading={setIsLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const PersonalProfileScreen = () => {
  const { t } = useTranslation();
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerShown: true,
      }}
    >
      <ProfileStack.Screen
        name="ProfileScreen"
        component={Profile}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <AppTitle title={t("profile_title")} />,
          headerRight: (props) => (
            <ButtonWithIcon
              icon="setting"
              onPress={() => navigation.push("SettingsScreenRoot")}
              testID="settings_btn"
            />
          ),
        })}
      />
      <ProfileStack.Screen
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
      <ProfileStack.Screen
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
    </ProfileStack.Navigator>
  );
};

export default PersonalProfileScreen;
