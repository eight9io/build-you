import { FC, ReactNode } from "react";
import { View, Text } from "react-native";
import Dialog from "react-native-dialog";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  numberToPriceWithCommas,
  stringToPriceWithCommas,
} from "../../../utils/price";

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

const PackageInfoDialog: FC<IPackageInfoDialogProps> = ({
  packages,
  onClosed,
  isVisible,
}) => {
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
      <View className="flex w-full flex-row items-center justify-between py-1">
        <Text className="w-2/3 text-md font-semibold leading-tight text-neutral-700">
          {title}
        </Text>
        <Text className="w-1/3 text-center text-md font-semibold leading-tight text-orange-500">
          {value}
        </Text>
      </View>
    );
  };

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
                value: `$${numberToPriceWithCommas(
                  packages?.availableCredits
                )}`,
              })}
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
