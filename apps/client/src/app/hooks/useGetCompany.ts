import { useEffect } from "react";
import { serviceGetEmployeeList } from "../service/company";
import { useAuthStore } from "../store/auth-store";
import { useEmployeeListStore } from "../store/company-data";
import { useUserProfileStore } from "../store/user-data";


export const useGetListEmployee = () => {
    const { getAccessToken } = useAuthStore();
    const { getUserProfile } = useUserProfileStore();
    const isToken = getAccessToken();
    const userProfile = getUserProfile();
    const { setEmployeeList } = useEmployeeListStore();
    if (!isToken) return null;
    const fetchEmployeeData = async () => {
        if (!userProfile?.id) return null;
        await serviceGetEmployeeList(userProfile?.id)
            .then((res) => {
                setEmployeeList(res.data);
            })
            .catch((err) => {

            });
    };
    useEffect(() => {
        fetchEmployeeData();
    }, [userProfile?.id]);
};
