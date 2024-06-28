import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { RootStackParamList } from "../../navigation/navigation.type";
import { IPackage } from "../../types/package";

import { usePriceStore } from "../../store/price-store";
import { useUserProfileStore } from "../../store/user-store";
import { useCreateChallengeDataStore } from "../../store/create-challenge-data-store";
import { getTranslatedBasicPackages } from "../../utils/purchase.util";
import GlobalDialogController from "../../component/common/Dialog/GlobalDialog/GlobalDialogController";
import { getBasicPackages } from "../../service/purchase";

function convertPhrases(phrase) {
  if (phrase === "videocall" || phrase === "video") {
    // These two types is issued from the backend, so we need to handle both cases
    return "Video call";
  } else if (phrase === "chat") {
    return "Direct chat";
  } else {
    return phrase;
  }
}

const RenderPackageOptions = ({
  name,
  type,
  caption,
  price,
  currency,
  onPress,
  isCurrentUserCompany = false,
}) => {
  const { t } = useTranslation();

  return (
    <View
      className="mt-4 flex flex-col items-start justify-start rounded-2xl bg-slate-50 pb-4"
      style={{
        width: 300,
      }}
    >
      <View className="flex w-full items-center justify-center rounded-tl-3xl border-b border-slate-200 py-3">
        <Text className="text-md font-semibold uppercase leading-tight text-black-default">
          {name}
        </Text>
      </View>
      <View className="flex w-full flex-col items-center justify-center gap-y-2">
        <Text className="px-2 pt-3 text-center text-md font-normal leading-none text-zinc-500">
          {caption}
        </Text>
        <View className="flex flex-col items-center justify-start">
          <Text className="text-center text-md font-semibold leading-tight text-orange-500">
            {convertPhrases(type)}
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
            {!isCurrentUserCompany ? (
              <View className="w-[164px] border border-neutral-300" />
            ) : null}
          </View>
          {!isCurrentUserCompany ? (
            <Text className="text-center text-base font-semibold leading-snug text-orange-500">
              {price}
            </Text>
          ) : null}
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
            {t("choose_packages_screen.choose")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ChoosePackageScreen = () => {
  // const [{ packages, chatCheck, videoCheck, loading }, _setState] = useState<{
  //   packages: IPackage[];
  //   chatCheck: ICheckPoint;
  //   videoCheck: ICheckPoint;
  //   loading: boolean;
  // }>({
  //   packages: [],
  //   chatCheck: {
  //     price: 0,
  //     currency: "USD",
  //   },
  //   videoCheck: {
  //     price: 0,
  //     currency: "USD",
  //   },
  //   loading: true,
  // });
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [
    { translatedChatPackage, translatedVideoPackage },
    setTranslatedPackages,
  ] = useState<{
    translatedChatPackage: IPackage;
    translatedVideoPackage: IPackage;
  }>({
    translatedChatPackage: null,
    translatedVideoPackage: null,
  });

  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const isCurrentUserCompany = currentUser?.companyAccount;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { setCreateChallengeDataStore, getCreateChallengeDataStore } =
    useCreateChallengeDataStore();

  const { setChatPackagePrice, setVideoPackagePrice } = usePriceStore();
  const maxPeopleData= getCreateChallengeDataStore().maximumPeople
  const handleChoosePackage = (choosenPackage: IPackage) => {
    const packageData = {
      name: choosenPackage.name,
      price: choosenPackage.price,
      currency: choosenPackage.currency,
      id:
        choosenPackage.type === "chat"
          ? translatedChatPackage.id
          : translatedVideoPackage.id,
      type: choosenPackage.type,
      maxPeoplePackages:      choosenPackage.type === "chat" ? 5: 10,
    };
    setCreateChallengeDataStore({
      ...getCreateChallengeDataStore(),
      package: packageData.id,
    });
    if (maxPeopleData > packageData.maxPeoplePackages) {

      GlobalDialogController.showModal({
        title: t("dialog.err_maxPeople.title"),
        message: t("dialog.err_maxPeople.description",{max_people:packageData.maxPeoplePackages}),
      });
      return;
    }
    if (isCurrentUserCompany) {
      navigation.navigate("CompanyCartScreen", {
        choosenPackage: choosenPackage,
      });
    } else {
      navigation.navigate("CartScreen", {
        choosenPackage: choosenPackage,
      });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { chatPackage, videoPackage } = await getTranslatedBasicPackages();
      setTranslatedPackages({
        translatedChatPackage: chatPackage,
        translatedVideoPackage: videoPackage,
      });
      try {
        // This api call not return translated package name and caption so we need to use the translated package name and caption from getTranslatedBasicPackages
        // This data is not for company user (company user will use the package from getTranslatedBasicPackages)
        const { data } = await getBasicPackages();

        if (isCurrentUserCompany) setPackages([chatPackage, videoPackage]);
        else
          setPackages(
            data.map((item) => {
              return {
                ...item,
        
                name:
                  item.type === "chat" ? chatPackage.name : videoPackage.name,
                caption:
                  item.type === "chat"
                    ? chatPackage.caption
                    : videoPackage.caption
               
              };
            })
          );
      } catch (error) {
        if (error.response)
          console.error("Fetch package error", error.response);
        else console.error("Fetch package error", error);
        GlobalDialogController.showModal({
          title: t("dialog.err_title"),
          message: t("errorMessage:500"),
        });
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <SafeAreaView className="flex flex-1 flex-col items-center justify-start space-y-4 bg-white ">
      <ScrollView>
        <View className="mb-10 flex flex-col items-center justify-start space-y-4">
          <Text className="pt-4 text-md font-semibold leading-tight text-primary-default">
            {t("choose_packages_screen.title")}
          </Text>
          <Text className="px-12  text-center text-md font-normal leading-none text-zinc-800 opacity-90">
            {t("choose_packages_screen.description")}
          </Text>
          <View className=" flex flex-col">
            {packages.length > 0 &&
              packages.map((item) => (
                <View key={item?.type}>
                  <RenderPackageOptions
                    name={item.name}
                    type={item.type}
                    caption={item.caption}
                    price={item.formattedPrice}
                    currency={item.currency}
                    onPress={() => handleChoosePackage(item)}
                    isCurrentUserCompany={isCurrentUserCompany}
                  />
                </View>
              ))}
            {packages.length === 0 && loading ? <ActivityIndicator /> : null}
            {packages.length === 0 && !loading ? (
              <View className="flex items-center justify-center">
                <Text className="text-center text-md font-semibold leading-tight text-primary-default">
                  {t("choose_packages_screen.no_package")}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChoosePackageScreen;
