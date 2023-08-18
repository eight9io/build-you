import React from "react";
import { View, Text, SafeAreaView } from "react-native";

import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/navigation.type";

import StepOfSteps from "../../../component/common/StepofSteps";
import Button from "../../../component/common/Buttons/Button";

import CompleteProfileStep1 from "./CompleteProfileStep1";
import CompleteProfileStep2 from "./CompleteProfileStep2";
import CompleteProfileStep3 from "./CompleteProfileStep3";
import CompleteProfileStep4 from "./CompleteProfileStep4";
import CompleteProfileFinish from "./CompleteProfileFinish";
import Header from "../../../component/common/Header";
import AppTitle from "../../../component/common/AppTitle";
import NavButton from "../../../component/common/Buttons/NavButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuthStore } from "../../../store/auth-store";
import { useTranslation } from "react-i18next";
import { CommonActions } from "@react-navigation/native";
import { useUserProfileStore } from "../../../store/user-store";
import { setLastNotiIdToLocalStorage } from "../../../utils/notification.util";
import { useCompleteProfileStore } from "../../../store/complete-user-profile";

const CompleteProfileStack = createNativeStackNavigator<RootStackParamList>();

export type CompleteProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CompleteProfileScreen"
>;

interface ICompleteProfileProps {
  component: any;
}

const CompleteProfile: React.FC<ICompleteProfileProps> = ({ component }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
        {component && component()}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const CompleteProfileScreen1 = ({
  navigation,
}: {
  navigation: CompleteProfileScreenNavigationProp;
}) => {
  return (
    <CompleteProfile
      component={() => <CompleteProfileStep1 navigation={navigation} />}
    />
  );
};

const CompleteProfileScreen2 = ({
  navigation,
}: {
  navigation: CompleteProfileScreenNavigationProp;
}) => {
  return (
    <CompleteProfile
      component={() => <CompleteProfileStep2 navigation={navigation} />}
    />
  );
};

const CompleteProfileScreen3 = ({
  navigation,
}: {
  navigation: CompleteProfileScreenNavigationProp;
}) => {
  return (
    <CompleteProfile
      component={() => <CompleteProfileStep3 navigation={navigation} />}
    />
  );
};

const CompleteProfileScreen4 = ({
  navigation,
}: {
  navigation: CompleteProfileScreenNavigationProp;
}) => {
  return <CompleteProfileStep4 navigation={navigation} />;
};

const CompleteProfileFinishScreen = ({
  navigation,
}: {
  navigation: CompleteProfileScreenNavigationProp;
}) => {
  return (
    <CompleteProfile
      component={() => <CompleteProfileFinish navigation={navigation} />}
    />
  );
};

const CompleteProfileScreen = () => {
  const { logout } = useAuthStore();
  const { t } = useTranslation();

  const { onLogout: userProfileStoreOnLogout } = useUserProfileStore();
  const { setBiography, setVideo } = useCompleteProfileStore();

  return (
    <CompleteProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <CompleteProfileStack.Screen
        name="CompleteProfileStep1Screen"
        component={CompleteProfileScreen1}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <AppTitle title="Complete profile" />,
          headerLeft: (props) => (
            <NavButton
              text="Logout"
              withBackIcon={true}
              onPress={() => {
                setTimeout(() => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: "IntroScreen" }],
                    })
                  );
                  setLastNotiIdToLocalStorage("");
                  logout();
                  userProfileStoreOnLogout();
                }, 500);
              }}
            />
          ),
        })}
      />
      <CompleteProfileStack.Screen
        name="CompleteProfileStep2Screen"
        component={CompleteProfileScreen2}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <AppTitle title="Complete profile" />,

          headerLeft: (props) => (
            <NavButton
              testID="complete_profile_step_2_back_button"
              text={t("button.back") || "Back"}
              withBackIcon={true}
              onPress={() => navigation.navigate("CompleteProfileStep1Screen")}
            />
          ),

          headerRight: (props) => (
            <NavButton
              testID="complete_profile_step_2_skip_button"
              text={t("button.skip") || "Skip"}
              withIcon={false}
              onPress={() => {
                setVideo("");
                setBiography("");
                navigation.navigate("CompleteProfileStep3Screen");
              }}
            />
          ),
        })}
      />
      <CompleteProfileStack.Screen
        name="CompleteProfileStep3Screen"
        component={CompleteProfileScreen3}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <AppTitle title="Complete profile" />,

          headerLeft: (props) => (
            <NavButton
              testID="complete_profile_step_3_back_button"
              text={t("button.back") || "Back"}
              withBackIcon={true}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
      <CompleteProfileStack.Screen
        name="CompleteProfileStep4Screen"
        component={CompleteProfileScreen4}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <AppTitle title="Complete profile" />,

          headerLeft: (props) => (
            <NavButton
              testID="complete_profile_step_4_back_button"
              text={t("button.back") || "Back"}
              withBackIcon={true}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
      <CompleteProfileStack.Screen
        name="CompleteProfileFinishScreen"
        component={CompleteProfileFinishScreen}
      />
    </CompleteProfileStack.Navigator>
  );
};

export default CompleteProfileScreen;
