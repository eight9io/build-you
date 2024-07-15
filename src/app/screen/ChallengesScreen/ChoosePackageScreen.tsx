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
import { ICheckPoint, IPackage } from "../../types/package";

import { usePriceStore } from "../../store/price-store";
import { serviceGetAllPackages } from "../../service/package";
import { useUserProfileStore } from "../../store/user-store";
import { useCreateChallengeDataStore } from "../../store/create-challenge-data-store";
import { getLanguageLocalStorage } from "../../utils/language";
import {
  getCurrencySymbol,
  getProductsFromStoreToDisplay,
} from "../../utils/purchase.util";
import GlobalDialogController from "../../component/common/Dialog/GlobalDialogController";

function convertPhrases(phrase) {
  if (phrase === "videocall") {
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
  maxPeopleData,
  maxPeople,
    availableCredits=false,
  messErrCredits=''
}) => {
  const { t } = useTranslation();
  const [errMaximumPeople, setErrMaximumPeople] = useState("");
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
            {!isCurrentUserCompany && (
              <View className="w-[164px] border border-neutral-300" />
            )}
          </View>
          {!isCurrentUserCompany && (
            <Text className="text-center text-base font-semibold leading-snug text-orange-500">
              {`${getCurrencySymbol(currency)}${price.toFixed(2)}`}
            </Text>
          )}
        </View>
       {!availableCredits &&   <TouchableOpacity
          className="flex items-center justify-center rounded-[36px] border border-orange-500 bg-orange-500 px-4"
          style={{
            height: 34,
            width: 268,
          }}
          onPress={() => {
            if(availableCredits){
              return;
            }
            if (maxPeopleData > maxPeople) {
              return setErrMaximumPeople(
                t("dialog.err_maxPeople.description", {
                  maxPeople,
                })
              );
            }
            onPress();
          }}
          disabled={availableCredits}
        >
          <Text className="text-center text-[14px] font-semibold leading-tight text-white">
            {t("choose_packages_screen.choose")}
          </Text>
        </TouchableOpacity>}
        {maxPeopleData > maxPeople && errMaximumPeople && (
          <Text className="w-full px-2 text-center text-red-400">
            {errMaximumPeople}
          </Text>
        )}
          {availableCredits   && <Text className=" px-3 mb-4 text-md font-semibold text-center text-red-500">{messErrCredits}</Text>}
      </View>
    </View>
  );
};

const ChoosePackageScreen = () => {
  const [{ packages, chatCheck, videoCheck, loading }, _setState] = useState<{
    packages: IPackage[];
    chatCheck: ICheckPoint;
    videoCheck: ICheckPoint;
    loading: boolean;
  }>({
    packages: [],
    chatCheck: {
      price: 0,
      currency: "USD",
    },
    videoCheck: {
      price: 0,
      currency: "USD",
    },
    loading: true,
  });

  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const isCurrentUserCompany = currentUser?.companyAccount;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { setCreateChallengeDataStore, getCreateChallengeDataStore } =
    useCreateChallengeDataStore();
  const maxPeopleData = getCreateChallengeDataStore().maximumPeople;

  const { setChatPackagePrice, setVideoPackagePrice } = usePriceStore();

  const handleChoosePackage = (choosenPackage: IPackage) => {
    const packageData = {
      name: choosenPackage.name,
      price: choosenPackage.price,
      currency: choosenPackage.currency,
      id: choosenPackage.id,
      type: choosenPackage.type,
      maxPeople: choosenPackage.maxPeople,
    };
    setCreateChallengeDataStore({
      ...getCreateChallengeDataStore(),
      package: packageData.id,
    });
    if (isCurrentUserCompany) {
      navigation.navigate("CompanyCartScreen", {
        choosenPackage: choosenPackage,
        checkPoint: choosenPackage.type === "chat" ? chatCheck : videoCheck,
      });
    } else {
      navigation.navigate("CartScreen", {
        choosenPackage: choosenPackage,
        checkPoint: choosenPackage.type === "chat" ? chatCheck : videoCheck,
      });
    }
  };

  useEffect(() => {
    const fetchPackages = async () => {
      const currentLanguage = await getLanguageLocalStorage();
      let sortedPackages = [];
      try {
        const res = await serviceGetAllPackages(currentLanguage);
        sortedPackages = res.data.packages.sort((a, b) => a.price - b.price);
      } catch (error) {
        console.error("get packages error", error);
      }

      try {
        // Get unit localized price by fetching from store
        const packagesFromStore = await getProductsFromStoreToDisplay();

        if (!packagesFromStore) {
          _setState({ packages, chatCheck, videoCheck, loading: false });

          setTimeout(() => {
            GlobalDialogController.showModal({
              title: t("dialog.err_title"),
              message: t("errorMessage:500"),
            });
          }, 300);

          return;
        }
        const chatPackagePrice = packagesFromStore.chatPackage.localizedPrice;
        const videoPackagePrice = packagesFromStore.videoPackage.localizedPrice;
        setChatPackagePrice(chatPackagePrice);
        setVideoPackagePrice(videoPackagePrice);
        sortedPackages = sortedPackages.map((item) => {
          return {
            ...item,
            price:
              item.type === "chat"
                ? packagesFromStore.chatPackage.price
                : packagesFromStore.videoPackage.price,
            currency:
              item.type === "chat"
                ? packagesFromStore.chatPackage.currency
                : packagesFromStore.videoPackage.currency,
            maxPeople: item.type === "chat" ? 10 : 5,
          };
        });

        _setState((oldState) => ({
          ...oldState,
          packages: sortedPackages,
          chatCheck: {
            price: !isNaN(Number(packagesFromStore.chatCheck.price))
              ? Number(packagesFromStore.chatCheck.price)
              : 0,
            currency: packagesFromStore.chatCheck.currency,
          },
          videoCheck: {
            price: !isNaN(Number(packagesFromStore.videoCheck.price))
              ? Number(packagesFromStore.videoCheck.price)
              : 0,
            currency: packagesFromStore.videoCheck.currency,
          },
        }));

        setTimeout(() => {
          _setState((oldState) => ({
            ...oldState,
            loading: false,
          }));
        }, 300);
      } catch (error) {
        console.error("Fetch package error", error);
        GlobalDialogController.showModal({
          title: t("dialog.err_title"),
          message: t("errorMessage:500"),
        });
      }
    };
    fetchPackages();
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
          <View className=" flex flex-col ">
            {packages.length > 0 &&
              packages.map((item) => (
                <View
                  key={item?.type}
                  className="flex w-full items-center justify-center "
                >
                  <RenderPackageOptions
                    name={item.name}
                    type={item.type}
                    caption={item.caption}
                    price={item.price}
                    currency={item.currency}
                    onPress={() => handleChoosePackage(item)}
                    isCurrentUserCompany={isCurrentUserCompany}
                    maxPeopleData={maxPeopleData}
                    maxPeople={item.maxPeople}
                    availableCredits={ item?.type=== "chat" ?  currentUser?.availableCredits <= (maxPeopleData)  : currentUser?.availableCredits <= (maxPeopleData*2) }
                    messErrCredits={t("dialog.err_credits")}
                  />
                </View>
              ))}
            {packages.length === 0 && loading && <ActivityIndicator />}
            {packages.length === 0 && !loading && (
              <View className="flex items-center justify-center">
                <Text className="text-center text-md font-semibold leading-tight text-primary-default">
                  {t("choose_packages_screen.no_package")}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChoosePackageScreen;
