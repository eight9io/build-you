import clsx from "clsx";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import AddIcon from "./assets/addParticipant.svg";
import { IChallenge, ISoftSkill } from "../../../../types/challenge";
import { RootStackParamList } from "../../../../navigation/navigation.type";
import Empty from "./assets/emptyFollow.svg";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog";
import { EmployeesItem } from "../../../../component/Profile/ProfileTabs/Company/Employees/Employees";
import { useUserProfileStore } from "../../../../store/user-store";
import Button from "../../../../component/common/Buttons/Button";
import AddParticipantModal from "../../../../component/modal/company/AddParticipantModal";
import GlobalDialogController from "../../../../component/common/Dialog/GlobalDialogController";
import { serviceAddParticipants, serviceRemoveParticipants } from "../../../../service/challenge";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";

interface IParticipantsTabProps {
  participants?: {
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

const CompanyParticipantsTab: FC<IParticipantsTabProps> = ({
  participants = [],
  fetchParticipants,
  challengeData,
  employeeList
}) => {


  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isShowModalRemove, setIsShowModalRemove] = useState({
    isShow: false,
    id: "",
  });
  const [isShowModalAdd, setIsShowModalAdd] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const removeEmployee = async (participantId: any) => {
    serviceRemoveParticipants(participantId, challengeData.id)
      .then(async (response) => {
        await fetchParticipants()
        GlobalToastController.showModal({
          message:
            t("toast.delete_participant_success") ||
            "Participant deleted successfully!",
        });
      })
      .catch((err) => {
        console.log("🚀 ~ removeEmployee ~ err:", err)
        GlobalDialogController.showModal({
          title: t("dialog.err_title") || "Error",
          message: t("errorMessage:500") as string,
        });
      })
      .finally(() => {
        setIsShowModalRemove({ isShow: false, id: "" });
      }
      );
  };

  const handleAddParticipant = (participant: any) => {
    if (!userProfile?.companyAccount || !challengeData?.id) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title") || "Error",
        message: t("errorMessage:500") as string,
      });
      return;
    }
    const isParticipantOfList = participants.find((item: any) => item.email === participant.email);
    if (isParticipantOfList) {
      GlobalDialogController.showModal({
        title: t("dialog.err_add_participant.title"),
        message: t("dialog.err_add_participant.err_description"),
      });
      return;
    }
    else {
      serviceAddParticipants(participant?.id, challengeData?.id)
        .then(async (res) => {
          if (res.status === 200 || res.status === 201) {
            fetchParticipants()
          }
        })
        .catch((err) => {
          console.log("🚀 ~ handleAddParticipant ~ err:", err)
          GlobalDialogController.showModal({
            title: t("dialog.err_title") || "Error",
            message: t("errorMessage:500") as string,
          });
        });
    }


  }
  const AddNewChallengeParticipantButton = () => {
    return (
      <View className="relative pb-4 pt-4  ">
        <View className="h-[90px]">
          <Button
            title={t("add_participant_modal.title") as string}
            containerClassName="bg-gray-light "
            textClassName="text-black-default  text-md font-semibold  ml-2"
            Icon={<AddIcon fill={"white"} />}
            onPress={() => setIsShowModalAdd(true)}
          />
          {challengeData?.maximumPeople && <Text className="text-sm font-normal  text-gray-dark my-3">
            {participants?.length} / {challengeData?.maximumPeople}
          </Text>}
        </View>
      </View>
    );
  };
  return (
    <View className={clsx("flex-1 px-4")}>

      {participants.length > 0 && (
        <FlatList
          ListHeaderComponent={
            userProfile?.companyAccount ? (
              <AddNewChallengeParticipantButton />
            ) : null
          }
          data={participants}
          className="pt-4"
          showsVerticalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <EmployeesItem
              item={item}
              isCompany={userProfile?.companyAccount}
              navigation={navigation}
              setIsShowModal={setIsShowModalRemove}
            />
          )}
          ListFooterComponent={<View className="h-20" />}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchParticipants && fetchParticipants();
            setRefreshing(false);
          }}
        />
      )}
      {participants.length == 0 && (
        <>
          <AddNewChallengeParticipantButton />
          <View className=" flex-1 items-center pt-16">
            <Empty />
            <Text className="text-h6 font-light leading-10 text-[#6C6E76]">
              {t("challenge_detail_screen.not_participants")}
            </Text>
          </View>
        </>
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
      <AddParticipantModal
        isVisible={isShowModalAdd}
        onClose={() => setIsShowModalAdd(false)}
        employeeList={employeeList}
        handleAddParticipant={handleAddParticipant}
      />
    </View>
  );
};

export default CompanyParticipantsTab;
