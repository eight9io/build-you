import React from "react";
import { useTranslation } from "react-i18next";
import { Text, SafeAreaView } from "react-native";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex items-center justify-center">
      <Text>{t("not_found") || "Not found"}</Text>
    </SafeAreaView>
  );
};

export default NotFound;
