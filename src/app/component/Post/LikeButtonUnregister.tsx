import React from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { clsx } from "clsx";

import ThumbUp from "./asset/thumb_up.svg";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/navigation.type";
import { useTranslation } from "react-i18next";

const LikeButtonUnregister = () => {
  const { t } = useTranslation();
  const numberOfLikes = Math.floor(Math.random() * 100);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const navigateToLoginScreen = () => {
    navigation.goBack();
    navigation.navigate("LoginScreen");
  };

  return (
    <TouchableHighlight
      activeOpacity={0.8}
      underlayColor="#C5C8D2"
      onPress={navigateToLoginScreen}
      className="h-8 rounded-md px-2"
    >
      <View
        className={clsx("flex-1 flex-row items-center justify-center gap-2")}
      >
        <ThumbUp />
        <Text className={clsx("text-md font-normal text-gray-dark ")}>
          {t("likeWithCount", { count: numberOfLikes })}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default LikeButtonUnregister;
