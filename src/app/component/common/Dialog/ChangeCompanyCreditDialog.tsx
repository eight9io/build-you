import { FC, ReactNode, useEffect, useState } from "react";
import { View, Text } from "react-native";
import Dialog from "react-native-dialog";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  numberToPriceWithCommas,
  stringToPriceWithCommas,
} from "../../../utils/price";
import { serviceGetAllPackages } from "../../../service/package";
import { IPackageResponse } from "../../../types/package";
import { getLanguageLocalStorage } from "../../../utils/language";

interface IChangeCompanyCreditDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  packagePrice: number;
  checkPointPrice: number;
  numberOfChecksToChargeCompanyCredit: number;
  packageToChangeCompanyCredit: "chat" | "videocall";
}

interface IRenderPackageInfoProps {
  title: string;
  avalaibleCredits: number;
  isDollarSign?: boolean;
  valueToCharge?: number;
  packageToCharge?: number;
  pricePerCheck?: number;
}

interface IRenderChargePackageInfoProps {
  title: string;
  valueInPackage: number;
  valueInCredit: number;
}

const RenderPackageInfo: FC<IRenderPackageInfoProps> = ({
  title,
  avalaibleCredits,
  isDollarSign,
}) => {
  return (
    <View className="flex w-full flex-row items-center justify-between py-1">
      <Text className="w-2/3 text-md font-semibold leading-tight text-neutral-500">
        {title}
      </Text>
      <Text className="w-1/3 text-center text-md font-semibold leading-tight text-orange-500">
        {isDollarSign && "$"}
        {avalaibleCredits}
      </Text>
    </View>
  );
};

const RenderChargePackageInfo: FC<IRenderChargePackageInfoProps> = ({
  title,
  valueInPackage,
  valueInCredit,
}) => {
  return (
    <View className="flex w-full flex-row items-center justify-between py-1">
      <Text className="w-2/3 text-md font-semibold leading-tight text-neutral-500">
        {title}
      </Text>
      <Text className="w-1/3 text-center text-md font-semibold leading-tight text-orange-500">
        {valueInPackage} or ${valueInCredit}
      </Text>
    </View>
  );
};

const RenderPackageInfoAfterCharge: FC<IRenderPackageInfoProps> = ({
  title,
  avalaibleCredits,
  valueToCharge = 0,
  packageToCharge = 0,
  isDollarSign = false,
}) => {
  const remainingCredit = packageToCharge
    ? avalaibleCredits - packageToCharge
    : avalaibleCredits - valueToCharge;

  return (
    <View className="flex w-full flex-row items-center justify-between py-1">
      <Text className="w-2/3 text-md font-semibold leading-tight text-neutral-500">
        {title}
      </Text>
      {remainingCredit >= 0 && (
        <Text className="w-1/3 text-center text-md font-semibold leading-tight text-orange-500">
          {isDollarSign && "$"}
          {remainingCredit}
        </Text>
      )}
      {remainingCredit < 0 && (
        <Text className="w-1/3 text-center text-md font-semibold leading-tight text-orange-500">
          0
        </Text>
      )}
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
    <View className="flex w-full flex-row items-center justify-between py-1">
      <Text className="w-2/3 text-md font-semibold leading-tight text-neutral-500">
        {title}
      </Text>
      {remainingCredit >= 0 && (
        <Text className="w-1/3 text-center text-md font-semibold leading-tight text-orange-500">
          {remainingCredit}
        </Text>
      )}
      {remainingCredit < 0 && (
        <Text className="w-1/3 text-center text-md font-semibold leading-tight text-orange-500">
          0
        </Text>
      )}
    </View>
  );
};

const RenderRemainingCredit: FC<IRenderPackageInfoProps> = ({
  title,
  avalaibleCredits,
  valueToCharge,
  isDollarSign,
}) => {
  const remainingCredit = avalaibleCredits - valueToCharge;
  return (
    <View className="flex w-full flex-row items-center justify-between py-1">
      <Text className="w-2/3 text-md font-semibold leading-tight text-neutral-500">
        {title}
      </Text>
      {remainingCredit > 0 && (
        <Text className="w-1/3 text-center text-md font-semibold leading-tight text-orange-500">
          {isDollarSign && "$"}
          {remainingCredit}
        </Text>
      )}
      {remainingCredit == 0 && (
        <Text className="w-1/3 text-center text-md font-semibold leading-tight text-orange-500">
          {isDollarSign && "$"}0
        </Text>
      )}
      {remainingCredit <= 0 && (
        <Text className="w-1/3 text-center text-md font-semibold leading-tight text-orange-500">
          -{isDollarSign && "$"}
          {Math.abs(remainingCredit)}
        </Text>
      )}
    </View>
  );
};

