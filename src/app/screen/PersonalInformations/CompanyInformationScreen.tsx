import { SafeAreaView, ScrollView, Text, View } from "react-native";
import React from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useUserProfileStore } from "../../store/user-store";

export default function CompanyInformationScreen({ navigation }: any) {
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
        <View className="flex-column flex flex-wrap gap-5 px-4 pt-[20px] ">
          {userData?.name && (
            <Text className="flex w-full flex-row flex-wrap pr-[30px]">
              <Text
                className={clsx(
                  "w-[24%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("personal_profile.name")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.name}
              </Text>
            </Text>
          )}
          {userData?.webSite && (
            <View className="flex w-full flex-row flex-wrap pr-[30px]">
              <Text
                className={clsx(
                  "w-[24%]  text-md font-semibold  text-gray-dark"
                )}
              >
                {t("company_profile.website")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.webSite}
              </Text>
            </View>
          )}
          {userData?.phone && (
            <View className="flex w-full flex-row  flex-wrap">
              <Text
                className={clsx(
                  "w-[24%]  text-md font-semibold  text-gray-dark"
                )}
              >
                {t("company_profile.phone")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.phone}
              </Text>
            </View>
          )}
          {userData?.emailContact && (
            <View className="flex w-full flex-row  flex-wrap">
              <Text
                className={clsx(
                  "w-[24%]  text-md font-semibold  text-gray-dark"
                )}
              >
                {t("company_profile.email")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.emailContact}
              </Text>
            </View>
          )}
          {userData?.pIva && (
            <View className="flex w-full flex-row  flex-wrap">
              <Text
                className={clsx(
                  "w-[24%]  text-md font-semibold  text-gray-dark"
                )}
              >
                {t("company_profile.VAT_number")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userData?.pIva}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
