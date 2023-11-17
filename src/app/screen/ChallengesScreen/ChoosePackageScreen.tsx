import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

import { RootStackParamList } from "../../navigation/navigation.type";
import { ICheckPoint, IPackage } from "../../types/package";

import { serviceGetAllPackages } from "../../service/package";
import { useUserProfileStore } from "../../store/user-store";
import { useCreateChallengeDataStore } from "../../store/create-challenge-data-store";
import { getLanguageLocalStorage } from "../../utils/language";
import {
  getCurrencySymbol,
  getProductsFromStoreToDisplay,
} from "../../utils/purchase.util";
import GlobalDialogController from "../../component/common/Dialog/GlobalDialogController";

interface ITypeOfPackage {
  id: string;
  name: string;
  price: number;
}

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
  const [packages, setPackages] = useState<IPackage[]>([] as IPackage[]);
  const [chatCheck, setChatCheck] = useState<ICheckPoint>({
    price: 0,
    currency: "USD",
  });
  const [videoCheck, setVideoCheck] = useState<ICheckPoint>({
    price: 0,
    currency: "USD",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const isCurrentUserCompany = currentUser?.companyAccount;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { setCreateChallengeDataStore, getCreateChallengeDataStore } =
    useCreateChallengeDataStore();

  const handleChoosePackage = (choosenPackage: IPackage) => {
    const packageData = {
      name: choosenPackage.name,
      price: choosenPackage.price,
      currency: choosenPackage.currency,
      id: choosenPackage.id,
      type: choosenPackage.type,
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
      setLoading(true);
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
        if (packagesFromStore) {
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
            };
          });
          setChatCheck({
            price: !isNaN(Number(packagesFromStore.chatCheck.price))
              ? Number(packagesFromStore.chatCheck.price)
              : 0,
            currency: packagesFromStore.chatCheck.currency,
          });
          setVideoCheck({
            price: !isNaN(Number(packagesFromStore.videoCheck.price))
              ? Number(packagesFromStore.videoCheck.price)
              : 0,
            currency: packagesFromStore.videoCheck.currency,
          });
        } else {
          sortedPackages = sortedPackages.map((item) => {
            return {
              ...item,
              price: 0,
              currency: "USD",
            };
          });
        }

        setPackages(sortedPackages);
      } catch (error) {
        console.error("Fetch package error", error);
        GlobalDialogController.showModal({
          title: t("dialog.err_title"),
          message: t("errorMessage:500") as string,
        });
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };
    fetchPackages();
  }, []);

  return (
    <SafeAreaView className="flex flex-1 flex-col items-center justify-start space-y-4 bg-white ">
      <ScrollView>
        {loading && <Spinner visible={loading} />}
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
                    price={item.price}
                    currency={item.currency}
                    onPress={() => handleChoosePackage(item)}
                    isCurrentUserCompany={isCurrentUserCompany}
                  />
                </View>
              ))}
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
