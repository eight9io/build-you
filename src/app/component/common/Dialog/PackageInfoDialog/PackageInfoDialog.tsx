import { FC, useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { Dialog } from "@rneui/themed";
import {
  DIALOG_MAX_WIDTH,
  DRAWER_MAX_WIDTH,
  LAYOUT_THRESHOLD,
} from "../../../../common/constants";

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
  shouldOffsetDrawerWidth?: boolean;
}

interface IRenderPackageInfoProps {
  title: string;
  value: string | number;
}

const PackageInfoDialog: FC<IPackageInfoDialogProps> = ({
  packages,
  onClosed,
  isVisible,
  shouldOffsetDrawerWidth = true,
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
    <Dialog
      isVisible={isVisible}
      onBackdropPress={handleCancel}
      overlayStyle={{
        borderRadius: 20,
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        ...(Dimensions.get("window").width <=
        LAYOUT_THRESHOLD + DRAWER_MAX_WIDTH
          ? {}
          : {
              maxWidth: DIALOG_MAX_WIDTH,
              marginLeft: shouldOffsetDrawerWidth ? DRAWER_MAX_WIDTH : 0,
            }),
      }}
    >
      <Dialog.Title
        title={t("dialog.package_info.title")}
        titleStyle={{
          color: "black",
        }}
      />
      <View className="flex h-32 flex-col items-center justify-center p-2 pb-0">
        <FlatList
          data={packageInfo}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => renderPackageInfo(item)}
          style={{ flex: 1 }}
        />
      </View>
      <Dialog.Actions>
        {onClosed ? (
          <Dialog.Button
            title={t("dialog.close")}
            onPress={handleCancel}
            titleStyle={{
              fontSize: 17,
              lineHeight: 22,
              color: "#007AFF",
            }}
          />
        ) : null}
      </Dialog.Actions>
    </Dialog>
  );
};

export default PackageInfoDialog;