const ChangeCompanyCreditDialog: FC<IChangeCompanyCreditDialogProps> = ({
  onClose,
  isVisible,
  onConfirm,
  packagePrice,
  checkPointPrice,
  numberOfChecksToChargeCompanyCredit,
  packageToChangeCompanyCredit,
}) => {
  const [packages, setPackages] = useState<IPackageResponse>(
    {} as IPackageResponse
  );
  const [isPackageCreditEnough, setIsPackageCreditEnough] =
    useState<boolean>(true);
  const [totalAdditionalCredit, setTotalAdditionalCredit] = useState<number>(0);

  const { t } = useTranslation();

  const isUserHaveEnoughCredit =
    totalAdditionalCredit > packages?.availableCredits;

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
      if (packages.avalaibleChatPackage < packageToCharge) {
        setIsPackageCreditEnough(false);
        setTotalAdditionalCredit(packagePrice);
      } else {
        setIsPackageCreditEnough(true);
      }
      if (packages.availableChats < numberOfChecksToChargeCompanyCredit) {
        setIsPackageCreditEnough(false);
        const amountToChargeCredit =
          (numberOfChecksToChargeCompanyCredit - packages.availableChats) *
          checkPointPrice;

        setTotalAdditionalCredit((prev) => prev + amountToChargeCredit);
      }
    } else if (packageToChangeCompanyCredit == "videocall") {
      if (packages.availableCallPackage < packageToCharge) {
        setIsPackageCreditEnough(false);
        setTotalAdditionalCredit(packagePrice);
      } else {
        setIsPackageCreditEnough(true);
      }
      if (packages.availableCalls < numberOfChecksToChargeCompanyCredit) {
        const amountToChargeCredit =
          (numberOfChecksToChargeCompanyCredit - packages.availableChats) *
          checkPointPrice;
        setIsPackageCreditEnough(false);
        setTotalAdditionalCredit((prev) => prev + amountToChargeCredit);
      }
    }
  }, [packages, numberOfChecksToChargeCompanyCredit]);

  return (
    <Dialog.Container
      visible={isVisible}
      contentStyle={{
        width: 370,
        backgroundColor: "white",
      }}
    >
      <Dialog.Title>
        <Text className={clsx("text-black-default")}>
          {t("dialog.cart.summary")}
        </Text>
      </Dialog.Title>
      <Dialog.Description>
        <View className="flex flex-col pt-2">
          <Text className="text-md font-semibold text-black-default">
            {t("dialog.cart.current_credit")}
          </Text>
          <View className="flex flex-col items-start justify-center p-2 pb-0">
            <RenderPackageInfo
              title={t("dialog.package_info.basic")}
              avalaibleCredits={packages.avalaibleChatPackage || 0}
            />
            <RenderPackageInfo
              title={t("dialog.package_info.premium")}
              avalaibleCredits={packages.availableCallPackage || 0}
            />
            <RenderPackageInfo
              title={t("dialog.package_info.number_of_chatcheck")}
              avalaibleCredits={packages.availableChats || 0}
            />
            <RenderPackageInfo
              title={t("dialog.package_info.number_of_callcheck")}
              avalaibleCredits={packages.availableCalls || 0}
            />
            <RenderPackageInfo
              title={t("dialog.package_info.credits")}
              avalaibleCredits={packages?.availableCredits}
              isDollarSign
            />
          </View>
        </View>

        <View className="flex flex-col pt-2">
          <Text className="text-md font-semibold text-black-default">
            {t("dialog.cart.credit_will_be_charged")}
          </Text>
          <View className="flex flex-col items-start justify-center p-2 pb-0">
            <RenderChargePackageInfo
              title={
                packageToChangeCompanyCredit == "chat"
                  ? t("dialog.package_info.basic")
                  : t("dialog.package_info.premium")
              }
              valueInPackage={1}
              valueInCredit={packagePrice}
            />

            <RenderChargePackageInfo
              title={
                packageToChangeCompanyCredit == "chat"
                  ? t("dialog.package_info.number_of_chatcheck")
                  : t("dialog.package_info.number_of_callcheck")
              }
              valueInPackage={numberOfChecksToChargeCompanyCredit}
              valueInCredit={
                numberOfChecksToChargeCompanyCredit * checkPointPrice
              }
            />
          </View>
        </View>

        <View className="flex flex-col pt-2">
          <Text className="text-md font-semibold text-black-default">
            {t("dialog.cart.credit_after_charged")}
          </Text>
          <View className="flex flex-col items-start justify-center p-2 pb-0">
            <RenderPackageInfoAfterCharge
              title={t("dialog.package_info.basic")}
              avalaibleCredits={packages.avalaibleChatPackage || 0}
              valueToCharge={
                packageToChangeCompanyCredit == "chat" ? packagePrice : 0
              }
              packageToCharge={packageToChangeCompanyCredit == "chat" ? 1 : 0}
            />
            <RenderPackageInfoAfterCharge
              title={t("dialog.package_info.premium")}
              avalaibleCredits={packages.availableCallPackage || 0}
              packageToCharge={
                packageToChangeCompanyCredit == "videocall" ? 1 : 0
              }
              pricePerCheck={checkPointPrice}
            />
            <RenderPackageInfoAfterCharge2
              title={t("dialog.package_info.number_of_chatcheck")}
              avalaibleCredits={packages.availableChats || 0}
              packageToCharge={
                packageToChangeCompanyCredit == "chat"
                  ? numberOfChecksToChargeCompanyCredit
                  : 0
              }
              pricePerCheck={checkPointPrice}
            />
            <RenderPackageInfoAfterCharge2
              title={t("dialog.package_info.number_of_callcheck")}
              avalaibleCredits={packages.availableCalls || 0}
              packageToCharge={
                packageToChangeCompanyCredit == "videocall"
                  ? numberOfChecksToChargeCompanyCredit
                  : 0
              }
              pricePerCheck={checkPointPrice}
            />
            <RenderRemainingCredit
              title={t("dialog.package_info.credits")}
              avalaibleCredits={packages?.availableCredits}
              valueToCharge={totalAdditionalCredit}
              isDollarSign
            />
          </View>
        </View>
        {isUserHaveEnoughCredit && (
          <Text className="text-md font-medium text-red-500">
            {t("dialog.cart.not_enough_credit")}
          </Text>
        )}
      </Dialog.Description>
      <Dialog.Button label={t("dialog.close")} onPress={onClose} />
      <Dialog.Button
        label={t("dialog.confirm")}
        onPress={onConfirm}
        bold
        disabled={isUserHaveEnoughCredit}
      />
    </Dialog.Container>
  );
};

export default ChangeCompanyCreditDialog;
