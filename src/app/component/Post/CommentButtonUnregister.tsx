import React from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { clsx } from "clsx";

import CommentSvg from "./asset/comment.svg";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/navigation.type";
import { useTranslation } from "react-i18next";

const CommentButtonUnregister = () => {
  const { t } = useTranslation();
  const numberOfComments = Math.floor(Math.random() * 100);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const navigateToLoginScreen = () => {
    navigation.goBack();
    navigation.navigate("LoginScreen");
  };
  return (
    <TouchableHighlight
      activeOpacity={0.8}
      underlayColor="#C5C8D2"
      className="ml-2 h-8 rounded-md px-2"
      onPress={navigateToLoginScreen}
    >
      <View
        className={clsx("flex-1 flex-row items-center justify-center gap-2")}
      >
        <CommentSvg />
        <Text className={clsx("text-md font-normal text-gray-dark ")}>
          {t("commentWithCount", { count: numberOfComments })}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default CommentButtonUnregister;
