import { serviceGetEmployeeList, serviceGetListFollowing } from "../service/profile";
import { useUserProfileStore } from "../store/user-data";


export const fetchNewFollowingData = (id: any, setFollowingList: any) => {
    serviceGetListFollowing(id)
        .then((res) => {
            setFollowingList(res.data)
        })

        .catch((err) => {
            if (err.response.status == 404) setFollowingList([])
        });

};
// ===== company ==== 
export const fetchListEmployee = (id: any, setEmployeeList: any) => {
    serviceGetEmployeeList(id)
        .then((res) => {
            setEmployeeList(res.data)

        })

        .catch((err) => {

            if (err.response.status == 404) setEmployeeList([])
        });

};

