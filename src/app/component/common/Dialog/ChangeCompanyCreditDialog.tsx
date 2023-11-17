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
  numberOfChecksToChangeCompanyCredit: number;
  packageToChangeCompanyCredit: "chat" | "videocall";
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const renderPackageInfo: FC = ({
  title,
  value,
  valueToCharge,
}: {
  title: string;
  value: string | number;
  valueToCharge?: number;
}) => {
  //remove $ sign from value
  const valueWithoutDollarSign = value.toString().replace("$", "");
  const valueRemainAfterCharge = valueToCharge
    ? Number(valueWithoutDollarSign) - Number(valueToCharge)
    : valueWithoutDollarSign;

  return (
    <View className="flex w-full flex-row items-center justify-between py-1">
      <Text className="w-2/3 text-md font-semibold leading-tight text-neutral-700">
        {title}
      </Text>
      {!valueToCharge && (
        <Text className="w-1/3 text-center text-md font-semibold leading-tight text-orange-500">
          {value}
        </Text>
      )}
      {valueToCharge > 0 && (
        <Text className="w-1/3 text-center text-md font-semibold leading-tight text-orange-500">
          {valueRemainAfterCharge} {valueToCharge > 0 && `(-${valueToCharge})`}
        </Text>
      )}
    </View>
  );
};

const ChangeCompanyCreditDialog: FC<IChangeCompanyCreditDialogProps> = ({
  onClose,
  isVisible,
  onConfirm,
  numberOfChecksToChangeCompanyCredit,
  packageToChangeCompanyCredit,
}) => {
  const [packages, setPackages] = useState<IPackageResponse>(
    {} as IPackageResponse
  );
  const [isCreditEnough, setIsCreditEnough] = useState<boolean>(true);
  const { t } = useTranslation();

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
      const avalaibleChatPackage = packages?.avalaibleChatPackage;
      const remainCredit = avalaibleChatPackage - packageToCharge;
      if (remainCredit < 0) {
        setIsCreditEnough(false);
      }
    } else if (packageToChangeCompanyCredit == "videocall") {
      const availableCallPackage = packages?.availableCallPackage;
      const remainCredit = availableCallPackage - packageToCharge;
      if (remainCredit < 0) {
        setIsCreditEnough(false);
      }
    }
    // check if number of checks is enough
    const remainChecks = packages?.availableChats + packages?.availableCalls;
    if (remainChecks < numberOfChecksToChangeCompanyCredit) {
      setIsCreditEnough(false);
    }
  }, [
    packages,
    numberOfChecksToChangeCompanyCredit,
    packageToChangeCompanyCredit,
  ]);

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
        <Text className="text-md font-semibold text-black-default">
          {t("dialog.cart.current_credit")}
        </Text>
        <View className="flex flex-col items-start justify-center p-2 pb-0">
          {renderPackageInfo({
            title: t("dialog.package_info.basic"),
            value: packages.avalaibleChatPackage || 0,
          })}
          {renderPackageInfo({
            title: t("dialog.package_info.premium"),
            value: packages.availableCallPackage || 0,
          })}
          {renderPackageInfo({
            title: t("dialog.package_info.number_of_checks"),
            value:
              `${packages?.availableChats + packages?.availableCalls}` || 0,
          })}
          {renderPackageInfo({
            title: t("dialog.package_info.credits"),
            value: `$${numberToPriceWithCommas(packages?.availableCredits)}`,
          })}
        </View>
        <Text className="text-md font-semibold text-black-default">
          {t("dialog.cart.credit_after_charged")}
        </Text>
        <View className="flex flex-col items-start justify-center p-2 pb-0">
          {renderPackageInfo({
            title: t("dialog.package_info.basic"),
            value: packages.avalaibleChatPackage || 0,
            valueToCharge: packageToChangeCompanyCredit == "chat" ? 1 : 0,
          })}
          {renderPackageInfo({
            title: t("dialog.package_info.premium"),
            value: packages.availableCallPackage || 0,
            valueToCharge: packageToChangeCompanyCredit == "videocall" ? 1 : 0,
          })}
          {renderPackageInfo({
            title: t("dialog.package_info.number_of_checks"),
            value:
              `${packages?.availableChats + packages?.availableCalls}` || 0,
            valueToCharge: numberOfChecksToChangeCompanyCredit,
          })}
          {renderPackageInfo({
            title: t("dialog.package_info.credits"),
            value: `$${numberToPriceWithCommas(packages?.availableCredits)}`,
          })}
        </View>
        {!isCreditEnough && (
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
        disabled={!isCreditEnough}
      />
    </Dialog.Container>
  );
};

export default ChangeCompanyCreditDialog;
