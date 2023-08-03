import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/native";

import {
  IChallenge,
  IChallengeOwner,
  IProgressChallenge,
} from "../../../../types/challenge";
import { useUserProfileStore } from "../../../../store/user-store";
import {
  serviceRateChallenge,
  serviceGetChallengeRating,
} from "../../../../service/challenge";

import AddIcon from "../../../../component/asset/add.svg";
import Button from "../../../../component/common/Buttons/Button";
import ProgressCard from "../../../../component/Card/ProgressCard/ProgressCard";
import AddNewChallengeProgressModal from "../../../../component/modal/AddNewChallengeProgressModal";
import httpInstance from "../../../../utils/http";

import SkeletonLoadingCommon from "../../../../component/common/SkeletonLoadings/SkeletonLoadingCommon";
import EditChallengeProgressModal from "../../../../component/modal/EditChallengeProgressModal";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog";

import StarNoFillSvg from "../../../../common/svg/star-no-fill.svg";
import StarFillSvg from "../../../../common/svg/star-fill.svg";

interface IProgressTabProps {
  challengeData: IChallenge;
  isJoined?: boolean | null;
  isOtherUserProfile?: boolean;
  isChallengeCompleted?: boolean | null;
  setShouldRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IRatingResponse {
  rateAverage: number;
  entities: {
    createdAt: string;
    rating: number;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      surname: string;
    };
  }[];
}

const MAX_PROGRESS_VALUE = 5;

