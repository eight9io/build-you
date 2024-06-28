import clsx from "clsx";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from "@react-navigation/native";

import { IChallenge, ISoftSkill } from "../../../../types/challenge";
import { RootStackParamList } from "../../../../navigation/navigation.type";

import MarkDone from "./assets/mark_done.svg";
import Empty from "./assets/emptyFollow.svg";
import { EmployeesItem } from "../../../../component/Profile/ProfileTabs/Company/Employees/Employees";
import { useUserProfileStore } from "../../../../store/user-store";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog/ConfirmDialog";

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
  employeeList: any;
}

const ParticipantsTab: FC<IParticipantsTabProps> = ({
  participant = [],
  fetchParticipants,
  challengeData,
  employeeList
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

  const handlePushToOtherUserProfile = (userId: string) => {
    const pushAction = StackActions.push("OtherUserProfileScreen", {
      userId,
    });
    navigation.dispatch(pushAction);
  };
  const removeEmployee = async (participantId: any) => {
    console.log("🚀 ~ removeEmployee ~ participantId:", participantId)
    // serviceRemoveParticipants(participantId, challengeData.id)
    //   .then(async (response) => {
    //     await fetchParticipants()
    //     GlobalToastController.showModal({
    //       message:
    //         t("toast.delete_participant_success") ||
    //         "Participant deleted successfully!",
    //     });
    //   })
    //   .catch((err) => {
    //     console.log("🚀 ~ removeEmployee ~ err:", err)
    //     GlobalDialogController.showModal({
    //       title: t("dialog.err_title") || "Error",
    //       message: t("errorMessage:500") as string,
    //     });
    //   })
    //   .finally(() => {
    //     setIsShowModalRemove({ isShow: false, id: "" });
    //   }
    //   );
  };
  return (
    <View className={clsx("flex-1 px-4")}>
      {participant.length > 0 && (
        <FlatList
          data={participant}
          className="pt-4"
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
    </View>
  );
};

export default ParticipantsTab;
