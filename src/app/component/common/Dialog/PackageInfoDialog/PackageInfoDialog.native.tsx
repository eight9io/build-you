import { FC, ReactNode, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import Dialog from "react-native-dialog";
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

  return (
    <View>
      {isVisible && (
        <Dialog.Container
          visible={true}
          contentStyle={{
            width: 370,
            backgroundColor: "white",
          }}
        >
          <Dialog.Title>
            <Text className={clsx("text-black-default")}>
              {t("dialog.package_info.title")}
            </Text>
          </Dialog.Title>
          <Dialog.Description>
            <View className="flex h-32 flex-col items-center justify-center p-2 pb-0">
              <FlatList
                data={packageInfo}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => renderPackageInfo(item)}
                style={{ flex: 1 }}
              />
            </View>
          </Dialog.Description>
          {onClosed && (
            <Dialog.Button label={t("dialog.close")} onPress={handleCancel} />
          )}
        </Dialog.Container>
      )}
    </View>
  );
};

export default PackageInfoDialog;
