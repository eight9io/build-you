import React, { FC, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import {
  NavigationProp,
  Route,
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { stringPriceToNumber, numberToStringPrice } from "../../utils/price";

import PlusSVG from "../../component/asset/plus.svg";
import MinusSVG from "../../component/asset/minus.svg";
import { useCreateChallengeDataStore } from "../../store/create-challenge-data-store";
import {
  createChallenge,
  createCompanyChallenge,
  updateChallengeImage,
} from "../../service/challenge";
import { AxiosResponse } from "axios";
import GlobalToastController from "../../component/common/Toast/GlobalToastController";
import GlobalDialogController from "../../component/common/Dialog/GlobalDialogController";
import { RootStackParamList } from "../../navigation/navigation.type";
import httpInstance from "../../utils/http";
import Spinner from "react-native-loading-spinner-overlay";
import ConfirmDialog from "../../component/common/Dialog/ConfirmDialog";
import { ICreateCompanyChallenge } from "../../types/challenge";
import { useUserProfileStore } from "../../store/user-store";

interface ICartScreenProps {
  route: Route<
    "CartScreen",
    {
      typeOfPackage: TPackageType;
      initialPrice: string;
    }
  >;
}

export type TPackageType = "basic" | "premium";

const CHECKPOINT_PRICE = 90;

const CartScreen: FC<ICartScreenProps> = ({ route }) => {
  const [numberOfCheckpoints, setNumberOfCheckpoints] = useState<number>(1);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [lowestCheckpointError, setLowestCheckpointError] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestSuccess, setIsRequestSuccess] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [newChallengeId, setNewChallengeId] = useState<string | null>(null);

  const { initialPrice, typeOfPackage } = route.params;
  const { t } = useTranslation();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { getCreateChallengeDataStore } = useCreateChallengeDataStore();

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  const isCurrentUserCompany = currentUser && currentUser?.companyAccount;

  useEffect(() => {
    setFinalPrice(
      stringPriceToNumber(initialPrice) + numberOfCheckpoints * CHECKPOINT_PRICE
    );
  }, [numberOfCheckpoints]);

  const handlePay = () => {
    console.log("handlePay");
  };

  const handleAddCheckpoint = () => {
    if (lowestCheckpointError) {
      setLowestCheckpointError(false);
    }
    setNumberOfCheckpoints((prev) => prev + 1);
  };

  const handleRemoveCheckpoint = () => {
    if (numberOfCheckpoints === 1) {
      setLowestCheckpointError(true);
      return;
    }
    setNumberOfCheckpoints((prev) => prev - 1);
  };

  const onClose = () => {
    navigation.goBack();
  };

  const onSumitCertifiedChallenge = async () => {
    const data = getCreateChallengeDataStore();
    setIsLoading(true);
    let newChallengeId: string | null = null;
    try {
      const { image, ...rest } = data; // Images upload will be handled separately
      const payload: ICreateCompanyChallenge = {
        ...rest,
        checkpoint: numberOfCheckpoints,
        achievementTime: data.achievementTime as Date,
      };

      let challengeCreateResponse: AxiosResponse;
      if (isCurrentUserCompany) {
        challengeCreateResponse = (await createCompanyChallenge(
          payload
        )) as AxiosResponse;
      } else {
        challengeCreateResponse = (await createChallenge(
          payload
        )) as AxiosResponse;
      }

      newChallengeId = challengeCreateResponse.data.id;
      // If challenge created successfully, upload image
      if (challengeCreateResponse.status === 200 || 201) {
        setNewChallengeId(challengeCreateResponse.data.id);
        if (image) {
          const challengeImageResponse = (await updateChallengeImage(
            {
              id: newChallengeId,
            },
            image
          )) as AxiosResponse;
          if (challengeImageResponse.status === 200 || 201) {
            GlobalToastController.showModal({
              message:
                t("toast.create_challenge_success") ||
                "Your challenge has been created successfully !",
            });

            const isChallengesScreenInStack = navigation
              .getState()
              .routes.some((route) => route.name === "Challenges");
            if (isChallengesScreenInStack) {
              navigation.dispatch(StackActions.popToTop());
            } else {
              // add ChallengesScreen to the stack
              navigation.navigate("Challenges");
            }

            if (isCurrentUserCompany) {
              navigation.navigate("Challenges", {
                screen: "CompanyChallengeDetailScreen",
                params: { challengeId: newChallengeId },
              });
            } else {
              navigation.navigate("Challenges", {
                screen: "PersonalChallengeDetailScreen",
                params: { challengeId: newChallengeId },
              });
            }

            setIsLoading(false);
            return;
          }
          setIsRequestSuccess(false);
          setIsShowModal(true);
          httpInstance.delete(
            `/challenge/delete/${challengeCreateResponse.data.id}`
          );
          GlobalDialogController.showModal({
            title: t("dialog.err_title"),
            message:
              t("error_general_message") ||
              "Something went wrong. Please try again later!",
          });
        }
        setIsLoading(false);
        setIsRequestSuccess(true);
        setIsShowModal(true);
      }
    } catch (error) {
      httpInstance.delete(`/challenge/delete/${newChallengeId}`);
      setIsLoading(false);
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message:
          t("error_general_message") ||
          "Something went wrong. Please try again later!",
      });
    }
  };

  const handleCloseModal = (newChallengeId: string | undefined) => {
    setIsShowModal(false);
    if (isRequestSuccess && newChallengeId) {
      onClose();
      navigation.navigate("Challenges", {
        screen: "PersonalChallengeDetailScreen",
        params: { challengeId: newChallengeId },
      });
    }
  };

  return (
    <SafeAreaView className="flex flex-1 flex-col items-center justify-between  bg-white ">
      {isLoading && <Spinner visible={isLoading} />}
      {isShowModal && (
        <ConfirmDialog
          title={
            isRequestSuccess
              ? t("dialog.success_title") || "Success"
              : t("dialog.err_title") || "Error"
          }
          description={
            isRequestSuccess
              ? t("dialog.create_challenge_success") ||
                "Your challenge has been created successfully !"
              : t("error_general_message") ||
                "Something went wrong. Please try again later."
          }
          isVisible={isShowModal}
          onClosed={() => handleCloseModal(newChallengeId)}
          closeButtonLabel={t("dialog.got_it") || "Got it"}
        />
      )}

      <View className="flex flex-col items-center justify-between space-y-4">
        <View
          className="mt-6 flex flex-col items-start justify-start rounded-2xl bg-slate-50 px-4"
          style={{
            width: 343,
          }}
        >
          <View className="flex w-full items-start justify-center rounded-tl-3xl pb-2 pt-4 ">
            <Text className="text-[16px] font-semibold uppercase leading-tight text-primary-default">
              {typeOfPackage === "basic"
                ? t("cart_screen.basic_packages")
                : t("cart_screen.premium_packages")}
            </Text>
          </View>

          <View className="flex w-full flex-col items-start justify-center gap-y-2">
            <Text className="text-start text-md font-normal leading-none text-zinc-500">
              {t("cart_screen.basic_package_description")}
            </Text>
            <View className="flex w-full flex-col items-start justify-start">
              <View className="flex w-full flex-col items-start justify-start space-y-2 py-2">
                {["Intake", "Check", "Closing"].map((item) => (
                  <Text
                    className="text-center text-md font-semibold leading-none text-neutral-700"
                    key={item}
                  >
                    {item}
                  </Text>
                ))}
                <View className="w-full border border-neutral-300"></View>
              </View>
              <View className="flex w-full items-end ">
                <Text className="text-end text-base font-semibold leading-snug text-orange-500">
                  {initialPrice} $
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          className="flex flex-col items-start justify-start rounded-2xl bg-slate-50 px-4 py-4"
          style={{
            width: 343,
          }}
        >
          <View className="flex w-full flex-col items-start justify-center gap-y-2">
            <Text className="text-start text-md font-normal leading-none text-zinc-500">
              Buy more Check touchpoints:
            </Text>
            <View className="flex w-full flex-col items-start justify-start">
              <View className="flex w-full flex-col items-start justify-start space-y-2 py-2">
                <View className="flex w-full flex-row items-center justify-between">
                  {["Check"].map((item) => (
                    <Text className="text-center text-md font-semibold leading-none text-neutral-700">
                      {item}
                    </Text>
                  ))}
                  <View className="flex flex-row items-center justify-between">
                    <TouchableOpacity
                      className="flex items-center justify-center rounded-[36px] border border-orange-500 "
                      style={{
                        height: 28,
                        width: 28,
                      }}
                      onPress={handleRemoveCheckpoint}
                    >
                      <MinusSVG />
                    </TouchableOpacity>
                    <View className="w-8">
                      <Text className="text-center text-md font-semibold leading-none text-neutral-700">
                        {numberOfCheckpoints}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="flex items-center justify-center rounded-2xl border border-orange-500 "
                      style={{
                        height: 28,
                        width: 28,
                      }}
                      onPress={handleAddCheckpoint}
                    >
                      <PlusSVG />
                    </TouchableOpacity>
                  </View>
                </View>
                {lowestCheckpointError && (
                  <View className="flex flex-row items-center justify-start">
                    <Text
                      className="pl-1 text-sm font-normal leading-5 text-red-500"
                      testID="minimum_checkpoint_error"
                    >
                      {t("cart_screen.minimum_checkpoint_error") ||
                        "At least 1 checkpoint is required"}
                    </Text>
                  </View>
                )}

                <View className="w-full border border-neutral-300"></View>
              </View>
              <View className="flex w-full items-end ">
                <Text className="text-end text-base font-semibold leading-snug text-orange-500">
                  {numberToStringPrice(CHECKPOINT_PRICE)} $
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          className="border-black flex w-full flex-row  border-t px-4"
          style={{
            width: 343,
          }}
        >
          <View className=" flex w-full flex-row items-center justify-between pt-3">
            <Text className=" text-base font-semibold uppercase leading-tight">
              Total
            </Text>
            <Text className=" text-base font-semibold leading-tight text-primary-default">
              {numberToStringPrice(finalPrice)} $
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="flex items-center justify-center rounded-full border border-orange-500 bg-orange-500 px-4"
        style={{
          height: 48,
          width: 344,
        }}
        onPress={onSumitCertifiedChallenge}
      >
        <Text className="text-center text-[14px] font-semibold leading-tight text-white">
          {t("cart_screen.pay") || "Pay"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CartScreen;
