import { SafeAreaView, ScrollView, Text, View } from "react-native";
import React, { Component } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useUserProfileStore } from "../../store/user-store";
import Button from "../../component/common/Buttons/Button";

export default function PersonalInformationScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();

  const userData = getUserProfile();
  return (
    <SafeAreaView className="justify-content: space-between flex-1 bg-white px-4 pt-3">
      <ScrollView>
        <View className={clsx("px-4 py-4")}>
          <Text className={clsx("text-h4 font-medium")}>
            {t("personal_information.description")}
          </Text>
        </View>
        <View className="flex-column flex flex-wrap gap-3 pt-[20px] px-4 ">
          {userData?.name && (
            <View className="flex flex-row flex-wrap gap-1">
              <Text
                className={clsx(
                  "w-[30%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("personal_profile.name")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.name}
              </Text>
            </View>
          )}
          {userData?.surname && (
            <View className="flex flex-row flex-wrap gap-1">
              <Text
                className={clsx(
                  "w-[30%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("personal_profile.surname")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.surname}
              </Text>
            </View>
          )}
          {userData?.birth && (
            <View className="flex flex-row flex-wrap gap-1">
              <Text
                className={clsx(
                  "w-[30%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("personal_profile.birthday")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.birth}
              </Text>
            </View>
          )}
          {userData?.email && (
            <View className="flex flex-row flex-wrap gap-1">
              <Text
                className={clsx(
                  "w-[30%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("personal_profile.email")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.email}
              </Text>
            </View>
          )}
          {userData?.occupation && (
            <View className="flex flex-row flex-wrap gap-1">
              <Text
                className={clsx(
                  "w-[30%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("form_onboarding.screen_1.occupation")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.occupation.name}
              </Text>
            </View>
          )}
        </View>
        <View className="px-5 py-10">
          <Button
            title={t("personal_information.delete_account")}
            containerClassName="bg-gray-medium flex-1"
            textClassName="text-white text-md leading-6"
            onPress={() => navigation.navigate("DeleteAccountScreen")}
          />

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
