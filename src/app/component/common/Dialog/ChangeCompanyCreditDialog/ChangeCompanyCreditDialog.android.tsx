import { FC, useEffect, useState } from "react";
import { View, Text, Appearance, Platform, FlatList } from "react-native";
import Dialog from "react-native-dialog";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { serviceGetAllPackages } from "../../../../service/package";
import { IPackageResponse } from "../../../../types/package";
import { getLanguageLocalStorage } from "../../../../utils/language";
import debounce from "lodash.debounce";

interface IChangeCompanyCreditDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  numberOfChecksToChargeCompanyCredit: number;
  packageToChangeCompanyCredit: "chat" | "videocall";
}

interface IRenderPackageInfoProps {
  title: string;
  avalaibleCredits: number;
  valueToCharge?: number;
  packageToCharge?: number;
  pricePerCheck?: number;
}

interface IRenderChargePackageInfoProps {
  title: string;
  creditToBeCharged: number;
  unit: "package" | "check" | "$";
}

const isAndroid = Platform.OS === "android";

const RenderPackageInfo: FC<IRenderPackageInfoProps> = ({
  title,
  avalaibleCredits,
}) => {
  return (
    <View className="flex flex-row  items-center justify-between py-1">
      <View className="w-[60%] pr-2">
        <Text className=" text-md font-semibold leading-tight text-neutral-500">
          {title}:
        </Text>
      </View>

      <View className="w-[40%]">
        <Text className="text-center text-md font-semibold leading-tight text-orange-500 ">
          {avalaibleCredits}
        </Text>
      </View>
    </View>
  );
};

const RenderChargePackageInfo: FC<IRenderChargePackageInfoProps> = ({
  title,
  creditToBeCharged,
  unit,
}) => {
  return (
    <View className="flex flex-row items-center  justify-between  py-1">
      <View className="w-[60%] pr-2">
        <Text className="text-md font-semibold leading-tight text-neutral-500">
          {title}:
        </Text>
      </View>

      <View className="w-[40%]">
        <Text className="text-center text-md font-semibold leading-tight text-orange-500 ">
          {creditToBeCharged} {unit}(s)
        </Text>
      </View>
    </View>
  );
};

const RenderPackageInfoAfterCharge: FC<IRenderPackageInfoProps> = ({
  title,
  avalaibleCredits,
  valueToCharge = 0,
  packageToCharge = 0,
}) => {
  const remainingCredit = packageToCharge
    ? avalaibleCredits - packageToCharge
    : avalaibleCredits - valueToCharge;

  return (
    <View className="flex flex-row items-center justify-between  py-1">
      <Text className=" text-md font-semibold leading-tight text-neutral-500">
        {title}:
      </Text>
      <View className="w-4" />
      <View>
        <Text className="text-center text-md font-semibold leading-tight text-orange-500 ">
          {remainingCredit}
        </Text>
      </View>
    </View>
  );
};

const RenderPackageInfoAfterCharge2: FC<IRenderPackageInfoProps> = ({
  title,
  avalaibleCredits,
  packageToCharge,
}) => {
  const remainingCredit = avalaibleCredits - packageToCharge;

  return (
    <View className="flex flex-row items-center justify-between  py-1">
      <View className="w-[60%] pr-2">
        <Text className=" text-md font-semibold leading-tight text-neutral-500">
          {title}:
        </Text>
      </View>

      <View className="w-[40%]">
        <Text className="text-center text-md font-semibold leading-tight text-orange-500 ">
          {remainingCredit > 0 ? remainingCredit : 0}
        </Text>
      </View>
    </View>
  );
};

