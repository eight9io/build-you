import { SafeAreaView, ScrollView, Text, View } from "react-native";
import React, { Component } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import AccorditionItem from "../../component/common/Accordition/AccorditionItem";

export default function PersonalInformationScreen({ navigation }: any) {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="justify-content: space-between flex-1 bg-white px-4 pt-3">
      <ScrollView>
        <View className={clsx("px-4 py-4")}>
          <Text className={clsx("text-h4 font-medium")}>
            {t("personal_information.description")}
          </Text>
        </View>
        <View className="px-4">
          <AccorditionItem title={t("lorem1111")} />
          <AccorditionItem title={t("lorem1111")} />
          <AccorditionItem title={t("lorem1111")} />
          <AccorditionItem
            title={t("personal_information.delete_account")}
            onPress={() => navigation.navigate("DeleteAccountScreen")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
