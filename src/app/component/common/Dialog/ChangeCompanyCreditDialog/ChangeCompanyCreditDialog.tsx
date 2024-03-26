import { FC, useEffect, useState } from "react";
import { View, Text, Platform, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { Dialog } from "@rneui/themed";
import clsx from "clsx";
import debounce from "lodash.debounce";
import { serviceGetAllPackages } from "../../../../service/package";
import { IPackageResponse } from "../../../../types/package";
import { getLanguageLocalStorage } from "../../../../utils/language";

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
    <View className="flex w-full flex-row items-center justify-between py-1">
      <View className="flex w-2/3 ">
        <Text className=" text-md font-semibold leading-tight text-neutral-500">
          {title}
        </Text>
      </View>
      <View
        className={clsx(
          "flex w-1/3 flex-row items-center ",
          isAndroid ? "justify-end" : "justify-center"
        )}
      >
        <Text className="text-start text-md font-semibold leading-tight text-orange-500">
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
    <View className="flex w-full flex-row items-center justify-between py-1">
      <View className="flex w-2/3 ">
        <Text className="w-2/3 text-md font-semibold leading-tight text-neutral-500">
          {title}
        </Text>
      </View>
      <View className={clsx("flex w-1/3 flex-row items-center justify-center")}>
        <Text className=" text-center text-md font-semibold leading-tight text-orange-500">
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
    <View className="flex w-full flex-row items-center justify-between py-1">
      <View className="flex w-2/3 ">
        <Text className=" text-md font-semibold leading-tight text-neutral-500">
          {title}
        </Text>
      </View>
      <View
        className={clsx(
          "flex w-1/3 flex-row items-center ",
          isAndroid ? "justify-end" : "justify-center"
        )}
      >
        {remainingCredit >= 0 && (
          <Text className="text-center text-md font-semibold leading-tight text-orange-500">
            {remainingCredit}
          </Text>
        )}
        {remainingCredit < 0 && (
          <Text className=" text-center text-md font-semibold leading-tight text-orange-500">
            0
          </Text>
        )}
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
    <View className="flex w-full flex-row items-center justify-between py-1">
      <View className="flex w-2/3 ">
        <Text className=" text-md font-semibold leading-tight text-neutral-500">
          {title}
        </Text>
      </View>
      <View
        className={clsx(
          "flex w-1/3 flex-row items-center ",
          isAndroid ? "justify-end" : "justify-center"
        )}
      >
        {remainingCredit >= 0 && (
          <Text className=" text-center text-md font-semibold leading-tight text-orange-500">
            {remainingCredit}
          </Text>
        )}
        {remainingCredit < 0 && (
          <Text className=" text-center text-md font-semibold leading-tight text-orange-500">
            0
          </Text>
        )}
      </View>
    </View>
  );
};

const ChangeCompanyCreditDialogIos: FC<IChangeCompanyCreditDialogProps> = ({
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

  return (
    <Dialog
      isVisible={isVisible}
      onBackdropPress={onClose}
      overlayStyle={{
        borderRadius: 20,
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        ...(Dimensions.get("window").width <= 768 ? {} : { maxWidth: 600 }),
      }}
    >
      <Dialog.Title
        title={t("dialog.cart.summary")}
        titleStyle={{
          color: "black",
        }}
      />
      <View className="flex w-full flex-col pt-2">
        <Text className="text-md font-semibold text-black-default">
          {t("dialog.cart.current_credit")}
        </Text>
        <View className="flex w-full flex-col items-start justify-center p-2 pb-0">
          <RenderPackageInfo
            title={
              packageToChangeCompanyCredit == "chat"
                ? t("dialog.package_info.basic")
                : t("dialog.package_info.premium")
            }
            avalaibleCredits={
              packageToChangeCompanyCredit == "chat"
                ? packages.avalaibleChatPackage
                : packages.availableCallPackage
            }
          />
          <RenderPackageInfo
            title={
              packageToChangeCompanyCredit == "chat"
                ? t("dialog.package_info.number_of_chatcheck")
                : t("dialog.package_info.number_of_callcheck")
            }
            avalaibleCredits={
              packageToChangeCompanyCredit == "chat"
                ? packages.availableChats
                : packages.availableCalls
            }
          />
        </View>
      </View>

      <View className="flex w-full flex-col  py-4">
        <Text className="text-md font-semibold text-black-default">
          {t("dialog.cart.credit_will_be_charged")}
        </Text>
        <View className="flex w-full flex-col items-start justify-center p-2 pb-0">
          <RenderChargePackageInfo
            title={
              packageToChangeCompanyCredit == "chat"
                ? t("dialog.package_info.basic")
                : t("dialog.package_info.premium")
            }
            creditToBeCharged={1}
            unit="package"
          />

          <RenderChargePackageInfo
            title={
              packageToChangeCompanyCredit == "chat"
                ? t("dialog.package_info.number_of_chatcheck")
                : t("dialog.package_info.number_of_callcheck")
            }
            creditToBeCharged={numberOfChecksToChargeCompanyCredit}
            unit="check"
          />
        </View>
      </View>

      <View className="flex w-full flex-col  pt-2">
        <Text className="text-md font-semibold text-black-default">
          {t("dialog.cart.credit_after_charged")}
        </Text>
        <View className=" flex w-full flex-col items-start justify-center p-2 pb-0">
          <RenderPackageInfoAfterCharge
            title={
              packageToChangeCompanyCredit == "chat"
                ? t("dialog.package_info.basic")
                : t("dialog.package_info.premium")
            }
            avalaibleCredits={
              packageToChangeCompanyCredit == "chat"
                ? packages.avalaibleChatPackage
                : packages.availableCallPackage
            }
            packageToCharge={1}
          />

          <RenderPackageInfoAfterCharge2
            title={
              packageToChangeCompanyCredit == "chat"
                ? t("dialog.package_info.number_of_chatcheck")
                : t("dialog.package_info.number_of_callcheck")
            }
            avalaibleCredits={
              packageToChangeCompanyCredit == "chat"
                ? packages.availableChats
                : packages.availableCalls
            }
            packageToCharge={numberOfChecksToChargeCompanyCredit}
          />
        </View>
      </View>
      {!isPackageAndCheckEnough && (
        <Text className="text-md font-medium text-red-500">
          {t("dialog.cart.not_enough_credit")}
        </Text>
      )}
      <View className="mt-4 flex w-full flex-row">
        <Dialog.Button
          title={t("dialog.close")}
          onPress={onClose}
          titleStyle={{
            fontSize: 17,
            lineHeight: 22,
            color: "#007AFF",
          }}
          containerStyle={{
            flex: 1,
          }}
        />
        <Dialog.Button
          title={t("dialog.confirm")}
          disabled={!isPackageAndCheckEnough}
          className="font-bold"
          onPress={debounce(onConfirm, 500)}
          titleStyle={{
            fontWeight: "600",
            fontSize: 17,
            lineHeight: 22,
            color: "#007AFF",
          }}
          containerStyle={{
            flex: 1,
          }}
        />
      </View>
    </Dialog>
  );
};

export default ChangeCompanyCreditDialogIos;
