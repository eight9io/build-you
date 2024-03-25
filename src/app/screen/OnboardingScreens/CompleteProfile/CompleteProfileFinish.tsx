import { FC, useEffect } from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { CommonActions } from "@react-navigation/native";
import { CompleteProfileScreenNavigationProp } from "./CompleteProfile";

import BuildYouLogo from "../../../common/svg/buildYou_logo.svg";
import StarLogo from "../../../common/svg/auto_awesome.svg";
import { useNav } from "../../../hooks/useNav";

interface CompleteProfileFinishProps {
  navigation: CompleteProfileScreenNavigationProp;
}

const CompleteProfileFinish: FC<CompleteProfileFinishProps> = () => {
  const { t } = useTranslation();
  const navigation = useNav();

  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "HomeScreen" }],
        })
      );
    }, 3000);
  }, []);

  return (
    <View
      className="mt-28 flex h-full flex-col items-center"
      testID="onboarding_complete_screen"
    >
      <View className="ml-3">
        <BuildYouLogo />
      </View>
      <View className="flex flex-col items-center justify-center pt-32">
        <StarLogo />

        <View>
          <Text className="mx-12 pt-4 text-center text-md font-normal text-gray-dark">
            {t("form_onboarding.finished_screen.title") ||
              "Thank you for your information. We're personalizing your experience..."}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CompleteProfileFinish;
