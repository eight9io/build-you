import { t } from "i18next";

import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";
import { serviceGetEmployeeList } from "../service/company";
import { serviceGetListFollowing } from "../service/profile";
import { IOccupation, IUserData } from "../types/user";

export const fetchNewFollowingData = (id: any, setFollowingList: any) => {
  return serviceGetListFollowing(id)
    .then((res) => {
      setFollowingList(res.data);
    })
    .catch((err) => {
      if (err.response.status == 404) {
        setFollowingList([]);
      } else {
        GlobalDialogController.showModal({
          title: t("dialog.err_title"),
          message:
            (t("error_general_message") as string) || "Something went wrong",
        });
      }
    });
};
// ===== company ====
export const fetchListEmployee = async (
  id: string,
  setEmployeeList: Function
) => {
  return serviceGetEmployeeList(id)
    .then((res) => {
      setEmployeeList(res.data);
    })
    .catch((err) => {
      if (err.response.status == 404) setEmployeeList([]);
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message:
          (t("error_general_message") as string) || "Something went wrong",
      });
    });
};

export const getUserOccupationCondition = (userProfile: IUserData) => {
  if (!userProfile) return "";
  if (
    userProfile?.occupation &&
    userProfile?.occupation?.name.toLocaleUpperCase() !== "ALTRO"
  ) {
    return userProfile.occupation.name;
  } else {
    return userProfile.occupationDetail;
  }
};
