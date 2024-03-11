import { NavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/navigation.type";
import { IDeepLinkValue } from "../store/deep-link-store";
import { DEEP_LINK_PATH_NAME } from "../common/enum";
import NavigationService from "./navigationService";

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
            },
          },
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

const deepLinkHandlerMap: Record<
  string,
  (
    deepLink: IDeepLinkValue,
    navigation: NavigationContainerRef<RootStackParamList>
  ) => void
> = {
  [DEEP_LINK_PATH_NAME.CHALLENGE_DETAIL]: handleDeepLinkToChallengeDetail,
  [DEEP_LINK_PATH_NAME.USER_PROFILE]: handleDeepLinkToOtherUserProfile,
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
