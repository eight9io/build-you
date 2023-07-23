import { t } from "i18next";

import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";
import { serviceGetEmployeeList } from "../service/company";
import { serviceGetListFollowing } from "../service/profile";
import { useUserProfileStore } from "../store/user-data";

export const fetchNewFollowingData = (id: any, setFollowingList: any) => {
  const a = serviceGetListFollowing(id)
    .then((res) => {
      setFollowingList(res.data);
    })

    .catch((err) => {
      if (err.response.status == 404) {
        setFollowingList([]);
      } else {
        GlobalDialogController.showModal({
          title: "Error",
          message: t("errorMessage:500") as string,
        });
      }
    });
};
// ===== company ====
export const fetchListEmployee = (id: any, setEmployeeList: any) => {
  serviceGetEmployeeList(id)
    .then((res) => {
      setEmployeeList(res.data);
    })
    .catch((err) => {
      if (err.response.status == 404) setEmployeeList([]);
      GlobalDialogController.showModal({
        title: "Error",
        message: t("errorMessage:500") as string,
      });
    });
};
