import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from "react-native";
import {
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { IChallenge } from "../../../../types/challenge";
import { RootStackParamList } from "../../../../navigation/navigation.type";

import MarkDone from "./assets/mark_done.svg";
import Empty from "./assets/emptyFollow.svg";
import { EmployeesItem } from "../../../../component/Profile/ProfileTabs/Company/Employees/Employees";
import { useUserProfileStore } from "../../../../store/user-store";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog/ConfirmDialog";
import Button from "../../../../component/common/Buttons/Button";
import AddIcon from "../../../../component/asset/add.svg";
import { serviceRemoveParticipants } from "../../../../service/challenge";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import GlobalDialogController from "../../../../component/common/Dialog/GlobalDialog/GlobalDialogController";
interface IParticipantsTabProps {
  participant?: {
    id: string;
    avatar: string;
    name: string;
    surname: string;
    challengeStatus?: string;
  }[];
  fetchParticipants?: () => void;
  challengeData: IChallenge;
  isLoadingParticipant?: boolean;
}

const ParticipantsCompanyTab: FC<IParticipantsTabProps> = ({
  participant = [],
  fetchParticipants,
  challengeData,
  isLoadingParticipant,
}) => {
  const [isShowModalRemove, setIsShowModalRemove] = useState({
    isShow: false,
    id: "",
  });

  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const removeEmployee = async (participantId: any) => {
    serviceRemoveParticipants(participantId, challengeData.id)
      .then(async (response) => {
        await fetchParticipants();
        GlobalToastController.showModal({
          message:
            t("toast.delete_participant_success") ||
            "Participant deleted successfully!",
        });
      })
      .catch((err) => {
        GlobalDialogController.showModal({
          title: t("dialog.err_title") || "Error",
          message: t("errorMessage:500") as string,
        });
      })
      .finally(() => {
        setIsShowModalRemove({ isShow: false, id: "" });
      });
  };

  const AddNewChallengeEmployeesButton = () => {
    const onAddNewEmployeeBtnPress = () => {
      navigation.navigate("AddNewParticipantScreen", {
        challengeId: challengeData.id,
      });
    };

    return (
      <View className="relative mt-4">
        <View className="h-12 ">
          <Button
            title={t("challenge_detail_screen.add_new_employees") as string}
            containerClassName="bg-gray-light"
            textClassName="text-black text-md font-semibold  ml-2"
            Icon={<AddIcon fill={"black"} />}
            onPress={onAddNewEmployeeBtnPress}
          />
        </View>
      </View>
    );
  };
  return (
    <View className={clsx("flex-1 px-4")}>
      {participant.length < challengeData.maximumPeople && <AddNewChallengeEmployeesButton />}

      {participant.length > 0 && (
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 16,
            rowGap: 20,
          }}
          ListHeaderComponent={
            challengeData?.maximumPeople ? (
              <Text className="text-h6 font-normal leading-6 text-gray-dark">
                {participant?.length || 0}/{challengeData.maximumPeople}
              </Text>) : null
          }
          data={participant}
          className="pt-2"
          showsVerticalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <EmployeesItem
                item={item}
                isCompany={userProfile?.companyAccount}
                navigation={navigation}
                setIsShowModal={setIsShowModalRemove}
              />
            );
          }}
          ListFooterComponent={<View className="h-20" />}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchParticipants && fetchParticipants();
            setRefreshing(false);
          }}
        />
      )}
      {participant.length == 0 && (
        <View className=" flex-1 items-center pt-16">
          <Empty />
          <Text className="text-h6 font-light leading-10 text-[#6C6E76]">
            {t("challenge_detail_screen.not_participants")}
          </Text>
        </View>
      )}
      <ConfirmDialog
        title={t("dialog.remove_participant.title") || ""}
        description={t("dialog.remove_participant.description") || ""}
        isVisible={isShowModalRemove.isShow}
        onClosed={() => setIsShowModalRemove({ isShow: false, id: "" })}
        closeButtonLabel={t("dialog.cancel") || ""}
        confirmButtonLabel={t("dialog.remove") || ""}
        onConfirm={() => removeEmployee(isShowModalRemove.id)}
      />
      {isLoadingParticipant && (
        <View className="flex flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

export default ParticipantsCompanyTab;
