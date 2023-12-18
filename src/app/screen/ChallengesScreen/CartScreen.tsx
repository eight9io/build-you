import { FC, useState, useEffect, useMemo, useRef } from "react";
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
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";
import Spinner from "react-native-loading-spinner-overlay";

import { getProducts as getProductsFromProvider } from "react-native-iap";

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
  getAllProductsFromStore,
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
  PRODUCT_PACKAGE_TYPE,
} from "../../common/enum";

interface ICartScreenProps {
  route: Route<
    "CartScreen",
    {
      choosenPackage: IPackage;
      checkPoint: ICheckPoint;
    }
  >;
}

const MAX_CHECKPOINT = 5;

const CartScreen: FC<ICartScreenProps> = ({ route }) => {
  const packagesPriceRef = useRef({});
  const [numberOfCheckpoints, setNumberOfCheckpoints] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<string>("0");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRequestSuccess, setIsRequestSuccess] = useState<boolean>(false);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [newChallengeId, setNewChallengeId] = useState<string | null>(null);
  const [purchaseErrorMessages, setPurchaseErrorMessages] =
    useState<string>("");

  const [allProductsFromDatabase, setAllProductsFromDatabase] = useState<
    IInAppPurchaseProduct[]
  >([]);

  const { choosenPackage } = route.params;

  const { name: packageName, type: typeOfPackage } = choosenPackage;

  const { setNewChallengeId: setNewChallengeIdToStore } =
    useNewCreateOrDeleteChallengeStore();

  const { t } = useTranslation();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { getCreateChallengeDataStore } = useCreateChallengeDataStore();

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  const isAndroid = Platform.OS === "android";

  const isCurrentUserCompany = currentUser && currentUser?.companyAccount;

  const getPackagePriceFromStore = async (productId: string) => {
    if (!productId) return;
    if (packagesPriceRef[productId]) {
      return setFinalPrice(packagesPriceRef[productId].localizedPrice);
    }

    const getPackageFromStore = async () => {
      try {
        setIsLoading(true);
        setPurchaseErrorMessages("");
        const packagesFromStore = await getProductsFromProvider({
          skus: [productId],
        });
        packagesPriceRef[productId] = packagesFromStore[0];
        setFinalPrice(packagesFromStore[0].localizedPrice);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      } catch (error) {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
        setFinalPrice("0");
        setPurchaseErrorMessages(t("error_general_message"));
      }
    };
    getPackageFromStore();
  };

  useEffect(() => {
    const selectedProduct = allProductsFromDatabase.find(
      (product) => product.quantity === numberOfCheckpoints + 1
    );

    if (!selectedProduct) return;
    getPackagePriceFromStore(selectedProduct.productId);
  }, [numberOfCheckpoints, allProductsFromDatabase]);

  useEffect(() => {
    (async function () {
      const allProducts = await getAllProductsFromStore();
      const currentPlatform = Platform.OS === "ios" ? "apple" : "google";
      const products = allProducts.filter((product) => {
        const packageTypeToBeFetch =
          typeOfPackage === "videocall"
            ? PRODUCT_PACKAGE_TYPE.VIDEO_CHALLENGE
            : PRODUCT_PACKAGE_TYPE.CHAT_CHALLENGE;
        return (
          product.platform === currentPlatform &&
          product.packageType === packageTypeToBeFetch
        );
      });
      setAllProductsFromDatabase(products);
    })();
  }, []);

  const handlePay = async (
    challengeId: string
  ): Promise<{
    purchaseStatus:
      | APPLE_IN_APP_PURCHASE_STATUS
      | GOOGLE_IN_APP_PURCHASE_STATUS;
  }> => {
    let productToBuy: IInAppPurchaseProduct = null;
    try {
      productToBuy = await getProductFromDatabase(
        typeOfPackage,
        numberOfCheckpoints // -1 because we already have 1 checkpoint in the base package
      );
      if (!productToBuy) throw new Error("Product not found");
    } catch (error) {
      console.log("Failed to fetch product", error);
      throw error;
    }

    let receipt: ProductPurchase = null;
    try {
      const purchaseResult = await requestPurchaseChecks(
        productToBuy.productId
      );

      if (purchaseResult) {
        receipt = Array.isArray(purchaseResult)
          ? purchaseResult[0]
          : purchaseResult;
      }
    } catch (error) {
      console.log("Request Purchase Error: ", error);
      throw error;
    }

    if (receipt) {
      try {
        const verificationRes = await verifyPurchase(receipt, challengeId);
        if (verificationRes) {
          return {
            purchaseStatus: verificationRes.purchaseStatus,
          };
        }
      } catch (error) {
        console.log("Verify Purchase Error: ", error);
        throw error;
      }
    }
  };

  const handleAddCheckpoint = () => {
    if (numberOfCheckpoints >= MAX_CHECKPOINT) {
      const translatedMessage = t("cart_screen.max_check_error", {
        MAX_CHECKPOINT: MAX_CHECKPOINT,
      });
      setPurchaseErrorMessages(translatedMessage);
      return;
    } else {
      setPurchaseErrorMessages("");
    }
    setNumberOfCheckpoints((prev) => prev + 1);
  };

  const handleRemoveCheckpoint = () => {
    if (numberOfCheckpoints <= MAX_CHECKPOINT) {
      setPurchaseErrorMessages("");
    }
    if (numberOfCheckpoints < 1) return;
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
        // Add 1 to the number of checkpoints because the base package already has 1 checkpoint
        checkpoint: numberOfCheckpoints + 1,
        achievementTime: data.achievementTime as Date,
      };

      let challengeCreateResponse: AxiosResponse;
      if (isCurrentUserCompany) {
        challengeCreateResponse = await createCompanyChallenge(payload);
      } else {
        challengeCreateResponse = await createChallenge(payload);
      }

      newChallengeId = challengeCreateResponse.data.id;
      setNewChallengeIdToStore(newChallengeId);
      // If challenge created successfully, upload image
      if (
        challengeCreateResponse.status === 200 ||
        challengeCreateResponse.status === 201
      ) {
        setNewChallengeId(challengeCreateResponse.data.id);
        if (image) {
          // Wait for payment to be processed
          let isPaymentPending = false;
          try {
            const { purchaseStatus } = await handlePay(newChallengeId);
            if (purchaseStatus) {
              const pendingStatus = Platform.select<
                APPLE_IN_APP_PURCHASE_STATUS | GOOGLE_IN_APP_PURCHASE_STATUS
              >({
                ios: APPLE_IN_APP_PURCHASE_STATUS.PENDING,
                android: GOOGLE_IN_APP_PURCHASE_STATUS.PENDING,
              });

              if (
                purchaseStatus.toLowerCase() === pendingStatus.toLowerCase()
              ) {
                isPaymentPending = true;
              }
            }
            setPurchaseErrorMessages("");
          } catch (error) {
            // Delete draft challenge if payment failed
            httpInstance.delete(`/challenge/delete/${newChallengeId}`);
            if (error.code !== ErrorCode.E_USER_CANCELLED) {
              setPurchaseErrorMessages(t("error_general_message"));
            }

            setTimeout(() => {
              setIsLoading(false);
            }, 100);
            return;
          }

          updateChallengeImage(
            {
              id: newChallengeId,
            },
            image
          );

          if (isPaymentPending) {
            // If payment is pending, challenge will be saved as draft => cannot navigate to challenge detail
            // => navigate to challenges screen instead

            // This dialog will be shown when all modals are closed
            setIsLoading(false);
            setTimeout(() => {
              navigation.navigate("Challenges");
              setTimeout(() => {
                GlobalDialogController.showModal({
                  title: t("payment_pending_modal.title"),
                  message: t("payment_pending_modal.description"),
                });
              }, 300);
            }, 100);

            return;
          }
          // This toast will be shown when all modals are closed
          setTimeout(() => {
            GlobalToastController.showModal({
              message:
                t("toast.create_challenge_success") ||
                "Your challenge has been created successfully !",
            });

            setTimeout(() => {
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
            }, 300);
          }, 100);
        }
        setIsRequestSuccess(true);
        setIsShowModal(true);
      }
    } catch (error) {
      httpInstance.delete(`/challenge/delete/${newChallengeId}`);
      setIsLoading(false);
      if (error.response && error.response.status === 400) {
        setTimeout(() => {
          GlobalDialogController.showModal({
            title: t("dialog.err_title"),
            message: error.response.data.message,
          }),
            100;
        });
        return;
      }
      setTimeout(() => {
        navigation.navigate("HomeScreen", {
          screen: "CreateChallengeScreenMain",
        });
        setTimeout(() => {
          GlobalToastController.showModal({
            message:
              t("error_general_message") ||
              "Something went wrong. Please try again later!",
          });
        }, 300);
      }, 100);
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
    <SafeAreaView className="flex flex-1 flex-col items-center justify-between  bg-white">
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

      {finalPrice === "0" && isLoading && <ActivityIndicator />}

      {finalPrice !== "0" && (
        <View>
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
                  <View className="flex w-full flex-col items-start justify-start space-y-2 py-2 pb-6">
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
                      <Text
                        className="text-center text-md font-semibold leading-none text-neutral-700"
                        key={"numberOfCheckCart"}
                      >
                        Check
                      </Text>
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

            <View
              className="border-black flex w-full flex-row  border-t px-4"
              style={{
                width: 343,
              }}
            >
              <View className=" flex w-full flex-row items-center justify-between pt-3">
                <Text className=" text-base font-semibold uppercase leading-tight">
                  {t("cart_screen.total")}
                </Text>
                <Text className=" text-base font-semibold leading-tight text-primary-default">
                  {finalPrice}
                </Text>
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
              isAndroid ? "my-6" : "my-4",
              finalPrice === "0" ? "opacity-50" : ""
            )}
            style={{
              height: 48,
              width: 344,
            }}
            disabled={finalPrice === "0" || isLoading}
            onPress={onSumitCertifiedChallenge}
          >
            <Text className="text-center text-[14px] font-semibold leading-tight text-white">
              {t("cart_screen.pay") || "Pay"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;
