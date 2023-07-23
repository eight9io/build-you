import { useEffect } from 'react';
import { serviceGetEmployeeList } from '../service/company';
import { useAuthStore } from '../store/auth-store';
import { useEmployeeListStore } from '../store/company-data';
import { useUserProfileStore } from '../store/user-data';

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
