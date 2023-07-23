import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";
import httpInstance, { setAuthTokenToHttpHeader } from "./http";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkUserCompleProfileAndCompany = async (
  setIsCompleteProfile: any,
  setIsMainAppLoading: any
) => {
  const fetchingUserData = async () => {
    try {
      setIsMainAppLoading(true);
      const authToken = await AsyncStorage.getItem("@auth_token");
      if (authToken) {
        setAuthTokenToHttpHeader(authToken);
      }
      await httpInstance.get("/user/me").then((res) => {
        if (res.data?.companyAccount === true) {
          setIsCompleteProfile(true);
        } else {
          if (res.data?.birth) {
            setIsCompleteProfile(true);
          } else {
            setIsCompleteProfile(false);
          }
        }
      });
      setIsMainAppLoading(false);
    } catch (error) {
      setIsMainAppLoading(false);
      GlobalDialogController.showModal({
        title: "Error",
        message:
          "Something went wrong when getting user data. Please try again later.",
      });
    }
  };

  fetchingUserData();
};
