import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";

import { RootStackParamList } from "../../../navigation/navigation.type";

import CompanyComponent from "../../../component/Profile/Company/CompanyProfileComponent";
import AppTitle from "../../../component/common/AppTitle";
import ButtonWithIcon from "../../../component/common/Buttons/ButtonWithIcon";
import { useIsFocused } from "@react-navigation/native";
import { serviceGetMyProfile } from "../../../service/auth";
import { useUserProfileStore } from "../../../store/user-data";
import OtherUserProfileScreen from "../OtherUser/OtherUserProfileScreen";
import NavButton from "../../../component/common/Buttons/NavButton";
import OtherUserProfileChallengeDetailsScreen from "../OtherUser/OtherUserProfileChallengeDetailsScreen";
import Button from "../../../component/common/Buttons/Button";

import ShareIcon from "../../../../../assets/svg/share.svg";

const CompanyStack = createNativeStackNavigator<RootStackParamList>();

type CompanyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CompanyProfileScreen"
>;

interface ICompanyProps {
  navigation: CompanyScreenNavigationProp;
}

const Company: React.FC<ICompanyProps> = ({ navigation }) => {
  const [shouldNotLoadOnFirstFocus, setShouldNotLoadOnFirstFocus] =
    useState<boolean>(true);

  const isFocused = useIsFocused();
  const { setUserProfile, getUserProfile } = useUserProfileStore();
  useEffect(() => {
    if (!isFocused) return;
    if (shouldNotLoadOnFirstFocus) {
      setShouldNotLoadOnFirstFocus(false);
      return;
    }
    serviceGetMyProfile()
      .then((res) => {
        setUserProfile(res.data);
      })
      .catch((err) => {
        console.error("err", err);
      });
  }, [isFocused]);
  const userData = getUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <SafeAreaView className="justify-content: space-between h-full flex-1 bg-gray-50">
      {isLoading && <Spinner visible={isLoading} />}
      <View className="h-full ">
        <CompanyComponent
          userData={userData}
          navigation={navigation}
          setIsLoading={setIsLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const CompanyProfileScreen = () => {
  const { t } = useTranslation();

  return (
    <CompanyStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerShown: true,
      }}
    >
      <CompanyStack.Screen
        name="CompanyProfileScreen"
        component={Company}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <AppTitle title={t("profile_title")} />,
          headerRight: (props) => (
            <ButtonWithIcon
              icon="setting"
              onPress={() => navigation.push("SettingsScreenRoot")}
            />
          ),
        })}
      />
      <CompanyStack.Screen
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
      <CompanyStack.Screen
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
    </CompanyStack.Navigator>
  );
};

export default CompanyProfileScreen;
