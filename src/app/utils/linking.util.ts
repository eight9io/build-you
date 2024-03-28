import { NavigationContainerRef } from "@react-navigation/native";
import { Linking } from "react-native";
import { RootStackParamList } from "../navigation/navigation.type";
import { IDeepLinkValue } from "../store/deep-link-store";
import { DEEP_LINK_PATH_NAME } from "../common/enum";
import NavigationService from "./navigationService";
import { setPurchasingChallengeData } from "./purchase.util";

export const LinkingConfig = {
  prefixes: [],
  config: {
    screens: {
      NotFound: "*",
      HomeScreen: {
        screens: {
          Feed: {
            initialRouteName: "FeedScreen",
            screens: {
              OtherUserProfileChallengeDetailsScreen: {
                path: "/challenge/:challengeId",
              },
              OtherUserProfileScreen: {
                path: "/user/:userId",
              },
              Challenges: {
                // initialRouteName: "PersonalChallengesScreen",
                screens: {
                  PersonalChallengeDetailScreen: {
                    path: "/payment/:challengeId?payment_success=:paymentSuccess",
                  },
                },
              },
            },
          },
          // Challenges: {
          //   initialRouteName: "PersonalChallengesScreen",
          //   screens: {
          //     PersonalChallengeDetailScreen: {
          //       path: "/payment/:challengeId?payment_success=:paymentSuccess",
          //     },
          //   },
          // },
        },
      },
    },
  },
};

export const handleDeepLinkToChallengeDetail = (
  deepLink: IDeepLinkValue,
  navigation: NavigationContainerRef<RootStackParamList>
) => {
  if (!deepLink) return;
  navigation.navigate("HomeScreen", {
    screen: "Feed",
    params: {
      screen: "OtherUserProfileChallengeDetailsScreen",
      params: {
        challengeId: deepLink.param,
      },
    },
  });
};

export const handleDeepLinkToOtherUserProfile = (
  deepLink: IDeepLinkValue,
  navigation: NavigationContainerRef<RootStackParamList>
) => {
  if (!deepLink) return;

  navigation.navigate("HomeScreen", {
    screen: "Feed",
    params: {
      screen: "OtherUserProfileScreen",
      params: {
        userId: deepLink.param,
      },
    },
  });
};

export const handleDeepLinkToPaidChallengeDetail = (
  deepLink: IDeepLinkValue,
  navigation: NavigationContainerRef<RootStackParamList>
) => {
  if (!deepLink) return;

  // Clear navigation state in local storage before navigating to the paid challenge detail screen => Navigation state is no need in this case (we only need it when user press back button)
  setPurchasingChallengeData(null);
  navigation.navigate("HomeScreen", {
    screen: "Challenges",
    params: {
      screen: "PersonalChallengeDetailScreen",
      params: {
        challengeId: deepLink.param,
      },
    },
  });
};

const deepLinkHandlerMap: Record<
  string,
  (
    deepLink: IDeepLinkValue,
    navigation: NavigationContainerRef<RootStackParamList>
  ) => void
> = {
  [DEEP_LINK_PATH_NAME.CHALLENGE_DETAIL]: handleDeepLinkToChallengeDetail,
  [DEEP_LINK_PATH_NAME.USER_PROFILE]: handleDeepLinkToOtherUserProfile,
  [DEEP_LINK_PATH_NAME.PAYMENT]: handleDeepLinkToPaidChallengeDetail,
};

export const handleDeepLinkNavigation = (deepLink: IDeepLinkValue) => {
  if (!deepLink) return;

  const handler = deepLinkHandlerMap[deepLink.pathName];
  const navigation = NavigationService.getContainer();
  if (handler) handler(deepLink, navigation);
};

export const isValidDeepLinkPath = (path: string) => {
  const pathSegments = path.split("/");
  if (pathSegments.length !== 2) return false; // If path is not in the format of pathName/param, it's invalid deep link path
  const [pathName, param] = pathSegments;
  const isValidPathName = Object.values(DEEP_LINK_PATH_NAME).includes(
    pathName as DEEP_LINK_PATH_NAME
  );
  const hasParam = !!param;
  return isValidPathName && hasParam;
};

export const getPathNameFromDeepLinkPath = (path: string) => {
  const [pathName] = path.split("/");
  return pathName;
};

export const getParamFromDeepLinkPath = (path: string) => {
  const [_, param] = path.split("/");
  return param;
};

export const openUrl = async (url: string) => {
  const isValidUrl = isValidHttpUrl(url);
  if (!isValidUrl) throw new Error("Invalid URL");
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error("error: ", error);
    throw error;
  }
};

export const isValidHttpUrl = (url: string) => {
  let urlObject;
  try {
    urlObject = new URL(url);
  } catch (error) {
    console.log("error: ", error);
    return false;
  }

  return urlObject.protocol === "http:" || urlObject.protocol === "https:";
};

export const openUrlInSameTab = (url: string) => {
  const isValidUrl = isValidHttpUrl(url);
  if (!isValidUrl) throw new Error("Invalid URL");
  try {
    window.open(url, "_self");
  } catch (error) {
    console.error("error: ", error);
    throw error;
  }
};
