import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RootStackParamList } from "../../navigation/navigation.type";
import { useCreateChallengeDataStore } from "../../store/create-challenge-data-store";

const RenderPackageOptions = ({
  name,
  description,
  benefits,
  price,
  onPress,
}) => {
  const { t } = useTranslation();
  return (
    <View
      className="flex flex-col items-start justify-start rounded-2xl bg-slate-50 pb-4"
      style={{
        height: 280,
        width: 300,
      }}
    >
      <View className="flex w-full items-center justify-center rounded-tl-3xl border-b border-slate-200 py-3">
        <Text className="text-md font-semibold leading-tight text-black-default">
          {name}
        </Text>
      </View>
      <View className="flex w-full flex-col items-center justify-center gap-y-2">
        <Text className="px-2 pt-3 text-center text-md font-normal leading-none text-zinc-500">
          {description}
        </Text>
        <View className="flex flex-col items-center justify-start">
          <Text className="text-center text-md font-semibold leading-tight text-orange-500">
            {benefits}
          </Text>
          <View className="flex flex-col items-center justify-start space-y-2 py-2">
            {[
              t("cart_screen.intake"),
              t("cart_screen.check"),
              t("cart_screen.closing"),
            ].map((item) => (
              <Text
                className="text-center text-sm font-semibold leading-none text-neutral-700"
                key={item}
              >
                {item}
              </Text>
            ))}
            <View className="w-[164px] border border-neutral-300"></View>
          </View>
          <Text className="text-center text-base font-semibold leading-snug text-orange-500">
            {price} $
          </Text>
        </View>
        <TouchableOpacity
          className="flex items-center justify-center rounded-[36px] border border-orange-500 bg-orange-500 px-4"
          style={{
            height: 34,
            width: 268,
          }}
          onPress={onPress}
        >
          <Text className="text-center text-[14px] font-semibold leading-tight text-white">
            Choose
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ChoosePackageScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const { setCreateChallengeDataStore, getCreateChallengeDataStore } =
    useCreateChallengeDataStore();

  const handleChoosePackage = (typeOfPackage: "basic" | "premium") => {
    setCreateChallengeDataStore({
      ...getCreateChallengeDataStore(),
      package: typeOfPackage,
    });
    if (typeOfPackage === "basic") {
      navigation.navigate("CartScreen", {
        initialPrice: "90.00",
        typeOfPackage: "basic",
      });
    } else {
      navigation.navigate("CartScreen", {
        initialPrice: "190.00",
        typeOfPackage: "premium",
      });
    }
  };

  return (
    <SafeAreaView className="flex flex-1 flex-col items-center justify-start space-y-4 bg-white ">
      <ScrollView>
        <View className="flex flex-1 flex-col items-center justify-start space-y-4 ">
          <Text className="pt-4 text-md font-semibold leading-tight text-primary-default">
            {t("choose_packages_screen.title")}
          </Text>
          <Text className="px-12  text-center text-md font-normal leading-none text-zinc-800 opacity-90">
            {t("choose_packages_screen.description")}
          </Text>
          <View className=" flex flex-col">
            <RenderPackageOptions
              name={t("choose_packages_screen.basic_package")}
              description={t(
                "choose_packages_screen.basic_package_description"
              )}
              benefits={t("choose_packages_screen.direct_chat")}
              price={"90.00"}
              onPress={() => handleChoosePackage("basic")}
            />
            <View className="h-4"></View>
            <RenderPackageOptions
              name={t("choose_packages_screen.premium_package")}
              description={t(
                "choose_packages_screen.premium_package_description"
              )}
              benefits={t("choose_packages_screen.direct_chat")}
              price={"190.00"}
              onPress={() => handleChoosePackage("premium")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChoosePackageScreen;