const ChangeCompanyCreditDialogAndroid: FC<IChangeCompanyCreditDialogProps> = ({
  onClose,
  isVisible,
  onConfirm,
  numberOfChecksToChargeCompanyCredit,
  packageToChangeCompanyCredit,
}) => {
  const [packages, setPackages] = useState<IPackageResponse>(
    {} as IPackageResponse
  );
  const [isPackageAndCheckEnough, setIsPackageAndCheckEnough] =
    useState<boolean>(false);

  const { t } = useTranslation();
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    const fetchPackages = async () => {
      const currentLanguage = await getLanguageLocalStorage();
      try {
        const res = await serviceGetAllPackages(currentLanguage);
        setPackages(res.data);
      } catch (error) {
        console.error("get packages error", error);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    const packageToCharge = 1;
    if (packageToChangeCompanyCredit == "chat") {
      if (
        packages.avalaibleChatPackage >= packageToCharge &&
        packages.availableChats >= numberOfChecksToChargeCompanyCredit
      ) {
        setIsPackageAndCheckEnough(true);
      } else {
        setIsPackageAndCheckEnough(false);
      }
    }

    if (packageToChangeCompanyCredit == "videocall") {
      if (
        packages.availableCallPackage >= packageToCharge &&
        packages.availableCalls >= numberOfChecksToChargeCompanyCredit
      ) {
        setIsPackageAndCheckEnough(true);
      } else {
        setIsPackageAndCheckEnough(false);
      }
    }
  }, [packages, numberOfChecksToChargeCompanyCredit]);

  const renderPackageInfoData = [
    {
      title:
        packageToChangeCompanyCredit == "chat"
          ? t("dialog.package_info.basic")
          : t("dialog.package_info.premium"),
      avalaibleCredits:
        packageToChangeCompanyCredit == "chat"
          ? packages.avalaibleChatPackage
          : packages.availableCallPackage,
    },
    {
      title:
        packageToChangeCompanyCredit == "chat"
          ? t("dialog.package_info.number_of_chatcheck")
          : t("dialog.package_info.number_of_callcheck"),
      avalaibleCredits:
        packageToChangeCompanyCredit == "chat"
          ? packages.availableChats
          : packages.availableCalls,
    },
  ];

  const renderChargePackageInfoData = [
    {
      title:
        packageToChangeCompanyCredit == "chat"
          ? t("dialog.package_info.basic")
          : t("dialog.package_info.premium"),
      avalaibleCredits: 1,
    },
    {
      title:
        packageToChangeCompanyCredit == "chat"
          ? t("dialog.package_info.number_of_chatcheck")
          : t("dialog.package_info.number_of_callcheck"),
      avalaibleCredits: numberOfChecksToChargeCompanyCredit,
    },
  ];

  const renderPackageInfoAfterChargeData = [
    {
      title:
        packageToChangeCompanyCredit == "chat"
          ? t("dialog.package_info.basic")
          : t("dialog.package_info.premium"),
      avalaibleCredits:
        packageToChangeCompanyCredit == "chat"
          ? packages.avalaibleChatPackage
          : packages.availableCallPackage,
      packageToCharge: 1,
    },
    {
      title:
        packageToChangeCompanyCredit == "chat"
          ? t("dialog.package_info.number_of_chatcheck")
          : t("dialog.package_info.number_of_callcheck"),
      avalaibleCredits:
        packageToChangeCompanyCredit == "chat"
          ? packages.availableChats
          : packages.availableCalls,
      packageToCharge: numberOfChecksToChargeCompanyCredit,
    },
  ];

  return (
    <Dialog.Container
      visible={isVisible}
      contentStyle={{
        // width: 370,
        backgroundColor: "white",
      }}
    >
      <Dialog.Title>
        <Text
          className={clsx(
            isDarkMode ? "text-gray-medium" : "text-black-default"
          )}
        >
          {t("dialog.cart.summary")}
        </Text>
      </Dialog.Title>
      <View className="px-3">
        <View className="flex w-full flex-col pt-2">
          <Text
            className={clsx(
              "text-md font-semibold",
              isDarkMode ? "text-gray-medium" : "text-black-default"
            )}
          >
            {t("dialog.cart.current_credit")}
          </Text>
          <View className="flex w-full flex-col items-start justify-center p-2 pb-0">
            <FlatList
              data={renderPackageInfoData}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <RenderPackageInfo
                  title={item.title}
                  avalaibleCredits={item?.avalaibleCredits}
                />
              )}
              // style={{ flex: 1 }}
            />
          </View>
        </View>

        <View className="flex w-full flex-col  py-4">
          <Text
            className={clsx(
              "text-md font-semibold",
              isDarkMode ? "text-gray-medium" : "text-black-default"
            )}
          >
            {t("dialog.cart.credit_will_be_charged")}
          </Text>
          <View className="flex w-full flex-col items-start justify-center p-2 pb-0">
            <FlatList
              data={renderChargePackageInfoData}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <RenderChargePackageInfo
                  title={item.title}
                  creditToBeCharged={item?.avalaibleCredits}
                  unit={
                    item?.title == "Basic" || item?.title == "Premium"
                      ? "package"
                      : "check"
                  }
                />
              )}
              // style={{ flex: 1 }}
            />
          </View>
        </View>

        <View className="flex w-full flex-col  pt-2">
          <Text
            className={clsx(
              "text-md font-semibold",
              isDarkMode ? "text-gray-medium" : "text-black-default"
            )}
          >
            {t("dialog.cart.credit_after_charged")}
          </Text>
          <View className=" flex w-full flex-col items-start justify-center p-2 pb-0">
            <FlatList
              data={renderPackageInfoAfterChargeData}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <RenderPackageInfoAfterCharge2
                  title={item.title}
                  avalaibleCredits={item?.avalaibleCredits}
                  packageToCharge={item?.packageToCharge}
                />
              )}
              // style={{ flex: 1 }}
            />
          </View>
        </View>
        <View className="mt-2">
          {!isPackageAndCheckEnough && (
            <Text className="flex-wrap text-md font-medium text-red-500">
              {t("dialog.cart.not_enough_credit")}
            </Text>
          )}
        </View>
      </View>
      <Dialog.Button label={t("dialog.close")} onPress={onClose} />
      <Dialog.Button
        label={t("dialog.confirm")}
        onPress={debounce(onConfirm, 500)}
        bold
        disabled={!isPackageAndCheckEnough}
      />
    </Dialog.Container>
  );
};

export default ChangeCompanyCreditDialogAndroid;