const RateChallengeSection = ({ challengeId }) => {
  const { t } = useTranslation();
  const [ratedValue, setRatedValue] = useState<number>(0);
  const [isRatedByCurrentUser, setIsRatedByCurrentUser] =
    useState<boolean>(false);
  const [valueRatedByCurrentUser, setValueRatedByCurrentUser] =
    useState<number>(0);
  const [showComfirmModal, setShowComfirmModal] = useState<boolean>(false);
  const [isRatingSuccess, setIsRatingSuccess] = useState<boolean>(false);
  const [isRatingError, setIsRatingError] = useState<boolean>(false);
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  useEffect(() => {
    const fetchChallengeRating = async () => {
      try {
        const res = await serviceGetChallengeRating(challengeId);
        const resData: IRatingResponse = res.data;
        const isRatedByCurrentUser = resData.entities.some(
          (entity) => entity.user.id === currentUser?.id
        );
        const valueRatedByCurrentUser = resData.entities.find(
          (entity) => entity.user.id === currentUser?.id
        )?.rating;
        setValueRatedByCurrentUser(valueRatedByCurrentUser);
        setIsRatedByCurrentUser(isRatedByCurrentUser);
      } catch (_) {
        setRatedValue(0);
      }
    };
    fetchChallengeRating();
  }, []);

  const handleRateChallenge = (index: number) => {
    setRatedValue(index + 1);
    setValueRatedByCurrentUser(index + 1);
    setShowComfirmModal(true);
  };

  const onCanceled = () => {
    setRatedValue(0);
    setShowComfirmModal(false);
    setIsRatingSuccess(false);
    setIsRatingError(false);
  };

  const onClosed = () => {
    setShowComfirmModal(false);
    setIsRatingSuccess(false);
    setIsRatingError(false);
  };

  const handleConfirm = async () => {
    setShowComfirmModal(false);
    try {
      await serviceRateChallenge(challengeId, ratedValue as number);
      setIsRatingSuccess(true);
      setIsRatedByCurrentUser(true);
    } catch (error) {
      setIsRatingError(true);
    }
  };

  return (
    <View className="flex w-full flex-row items-center justify-between gap-14 px-4 py-4">
      <ConfirmDialog
        isVisible={showComfirmModal}
        onClosed={onCanceled}
        onConfirm={handleConfirm}
        title={
          t("challenge_progress_tab.do_you_want_to_confirm_rating") ||
          "Do you want to confirm your rating?"
        }
        description={
          t("challenge_progress_tab.cannot_undo") ||
          "You cannot undo this action"
        }
      />
      <ConfirmDialog
        isVisible={isRatingSuccess}
        onConfirm={onClosed}
        title={
          t("challenge_progress_tab.rating_saved") ||
          "Your rating has been saved"
        }
      />
      <ConfirmDialog
        isVisible={isRatingError}
        onClosed={onCanceled}
        title={
          t("error_general_message") ||
          "Something went wrong. Please try again later."
        }
      />
      <View className="flex w-full flex-row justify-between">
        <Text className="text-lg font-medium">
          {t("challenge_progress_tab.rate_the_challenge") ||
            "Rate the challenge"}
        </Text>
        <View className="flex flex-row items-center">
          {Array.from(Array(MAX_PROGRESS_VALUE).keys()).map((_, index) => (
            <TouchableOpacity
              className="pr-4"
              key={`${index}`}
              disabled={isRatedByCurrentUser}
              onPress={() => handleRateChallenge(index as number)}
            >
              {valueRatedByCurrentUser > index ? (
                <StarFillSvg width={20} height={20} />
              ) : (
                <StarNoFillSvg width={20} height={20} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export const ProgressTab: FC<IProgressTabProps> = ({
  isJoined = false,
  challengeData,
  isChallengeCompleted = false,
  isOtherUserProfile = false,
  setShouldRefresh,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [localProgressData, setLocalProgressData] = useState<
    IProgressChallenge[]
  >([]);
  const [progressIndexToUpdate, setProgressIndexToUpdate] =
    useState<number>(-1);
  const [progressLoading, setProgressLoading] = useState<boolean>(true);
  const [isShowEditModal, setIsShowEditModal] = useState(false);

  const isFocused = useIsFocused();

  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();
  const challengeOwner: IChallengeOwner = Array.isArray(challengeData?.owner)
    ? challengeData?.owner[0]
    : challengeData.owner;
  const isCurrentUserOwnerOfChallenge = userData?.id === challengeOwner?.id;

  const isChallengeCompletedOrClosed =
    challengeData?.status === "closed" || challengeData?.status === "done";

  const isChallengeDoneByCurrentUser =
    challengeData.participants?.find(
      (participant) => participant.id === userData?.id
    )?.challengeStatus === "done";

  const { t } = useTranslation();

  useEffect(() => {
    const progressData =
      challengeData?.progress &&
      challengeData?.progress.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    progressData?.forEach((progress) => {
      httpInstance
        .get(`/challenge/progress/like/${progress.id}`)
        .then((res) => {
          progress.likes = res.data;
        })
        .catch((_) => {
          progress.likes = [];
        });
    });
    setLocalProgressData(progressData);
    setTimeout(() => {
      setProgressLoading(false);
    }, 800);
  }, [challengeData?.id, isFocused]);

  const refetch = () => {
    setProgressLoading(true);
    setShouldRefresh && setShouldRefresh(true);
    httpInstance.get(`/challenge/one/${challengeData.id}`).then((res) => {
      const progressDataLocal =
        res.data?.progress &&
        res.data?.progress.sort(
          (
            a: { createdAt: string | number | Date },
            b: { createdAt: string | number | Date }
          ) => {
            return (
              // TODO use dayjs.diff
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
        );

      setLocalProgressData(progressDataLocal);
      setTimeout(() => {
        setProgressLoading(false);
      }, 300);
    });
  };

  const handleEditProgress = () => {
    refetch();
  };

  const AddNewChallengeProgressButton = () => {
    return (
      <View className="pt-4">
        <View className="mx-4 ">
          <Button
            isDisabled={challengeData.status === "closed"}
            containerClassName="bg-primary-default flex-none px-1"
            textClassName="line-[30px] text-center text-md font-medium text-white ml-2"
            disabledContainerClassName="bg-gray-light flex-none px-1"
            disabledTextClassName="line-[30px] text-center text-md font-medium text-gray-medium ml-2"
            title={t("challenge_detail_screen.upload_new_progress") as string}
            Icon={
              <AddIcon
                fill={challengeData.status === "closed" ? "#C5C8D2" : "white"}
              />
            }
            onPress={() => setIsModalVisible(true)}
          />
          <AddNewChallengeProgressModal
            setProgressLoading={setProgressLoading}
            refetch={refetch}
            challengeId={challengeData.id}
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          />
        </View>
      </View>
    );
  };

  const handleConfirmEditChallengeProgress = async () => {
    setIsShowEditModal(false); // Close the edit modal
    handleEditProgress(); // Navigate to the challenge progresses screen to refresh the list
  };

  return (
    <View className="h-full flex-1">
      {progressIndexToUpdate > -1 && (
        <EditChallengeProgressModal
          progress={localProgressData[progressIndexToUpdate]}
          isVisible={isShowEditModal}
          onClose={() => setIsShowEditModal(false)}
          onConfirm={handleConfirmEditChallengeProgress}
        />
      )}
      {progressLoading && <SkeletonLoadingCommon />}

      {!progressLoading && (
        <FlatList
          data={localProgressData}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => {
            return (
              <>
                {(isJoined || isCurrentUserOwnerOfChallenge) &&
                  (!isChallengeCompleted ? (
                    <View>
                      <AddNewChallengeProgressButton />
                      {!progressLoading && localProgressData?.length == 0 && (
                        <View className="px-4 py-4">
                          <Text className="selection: text-base">
                            {
                              t(
                                "challenge_detail_screen.no_progress_yet"
                              ) as string
                            }
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : null)}
                {(isChallengeCompletedOrClosed ||
                  isChallengeDoneByCurrentUser) && (
                  <RateChallengeSection challengeId={challengeData.id} />
                )}
              </>
            );
          }}
          renderItem={({ item, index }) => (
            <ProgressCard
              isJoined={isJoined}
              userData={item.owner}
              isOtherUserProfile={isOtherUserProfile}
              itemProgressCard={item}
              challengeId={challengeData.id}
              challengeName={challengeData.goal}
              refetch={refetch}
              setIsShowEditModal={setIsShowEditModal}
              challengeOwner={(challengeData.owner as IChallengeOwner[])[0]}
              isChallengeCompleted={challengeData.status === "closed"}
              setProgressIndexToUpdate={() => setProgressIndexToUpdate(index)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
};

export default ProgressTab;
