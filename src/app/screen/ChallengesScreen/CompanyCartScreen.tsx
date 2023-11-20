import { FC, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  NavigationProp,
  Route,
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import { AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";
import Spinner from "react-native-loading-spinner-overlay";

import {
  createChallenge,
  createCompanyChallenge,
  updateChallengeImage,
} from "../../service/challenge";
import httpInstance from "../../utils/http";

import { ICheckPoint, IPackage } from "../../types/package";
import { ICreateCompanyChallenge } from "../../types/challenge";

import { useUserProfileStore } from "../../store/user-store";
import { useNewCreateOrDeleteChallengeStore } from "../../store/new-challenge-create-store";
import { useCreateChallengeDataStore } from "../../store/create-challenge-data-store";

import { RootStackParamList } from "../../navigation/navigation.type";
import ConfirmDialog from "../../component/common/Dialog/ConfirmDialog";
import GlobalDialogController from "../../component/common/Dialog/GlobalDialogController";
import GlobalToastController from "../../component/common/Toast/GlobalToastController";

import PlusSVG from "../../component/asset/plus.svg";
import MinusSVG from "../../component/asset/minus.svg";
import clsx from "clsx";
import {
  getCurrencySymbol,
  getProductFromDatabase,
  requestPurchaseChecks,
  verifyPurchase,
} from "../../utils/purchase.util";
import { IInAppPurchaseProduct } from "../../types/purchase";
import ErrorText from "../../component/common/ErrorText";
import { ErrorCode, ProductPurchase } from "react-native-iap";
import {
  APPLE_IN_APP_PURCHASE_STATUS,
  GOOGLE_IN_APP_PURCHASE_STATUS,
} from "../../common/enum";
import ChangeCompanyCreditDialog from "../../component/common/Dialog/ChangeCompanyCreditDialog";

interface ICartScreenProps {
  route: Route<
    "CompanyCartScreen",
    {
      choosenPackage: IPackage;
      checkPoint: ICheckPoint;
    }
  >;
}

const CompanyCartScreen: FC<ICartScreenProps> = ({ route }) => {
  // ensure this screen only render once as display credit is important
  const hasRendered = useRef(false);

  if (hasRendered.current) {
    return (
      <View className="flex w-full flex-1 items-center justify-center">
        <Text>Something went wrong, please return.</Text>
      </View>
    );
  }
  const [numberOfCheckpoints, setNumberOfCheckpoints] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRequestSuccess, setIsRequestSuccess] = useState<boolean>(false);
  const [isShowPaymentDetailModal, setIsShowPaymentDetailModal] =
    useState<boolean>(false);
  const [purchaseErrorMessages, setPurchaseErrorMessages] =
    useState<string>("");
  const { choosenPackage, checkPoint } = route.params;

  const {
    price: initialPrice,
    name: packageName,
    id: packgeId,
    type: typeOfPackage,
    currency,
  } = choosenPackage;

  const { setNewChallengeId: setNewChallengeIdToStore } =
    useNewCreateOrDeleteChallengeStore();

  const { t } = useTranslation();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { getCreateChallengeDataStore } = useCreateChallengeDataStore();

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  const isAndroid = Platform.OS === "android";

  const isCurrentUserCompany = currentUser && currentUser?.companyAccount;

  useEffect(() => {
    const newFinalPrice =
      Number(initialPrice) +
      Number(numberOfCheckpoints) * Number(checkPoint.price);
    setFinalPrice(isNaN(newFinalPrice) ? 0 : newFinalPrice);
  }, [numberOfCheckpoints]);

  const handleAddCheckpoint = () => {
    if (isLoading) return;
    setNumberOfCheckpoints((prev) => prev + 1);
  };

  const handleRemoveCheckpoint = () => {
    if (isLoading) return;
    if (numberOfCheckpoints < 1) return;
    setNumberOfCheckpoints((prev) => prev - 1);
  };

  const onSumitCertifiedChallenge = async () => {
    const data = getCreateChallengeDataStore();
    setIsShowPaymentDetailModal(false);
    setIsLoading(true);
    let newChallengeId: string | null = null;
    try {
      const { image, ...rest } = data; // Images upload will be handled separately
      const payload: ICreateCompanyChallenge = {
        ...rest,
        // Add 1 to the number of checkpoints because the base package already has 1 checkpoint
        checkpoint: numberOfCheckpoints + 1,
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
      setNewChallengeIdToStore(newChallengeId);
      // If challenge created successfully, upload image
      if (challengeCreateResponse.status === 200 || 201) {
        if (image) {
          (await updateChallengeImage(
            {
              id: newChallengeId,
            },
            image
          )) as AxiosResponse;

          // This toast will be shown when all modals are closed
          GlobalToastController.showModal({
            message:
              t("toast.create_challenge_success") ||
              "Your challenge has been created successfully !",
          });

          const isChallengesScreenInStack = navigation
            .getState()
            .routes.some((route) => route.name === "Challenges");
          if (isChallengesScreenInStack) {
            console.log("isChallengesScreenInStack");
            navigation.dispatch(StackActions.popToTop());
            if (isCurrentUserCompany) {
              const pushAction = StackActions.push("HomeScreen", {
                screen: "Challenges",
                params: {
                  screen: "CompanyChallengeDetailScreen",
                  params: { challengeId: newChallengeId },
                },
              });
              navigation.dispatch(pushAction);
            } else {
              const pushAction = StackActions.push("HomeScreen", {
                screen: "Challenges",
                params: {
                  screen: "PersonalChallengeDetailScreen",
                  params: { challengeId: newChallengeId },
                },
              });
              navigation.dispatch(pushAction);
            }
          } else {
            // add ChallengesScreen to the stack
            navigation.navigate("HomeScreen", {
              screen: "Challenges",
            });
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
          }

          setTimeout(() => {
            setIsLoading(false);
          }, 300);
          return;
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
        setIsRequestSuccess(true);
      }
    } catch (error) {
      httpInstance.delete(`/challenge/delete/${newChallengeId}`);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
      navigation.navigate("HomeScreen", {
        screen: "CreateChallengeScreenMain",
      });
      if (error.response && error.response.status === 400) {
        setTimeout(() => {
          GlobalDialogController.showModal({
            title: t("dialog.err_title"),
            message: error.response.data.message,
          }),
            1500;
        });
        return;
      }
      setTimeout(() => {
        GlobalToastController.showModal({
          message:
            t("error_general_message") ||
            "Something went wrong. Please try again later!",
        }),
          1500;
      });
    }
  };

  const hanldeShowPaymentDetailModal = () => {
    setIsShowPaymentDetailModal(true);
  };

  return (
    <SafeAreaView className="flex flex-1 flex-col items-center justify-between  bg-white">
      {isLoading && <Spinner visible={isLoading} />}
      <ChangeCompanyCreditDialog
        onClose={() => {
          setIsShowPaymentDetailModal(false);
        }}
        isVisible={isShowPaymentDetailModal}
        onConfirm={onSumitCertifiedChallenge}
        packagePrice={initialPrice}
        checkPointPrice={checkPoint.price}
        numberOfChecksToChargeCompanyCredit={numberOfCheckpoints}
        packageToChangeCompanyCredit={choosenPackage?.type}
      />

      <View className="flex flex-col flex-wrap items-center justify-between space-y-4">
        <View
          className="mt-6 flex flex-col items-start justify-start rounded-2xl bg-slate-50 px-4"
          style={{
            width: 343,
          }}
        >
          <View className="flex w-full items-start justify-center rounded-tl-3xl pb-2 pt-4 ">
            <Text className="text-[16px] font-semibold uppercase leading-tight text-primary-default">
              {packageName}
            </Text>
          </View>

          <View className="flex w-full flex-col items-start justify-center gap-y-2">
            <Text className="text-start text-md font-normal leading-none text-zinc-500">
              {choosenPackage?.caption}
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
              {t("cart_screen.select_checkpoints") ||
                "Select the number of Check points:"}
            </Text>
            <View className="flex w-full flex-col items-start justify-start">
              <View className="flex w-full flex-col items-start justify-start space-y-2 py-2">
                <View className="flex w-full flex-row items-center justify-between">
                  {["Check"].map((item) => (
                    <Text
                      className="text-center text-md font-semibold leading-none text-neutral-700"
                      key={"numberOfCheckCart"}
                    >
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
              </View>
            </View>
          </View>
        </View>

        <View className="mx-9 self-start">
          {purchaseErrorMessages && (
            <ErrorText
              message={purchaseErrorMessages}
              containerClassName="w-full"
              textClassName="flex-1"
            />
          )}
        </View>
      </View>

      <TouchableOpacity
        className={clsx(
          " flex items-center justify-center rounded-full border border-orange-500 bg-orange-500 px-4",
          isAndroid ? "my-6" : "my-4"
        )}
        style={{
          height: 48,
          width: 344,
        }}
        disabled={isLoading}
        onPress={hanldeShowPaymentDetailModal}
      >
        <Text className="text-center text-[14px] font-semibold leading-tight text-white">
          {isLoading ? (
            <ActivityIndicator color={"#FFFFFF"} />
          ) : (
            t("cart_screen.pay")
          )}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CompanyCartScreen;
