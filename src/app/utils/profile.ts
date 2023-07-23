import { t } from "i18next";

import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";
import { serviceGetEmployeeList } from "../service/company";
import { serviceGetListFollowing } from "../service/profile";

export const fetchNewFollowingData = (id: any, setFollowingList: any) => {
  return serviceGetListFollowing(id)
    .then((res) => {
      setFollowingList(res.data);
    })
    .catch((err) => {
      // TODO handling of error should be delegated to where it is use
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
  return serviceGetEmployeeList(id)
    .then((res) => {
      setEmployeeList(res.data);
    })
    .catch((err) => {
      // TODO handling of error should be delegated to where it is use
      if (err.response.status == 404) setEmployeeList([]);
      GlobalDialogController.showModal({
        title: "Error",
        message: t("errorMessage:500") as string,
      });
    });
};
