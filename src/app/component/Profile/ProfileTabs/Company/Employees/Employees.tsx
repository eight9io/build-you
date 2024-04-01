import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../common/Buttons/Button";

import AddIcon from "../../../../asset/add.svg";
import BinIcon from "../../../../asset/bin.svg";

import AddNewEmployeeModal from "../../../../modal/company/AddNewEmployeeModal";
import Empty from "../../../../asset/emptyFollow.svg";
import clsx from "clsx";
import { useUserProfileStore } from "../../../../../store/user-store";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../navigation/navigation.type";

import ConfirmDialog from "../../../../common/Dialog/ConfirmDialog/ConfirmDialog";
import GlobalDialogController from "../../../../common/Dialog/GlobalDialog/GlobalDialogController";
import { useEmployeeListStore } from "../../../../../store/company-data-store";
import {
  serviceAddEmployee,
  serviceRemoveEmployee,
} from "../../../../../service/company";
import { fetchListEmployee } from "../../../../../utils/profile";
import GlobalToastController from "../../../../common/Toast/GlobalToastController";
import { useNav } from "../../../../../hooks/useNav";

interface IEmployeesItemProps {
  item: any;
  isCompany?: boolean | null;
  navigation: any;
  setIsShowModal?: any;
  userId?: string;
}
interface IEmployeeProps {
  employeeList?: any;
}
export const EmployeesItem: FC<IEmployeesItemProps> = ({
  item,
  isCompany,
  navigation,
  setIsShowModal,
}) => {
  return (
    <View>
      <View className="flex flex-row items-center justify-between">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            // navigation.navigate('OtherUserProfileScreen', {
            //   userId: item.id,
            // })
            // use push
            navigation.push("OtherUserProfileScreen", {
              userId: item.id,
            })
          }
          className="flex flex-1 flex-row items-center space-x-3"
        >
          <View className="relative">
            <Image
              className={clsx("absolute left-0  top-0 h-10 w-10  rounded-full")}
              source={require("../../../../asset/avatar-load.png")}
            />
            <Image
              source={{ uri: item.avatar }}
              className="h-10 w-10 rounded-full"
            />
          </View>
          <Text className="pr-10 text-base font-semibold text-basic-black">
            {item.name} {item.surname}
          </Text>
        </TouchableOpacity>

        {isCompany ? (
          <TouchableOpacity
            onPress={() =>
              setIsShowModal && setIsShowModal({ isShow: true, id: item.id })
            }
          >
            <BinIcon fill={"black"} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
export const EmployeesItemOtherCompany: FC<IEmployeesItemProps> = ({
  item,

  navigation,
  setIsShowModal,
}) => {
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          // navigation.navigate('OtherUserProfileScreen', {
          //   userId: item.id,
          // })
          // use push
          navigation.push("OtherUserProfileScreen", {
            userId: item.id,
          })
        }
        className="flex-1 flex-row items-center space-x-3"
      >
        <View className="relative">
          <Image
            className={clsx("absolute left-0  top-0 h-10 w-10  rounded-full")}
            source={require("../../../../asset/avatar-load.png")}
          />
          <Image
            source={{ uri: item.avatar }}
            className="h-10 w-10 rounded-full"
          />
        </View>
        <Text className="text-base font-semibold text-basic-black">
          {item.name} {item.surname}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export const EmployeesTab: FC<IEmployeeProps> = ({}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { getEmployeeList, setEmployeeList } = useEmployeeListStore();
  const employeeList = getEmployeeList();
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const [isShowModalRemove, setIsShowModalRemove] = useState({
    isShow: false,
    id: "",
  });
  const [isShowModalAdd, setIsShowModalAdd] = useState(false);
  const removeEmployee = async (employeeId: any) => {
    serviceRemoveEmployee(employeeId, userProfile?.id)
      .then(async (response) => {
        await fetchListEmployee(userProfile?.id, (res: any) =>
          setEmployeeList(res)
        );
        GlobalToastController.showModal({
          message:
            t("toast.delete_employee_success") ||
            "Employee deleted successfully!",
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
    const navigation = useNav();
    const onAddNewEmployeeBtnPress = () => {
      navigation.navigate("AddNewEmployeeScreen");
    };

    return (
      <View className="relative">
        <View className="h-12">
          <Button
            title={t("challenge_detail_screen.add_new_employees") as string}
            containerClassName="bg-primary-default"
            textClassName="text-white text-md font-semibold  ml-2"
            Icon={<AddIcon fill={"white"} />}
            onPress={onAddNewEmployeeBtnPress}
          />
          {/* <AddNewEmployeeModal
            isVisible={isShowModalAdd}
            onClose={() => setIsShowModalAdd(false)}
          /> */}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      {employeeList.length > 0 ? (
        <FlatList
          data={employeeList}
          ListHeaderComponent={
            userProfile?.companyAccount ? (
              <AddNewChallengeEmployeesButton />
            ) : null
          }
          renderItem={({ item }) => (
            <EmployeesItem
              item={item}
              isCompany={userProfile?.companyAccount}
              navigation={navigation}
              setIsShowModal={setIsShowModalRemove}
            />
          )}
          contentContainerStyle={{
            paddingTop: 12,
            paddingHorizontal: 16,
            rowGap: 20,
          }}
          keyExtractor={(item, index) => item.id}
          ListFooterComponent={<View className="h-20" />}
        />
      ) : null}

      {employeeList.length == 0 && userProfile?.companyAccount ? (
        <>
          <View className="px-4 pt-3">
            <AddNewChallengeEmployeesButton />
          </View>
          <View className="mx-6 mb-[100px] mt-2 flex-1 items-center justify-center">
            <Empty />
            <View
              className={clsx(
                "mt-4 flex flex-col items-center justify-center text-[#6C6E76]"
              )}
            >
              <Text className={clsx("text-lg text-[#6C6E76]")}>
                {t("empty_employee.content_1")}
              </Text>
              <Text className={clsx("text-center text-lg text-[#6C6E76]")}>
                {t("empty_employee.content_2")}{" "}
                <Text className={clsx("text-primary-default")}>
                  {t("empty_employee.content_3")}{" "}
                </Text>
                {t("empty_employee.content_4")}{" "}
              </Text>
            </View>
          </View>
        </>
      ) : null}
      {employeeList.length == 0 && !userProfile?.companyAccount ? (
        <View className="align-center mt-[150px] items-center justify-center ">
          <Text className="text-lg text-gray-400 ">
            {t("empty_employee.content_1")}
          </Text>
        </View>
      ) : null}
      <ConfirmDialog
        title={t("dialog.remove_user.title") || ""}
        description={t("dialog.remove_user.description") || ""}
        isVisible={isShowModalRemove.isShow}
        onClosed={() => setIsShowModalRemove({ isShow: false, id: "" })}
        closeButtonLabel={t("dialog.cancel") || ""}
        confirmButtonLabel={t("dialog.remove") || ""}
        onConfirm={() => removeEmployee(isShowModalRemove.id)}
      />
    </View>
  );
};

export default EmployeesTab;
