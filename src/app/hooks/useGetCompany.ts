import { useEffect } from "react";
import { serviceGetEmployeeList } from "../service/company";
import { useEmployeeListStore } from "../store/company-data";
import { useUserProfileStore } from "../store/user-store";

export const useGetListEmployee = () => {
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const { setEmployeeList } = useEmployeeListStore();
  const fetchEmployeeData = async () => {
    if (!userProfile?.id) return null;
    await serviceGetEmployeeList(userProfile?.id)
      .then((res) => {
        setEmployeeList(res.data);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    fetchEmployeeData();
  }, [userProfile?.id]);
};
