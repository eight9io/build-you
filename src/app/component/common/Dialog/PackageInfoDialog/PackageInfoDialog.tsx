import { FC, ReactNode, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  numberToPriceWithCommas,
  stringToPriceWithCommas,
} from "../../../../utils/price";

interface IPackageInfoDialogProps {
  packages: {
    avalaibleChatPackage: number;
    availableCallPackage: number;
    availableChats: number;
    availableCalls: number;
    availableCredits: number;
  };
  isVisible: boolean;
  onClosed: () => void;
}

interface IRenderPackageInfoProps {
  title: string;
  value: string | number;
}

const PackageInfoDialog: FC<IPackageInfoDialogProps> = ({
  packages,
  onClosed,
  isVisible,
}) => {
  const [packageInfo, setPackageInfo] =
    useState<IRenderPackageInfoProps[]>(null);
  const { t } = useTranslation();
  const handleCancel = () => {
    onClosed();
  };

  const renderPackageInfo: FC = ({
    title,
    value,
  }: {
    title: string;
    value: string | number;
  }) => {
    return (
      <View className="flex flex-row items-center justify-between py-1">
        <Text className="text-md font-semibold leading-tight text-neutral-700 ">
          {title}:
        </Text>
        <View className="w-4" />
        <Text className="text-center text-md font-semibold leading-tight text-orange-500 ">
          {value}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    const PACKAGE_INFO = [
      {
        title: t("dialog.package_info.basic"),
        value: 0,
      },
      {
        title: t("dialog.package_info.premium"),
        value: 0,
      },
      {
        title: t("dialog.package_info.number_of_checks"),
        value: 0,
      },
      {
        title: t("dialog.package_info.credits"),
        value: 0,
      },
    ];
    if (packages) {
      PACKAGE_INFO[0].value = packages.avalaibleChatPackage || 0;
      PACKAGE_INFO[1].value = packages.availableCallPackage || 0;
      PACKAGE_INFO[2].value = packages.availableChats + packages.availableCalls;
      PACKAGE_INFO[3].value = packages.availableCredits;
    }
    setPackageInfo(PACKAGE_INFO);
  }, [packages]);

  return <View></View>;
};

export default PackageInfoDialog;
